import type Anthropic from '@anthropic-ai/sdk';
import type { SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import {
  insertPitchDeckSlideStudioExchange,
  insertPitchDeckSlideStudioRequest,
  insertPitchDeckSlideStudioResponse,
  listPitchDeckSlideStudioExchangesChronological,
  listPitchDeckSlideStudioRequestsByIds,
  listPitchDeckSlideStudioResponsesByIds,
  updatePitchDeckSlideStudioRequestCompletion,
} from '../../data/pitch-deck-slide-studio';
import { getPitchDeckSlideByDeckAndTemplateKey } from '../../data/pitch-deck-slides';
import { generateCompletion } from '../ai';
import { getModelConfig } from '../ai/model-config';
import {
  buildPitchDeckSlideStudioSystemPrompt,
  buildPitchDeckSlideStudioUserPayload,
} from './build-pitch-deck-slide-studio-prompt';
import type { PitchDeckSlideStudioSlideKey } from './config';

const MS_24H = 24 * 60 * 60 * 1000;

const assistantTextFromStructured = (structured: Record<string, unknown>): string => {
  const c = structured.content;
  if (typeof c === 'string' && c.trim()) return c;
  return 'I could not produce a text reply.';
};

const loadRecentChatLines = async (
  supabase: SupabaseClient,
  pitchDeckId: string,
  slideKey: string,
  excludeRequestId: string,
): Promise<{ role: 'user' | 'assistant'; content: string }[]> => {
  const exchanges = await listPitchDeckSlideStudioExchangesChronological(
    supabase,
    pitchDeckId,
    slideKey,
    200,
  );
  const cutoff = Date.now() - MS_24H;
  const completed = exchanges.filter(
    (ex) =>
      ex.response_id &&
      ex.status === 'completed' &&
      new Date(ex.created_at).getTime() >= cutoff &&
      ex.request_id !== excludeRequestId,
  );
  if (completed.length === 0) return [];

  const requestIds = [...new Set(completed.map((ex) => ex.request_id))];
  const responseIds = completed.map((ex) => ex.response_id as string);
  const [reqRows, resRows] = await Promise.all([
    listPitchDeckSlideStudioRequestsByIds(supabase, requestIds),
    listPitchDeckSlideStudioResponsesByIds(supabase, responseIds),
  ]);
  const reqById = new Map(reqRows.map((r) => [r.id, r]));
  const resById = new Map(resRows.map((r) => [r.id, r]));

  const lines: { role: 'user' | 'assistant'; content: string }[] = [];
  for (const ex of completed) {
    const req = reqById.get(ex.request_id);
    if (req) lines.push({ role: 'user', content: req.content });
    const resp = ex.response_id ? resById.get(ex.response_id) : undefined;
    const s = (resp?.structured ?? {}) as Record<string, unknown>;
    lines.push({ role: 'assistant', content: assistantTextFromStructured(s) });
  }
  return lines;
};

const persistExchangeOutcome = async (
  supabase: SupabaseClient,
  params: {
    userId: string;
    pitchDeckId: string;
    slideKey: string;
    requestId: string;
    structured: Record<string, unknown>;
    ai: { inputTokens: number; outputTokens: number; totalTokens: number; modelUsed: string } | null;
    status: 'completed' | 'failed';
    errorMessage?: string | null;
  },
): Promise<void> => {
  const responseId = randomUUID();
  await insertPitchDeckSlideStudioResponse(supabase, responseId, params.structured);
  const exchangeId = randomUUID();
  await insertPitchDeckSlideStudioExchange(supabase, {
    id: exchangeId,
    userId: params.userId,
    pitchDeckId: params.pitchDeckId,
    slideKey: params.slideKey,
    requestId: params.requestId,
    responseId,
    inputTokens: params.ai?.inputTokens ?? 0,
    outputTokens: params.ai?.outputTokens ?? 0,
    totalTokens: params.ai?.totalTokens ?? 0,
    modelUsed: params.ai?.modelUsed ?? 'none',
    status: params.status,
    errorMessage: params.errorMessage ?? null,
  });
  await updatePitchDeckSlideStudioRequestCompletion(supabase, params.requestId, {
    exchangeId,
    responseId,
    status: params.status === 'completed' ? 'completed' : 'failed',
  });
};

/**
 * Persist user request, run coach AI for one slide, store response + exchange.
 */
export const processPitchDeckSlideStudioChat = async (
  supabase: SupabaseClient,
  anthropic: Anthropic | null,
  userId: string,
  pitchDeckId: string,
  slideKey: PitchDeckSlideStudioSlideKey,
  userMessageContent: string,
): Promise<void> => {
  const slideRow = await getPitchDeckSlideByDeckAndTemplateKey(supabase, pitchDeckId, slideKey);
  const slideContentJson = (slideRow?.content_json ?? {}) as Record<string, unknown>;

  const requestId = randomUUID();
  await insertPitchDeckSlideStudioRequest(supabase, {
    id: requestId,
    userId,
    pitchDeckId,
    slideKey,
    content: userMessageContent,
  });

  const fallback = 'I could not generate a detailed reply right now. Please try again in a moment.';

  try {
    const recentChat = await loadRecentChatLines(supabase, pitchDeckId, slideKey, requestId);

    if (!anthropic) {
      await persistExchangeOutcome(supabase, {
        userId,
        pitchDeckId,
        slideKey,
        requestId,
        structured: { content: 'AI is not configured. Add API keys to enable the coach.' },
        ai: null,
        status: 'completed',
      });
      return;
    }

    const systemPrompt = buildPitchDeckSlideStudioSystemPrompt(slideKey);
    const userPayload = buildPitchDeckSlideStudioUserPayload({
      slideKey,
      slideContentJson,
      recentLines: recentChat,
      userMessage: userMessageContent,
    });
    const modelConfig = getModelConfig('pitch_deck_slide_studio');
    const result = await generateCompletion(anthropic, {
      systemPrompt,
      userMessage: userPayload,
      model: modelConfig.model,
      temperature: modelConfig.temperature,
      maxTokens: modelConfig.maxTokens,
    });
    const structured = { content: result.response || fallback };

    await persistExchangeOutcome(supabase, {
      userId,
      pitchDeckId,
      slideKey,
      requestId,
      structured,
      ai: {
        inputTokens: result.usage.input_tokens,
        outputTokens: result.usage.output_tokens,
        totalTokens: result.usage.input_tokens + result.usage.output_tokens,
        modelUsed: modelConfig.model,
      },
      status: 'completed',
    });
  } catch (e: unknown) {
    console.error('❌ processPitchDeckSlideStudioChat error:', e);
    const msg = e instanceof Error ? e.message : 'Unknown error';
    try {
      await persistExchangeOutcome(supabase, {
        userId,
        pitchDeckId,
        slideKey,
        requestId,
        structured: { content: `${fallback} (${msg})` },
        ai: null,
        status: 'failed',
        errorMessage: msg,
      });
    } catch (persistErr: unknown) {
      console.error('❌ processPitchDeckSlideStudioChat failed to persist error outcome:', persistErr);
    }
  }
};
