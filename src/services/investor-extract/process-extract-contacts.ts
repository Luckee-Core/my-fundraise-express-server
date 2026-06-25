import type Anthropic from '@anthropic-ai/sdk';
import type { SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import { getInvestorById } from '../../data/investors';
import {
  insertInvestorContactSheetExtractExchange,
  insertInvestorContactSheetExtractRequest,
  insertInvestorContactSheetExtractResponse,
  updateInvestorContactSheetExtractRequest,
} from '../../data/investor-contact-sheet-extract';
import { generateCompletion } from '../ai';
import { getModelConfig } from '../ai/model-config';
import type {
  InvestorContactSheetExtraction,
  ProcessExtractInvestorContactsResult,
} from './types';

const MAX_TEXT_LENGTH = 50000;

const SYSTEM_PROMPT = `You extract people / contacts for an investor CRM from pasted text (email threads, team pages, signatures, spreadsheets pasted as text).

Return ONE JSON object only (no markdown fences):
{
  "contacts": [
    { "name": string, "email": string, "role": string | null }
  ]
}

Rules:
- Every contact MUST have a non-empty name and a plausible email address.
- If email is missing, omit that person from contacts (do not invent emails).
- role may be null.
- De-duplicate the same email address.
- Order contacts roughly as they appear in the source.
- Include every distinct person with a valid email found in the source.`;

const stripCodeFences = (raw: string): string => {
  let t = raw.trim();
  if (t.startsWith('```')) {
    t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }
  return t.trim();
};

const parseExtraction = (raw: string): InvestorContactSheetExtraction => {
  const text = stripCodeFences(raw);
  const parsed = JSON.parse(text) as { contacts?: unknown };
  const rows = Array.isArray(parsed.contacts) ? parsed.contacts : [];
  const contacts: InvestorContactSheetExtraction['contacts'] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const r = row as Record<string, unknown>;
    const name = typeof r.name === 'string' ? r.name.trim() : '';
    const email = typeof r.email === 'string' ? r.email.trim().toLowerCase() : '';
    const role =
      r.role === null || r.role === undefined
        ? null
        : typeof r.role === 'string'
          ? r.role.trim() || null
          : null;
    if (!name || !email || !email.includes('@')) continue;
    if (seen.has(email)) continue;
    seen.add(email);
    contacts.push({ name, email, role });
  }
  return { contacts };
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
  await insertInvestorContactSheetExtractResponse(supabase, responseId, params.structured);
  const exchangeId = randomUUID();
  const inputTokens = params.usage?.input_tokens ?? 0;
  const outputTokens = params.usage?.output_tokens ?? 0;
  await insertInvestorContactSheetExtractExchange(supabase, {
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
  await updateInvestorContactSheetExtractRequest(supabase, params.requestId, {
    responseId,
    status: params.status === 'completed' ? 'completed' : 'failed',
  });
  return { responseId, exchangeId };
};

/**
 * Runs contact-sheet extraction for an investor.
 */
export const processExtractContacts = async (
  supabase: SupabaseClient,
  anthropic: Anthropic | null,
  params: { userId: string; investorId: string; textBlob: string },
): Promise<ProcessExtractInvestorContactsResult> => {
  const text = params.textBlob.trim();
  if (!text) throw new Error('textBlob is required');
  if (text.length > MAX_TEXT_LENGTH) throw new Error(`Text is too long (max ${MAX_TEXT_LENGTH} characters)`);

  const investor = await getInvestorById(supabase, params.investorId);
  if (!investor) throw new Error('Investor not found');

  const requestId = randomUUID();
  await insertInvestorContactSheetExtractRequest(supabase, {
    id: requestId,
    userId: params.userId,
    investorId: params.investorId,
    content: text,
  });

  const modelConfig = getModelConfig('extract_investor_contact_sheet');
  const modelUsed = modelConfig.model;

  if (!anthropic) {
    await persistOutcome(supabase, {
      userId: params.userId,
      investorId: params.investorId,
      requestId,
      structured: { error: 'AI service not configured', contacts: [] },
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
      userMessage: `Investor context (for disambiguation only):\n${JSON.stringify(
        { name: investor.name, firm: investor.firm },
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
    console.error('❌ processExtractContacts model:', e);
    await persistOutcome(supabase, {
      userId: params.userId,
      investorId: params.investorId,
      requestId,
      structured: { error: msg, contacts: [] },
      usage: null,
      modelUsed,
      status: 'failed',
    });
    throw new Error(msg);
  }

  let extraction: InvestorContactSheetExtraction;
  try {
    extraction = parseExtraction(responseText);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Invalid JSON from model';
    await persistOutcome(supabase, {
      userId: params.userId,
      investorId: params.investorId,
      requestId,
      structured: { error: 'Model returned invalid JSON', details: msg, contacts: [] },
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
