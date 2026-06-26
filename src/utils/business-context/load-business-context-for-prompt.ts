import type { SupabaseClient } from '@supabase/supabase-js';
import { listBusinessContextSectionsByUserId } from '../../data/business-context-sections/list-by-user-id';
import { listBusinessFactsByUserId } from '../../data/business-facts/list-by-user-id';

export type LoadBusinessContextForPromptInput = {
  userId: string;
  sectionKeys: string[];
};

export type BusinessContextSectionBlock = {
  sectionKey: string;
  label: string;
  facts: Array<{ factKey: string; factValue: string }>;
};

export type LoadBusinessContextForPromptResult = {
  blocks: BusinessContextSectionBlock[];
  formatted: string;
};

/** Formats section blocks into a prompt-ready markdown string. */
export const formatBusinessContextForPrompt = (
  blocks: BusinessContextSectionBlock[],
): string => {
  if (blocks.length === 0) return '';
  const lines = blocks.flatMap((block) => {
    const header = `## ${block.label}`;
    const factLines = block.facts.map((f) => `- ${f.factKey}: ${f.factValue}`);
    return [header, ...factLines, ''];
  });
  return `# Business context\n\n${lines.join('\n').trim()}`;
};

/**
 * Loads business facts for selected section keys and formats for AI prompt injection.
 */
export const loadBusinessContextForPrompt = async (
  supabase: SupabaseClient,
  input: LoadBusinessContextForPromptInput,
): Promise<LoadBusinessContextForPromptResult> => {
  const { userId, sectionKeys } = input;
  if (sectionKeys.length === 0) {
    return { blocks: [], formatted: '' };
  }

  const sections = await listBusinessContextSectionsByUserId(supabase, userId);
  const sectionKeySet = new Set(sectionKeys);
  const selectedSections = sections.filter((s) => sectionKeySet.has(s.sectionKey));
  const facts = await listBusinessFactsByUserId(supabase, userId);

  const factsBySectionId = new Map<string, Array<{ factKey: string; factValue: string }>>();
  for (const fact of facts) {
    const list = factsBySectionId.get(fact.sectionId) ?? [];
    list.push({ factKey: fact.factKey, factValue: fact.factValue });
    factsBySectionId.set(fact.sectionId, list);
  }

  const blocks: BusinessContextSectionBlock[] = selectedSections.map((section) => ({
    sectionKey: section.sectionKey,
    label: section.label,
    facts: factsBySectionId.get(section.id) ?? [],
  }));

  return {
    blocks,
    formatted: formatBusinessContextForPrompt(blocks),
  };
};
