import type Anthropic from '@anthropic-ai/sdk';
import type { SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import { getInvestorById } from '../../data/investors';
import {
  insertInvestorFirmProfileExtractExchange,
  insertInvestorFirmProfileExtractRequest,
  insertInvestorFirmProfileExtractResponse,
  updateInvestorFirmProfileExtractRequest,
} from '../../data/investor-firm-profile-extract';
import { generateCompletion } from '../ai';
import { getModelConfig } from '../ai/model-config';
import type { InvestorFirmProfileExtraction, ProcessExtractInvestorFirmProfileResult } from './types';

const MAX_TEXT_LENGTH = 50000;

const SYSTEM_PROMPT = `You extract structured investor / VC / fund profile fields from messy pasted text (websites, PDFs, emails, LinkedIn dumps).

Return ONE JSON object only (no markdown fences), with these keys (use null when unknown):
{
  "suggestedName": string | null,
  "suggestedFirm": string | null,
  "firmBio": string | null,
  "firmInformation": string | null,
  "investmentSectors": string | null,
  "stageFocus": string | null,
  "typicalCheckSize": string | null,
  "officeAddress": string | null,
  "thesisNotes": string | null,
  "website": string | null
}

Rules:
- suggestedName = how the fund or person is commonly named as an investor (not necessarily legal entity).
- suggestedFirm = firm / fund brand name if distinct from suggestedName.
- firmBio = short narrative bio suitable for CRM.
- firmInformation = other factual bullets not covered elsewhere (portfolio themes, geography, structure).
- investmentSectors = comma-separated or short prose list of sectors/themes.
- stageFocus = stages they invest in (e.g. pre-seed–Series B).
- typicalCheckSize = typical check / round participation if stated.
- officeAddress = HQ or mailing address if present.
- thesisNotes = explicit thesis / mandate language if present.
- website = canonical fund / firm website URL (include https when obvious from source; null if unknown).
- Prefer null over empty strings.`;

const stripCodeFences = (raw: string): string => {
  let t = raw.trim();
  if (t.startsWith('```')) {
    t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }
  return t.trim();
};

const parseExtraction = (raw: string): InvestorFirmProfileExtraction => {
  const text = stripCodeFences(raw);
  const parsed = JSON.parse(text) as Record<string, unknown>;
  const str = (k: string): string | null => {
    const v = parsed[k];
    if (v === null || v === undefined) return null;
    const s = String(v).trim();
    return s.length ? s : null;
  };
  return {
    suggestedName: str('suggestedName'),
    suggestedFirm: str('suggestedFirm'),
    firmBio: str('firmBio'),
    firmInformation: str('firmInformation'),
    investmentSectors: str('investmentSectors'),
    stageFocus: str('stageFocus'),
    typicalCheckSize: str('typicalCheckSize'),
    officeAddress: str('officeAddress'),
    thesisNotes: str('thesisNotes'),
    website: str('website'),
  };
};

const persistOutcome = async (
  supabase: SupabaseClient,
  params: {
    userId: string;
    investorId: string;
    requestId: string;
    structured: unknown;
    usage: { input_tokens: number; output_tokens: number } | null;
    modelUsed: string;
    status: 'completed' | 'failed';
  },
): Promise<{ responseId: string; exchangeId: string }> => {
  const responseId = randomUUID();
  await insertInvestorFirmProfileExtractResponse(supabase, responseId, params.structured);
  const exchangeId = randomUUID();
  const inputTokens = params.usage?.input_tokens ?? 0;
  const outputTokens = params.usage?.output_tokens ?? 0;
  await insertInvestorFirmProfileExtractExchange(supabase, {
    id: exchangeId,
    userId: params.userId,
    investorId: params.investorId,
    requestId: params.requestId,
    responseId,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    modelUsed: params.modelUsed,
    status: params.status,
  });
  await updateInvestorFirmProfileExtractRequest(supabase, params.requestId, {
    responseId,
    status: params.status === 'completed' ? 'completed' : 'failed',
  });
  return { responseId, exchangeId };
};

/**
 * Runs firm-profile extraction for an investor.
 */
export const processExtractFirmProfile = async (
  supabase: SupabaseClient,
  anthropic: Anthropic | null,
  params: { userId: string; investorId: string; textBlob: string },
): Promise<ProcessExtractInvestorFirmProfileResult> => {
  const text = params.textBlob.trim();
  if (!text) throw new Error('textBlob is required');
  if (text.length > MAX_TEXT_LENGTH) throw new Error(`Text is too long (max ${MAX_TEXT_LENGTH} characters)`);

  const investor = await getInvestorById(supabase, params.investorId);
  if (!investor) throw new Error('Investor not found');

  const requestId = randomUUID();
  await insertInvestorFirmProfileExtractRequest(supabase, {
    id: requestId,
    userId: params.userId,
    investorId: params.investorId,
    content: text,
  });

  const modelConfig = getModelConfig('extract_investor_firm_profile');
  const modelUsed = modelConfig.model;

  if (!anthropic) {
    await persistOutcome(supabase, {
      userId: params.userId,
      investorId: params.investorId,
      requestId,
      structured: { error: 'AI service not configured' },
      usage: null,
      modelUsed: 'none',
      status: 'failed',
    });
    throw new Error('AI service not configured');
  }

  let responseText = '';
  let usage: { input_tokens: number; output_tokens: number } | null = null;
  try {
    const result = await generateCompletion(anthropic, {
      systemPrompt: SYSTEM_PROMPT,
      userMessage: `Current investor record (may be incomplete):\n${JSON.stringify(
        {
          name: investor.name,
          firm: investor.firm,
          website: investor.website,
          thesis_notes: investor.thesis_notes,
          stage_focus: investor.stage_focus,
        },
        null,
        2,
      )}\n\n---\n\nPasted source text:\n${text}`,
      model: modelConfig.model,
      temperature: modelConfig.temperature,
      maxTokens: modelConfig.maxTokens,
    });
    responseText = result.response;
    usage = result.usage;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Model request failed';
    console.error('❌ processExtractFirmProfile model:', e);
    await persistOutcome(supabase, {
      userId: params.userId,
      investorId: params.investorId,
      requestId,
      structured: { error: msg },
      usage: null,
      modelUsed,
      status: 'failed',
    });
    throw new Error(msg);
  }

  let extraction: InvestorFirmProfileExtraction;
  try {
    extraction = parseExtraction(responseText);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Invalid JSON from model';
    await persistOutcome(supabase, {
      userId: params.userId,
      investorId: params.investorId,
      requestId,
      structured: { error: 'Model returned invalid JSON', details: msg },
      usage,
      modelUsed,
      status: 'failed',
    });
    throw new Error('Model returned invalid JSON');
  }

  const { responseId, exchangeId } = await persistOutcome(supabase, {
    userId: params.userId,
    investorId: params.investorId,
    requestId,
    structured: extraction,
    usage,
    modelUsed,
    status: 'completed',
  });

  return { extraction, requestId, responseId, exchangeId };
};
