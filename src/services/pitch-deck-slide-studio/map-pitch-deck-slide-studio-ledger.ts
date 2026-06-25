import type { SupabaseClient } from '@supabase/supabase-js';
import {
  listPitchDeckSlideStudioExchangesForDeckSlide,
  listPitchDeckSlideStudioRequestsByIds,
  listPitchDeckSlideStudioResponsesByIds,
  type PitchDeckSlideStudioExchangeRow,
} from '../../data/pitch-deck-slide-studio';

export type PitchDeckSlideStudioLedgerTurn = {
  exchangeId: string;
  createdAt: string;
  userContent: string;
  assistantContent: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  modelUsed: string;
  status: string;
};

const assistantTextFromStructured = (structured: Record<string, unknown>): string => {
  const c = structured.content;
  if (typeof c === 'string' && c.trim()) return c;
  return '';
};

/**
 * Maps DB rows to UI-friendly ledger turns (chronological order).
 */
export const buildPitchDeckSlideStudioLedgerTurns = async (
  supabase: SupabaseClient,
  pitchDeckId: string,
  slideKey: string,
  limit: number,
): Promise<PitchDeckSlideStudioLedgerTurn[]> => {
  const exchanges = await listPitchDeckSlideStudioExchangesForDeckSlide(
    supabase,
    pitchDeckId,
    slideKey,
    limit,
  );
  if (exchanges.length === 0) return [];

  const requestIds = [...new Set(exchanges.map((e) => e.request_id))];
  const responseIds = exchanges.map((e) => e.response_id).filter((id): id is string => Boolean(id));

  const [reqRows, resRows] = await Promise.all([
    listPitchDeckSlideStudioRequestsByIds(supabase, requestIds),
    listPitchDeckSlideStudioResponsesByIds(supabase, responseIds),
  ]);
  const reqById = new Map(reqRows.map((r) => [r.id, r]));
  const resById = new Map(resRows.map((r) => [r.id, r]));

  const turns: PitchDeckSlideStudioLedgerTurn[] = [];
  for (const ex of exchanges) {
    const req = reqById.get(ex.request_id);
    const res = ex.response_id ? resById.get(ex.response_id) : undefined;
    const structured = (res?.structured ?? {}) as Record<string, unknown>;
    turns.push({
      exchangeId: ex.id,
      createdAt: ex.created_at,
      userContent: req?.content ?? '',
      assistantContent: assistantTextFromStructured(structured),
      inputTokens: ex.input_tokens ?? 0,
      outputTokens: ex.output_tokens ?? 0,
      totalTokens: ex.total_tokens ?? 0,
      modelUsed: ex.model_used ?? 'none',
      status: ex.status,
    });
  }

  return turns.reverse();
};

/** Builds a single turn DTO from an exchange row. */
export const turnFromExchangeRow = (
  ex: PitchDeckSlideStudioExchangeRow,
  reqContent: string,
  assistantContent: string,
): PitchDeckSlideStudioLedgerTurn => ({
  exchangeId: ex.id,
  createdAt: ex.created_at,
  userContent: reqContent,
  assistantContent,
  inputTokens: ex.input_tokens ?? 0,
  outputTokens: ex.output_tokens ?? 0,
  totalTokens: ex.total_tokens ?? 0,
  modelUsed: ex.model_used ?? 'none',
  status: ex.status,
});
