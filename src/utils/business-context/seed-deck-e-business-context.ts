import type { SupabaseClient } from '@supabase/supabase-js';
import { createBusinessContextSection } from '../../data/business-context-sections';
import { listBusinessContextSectionsByUserId } from '../../data/business-context-sections/list-by-user-id';
import { upsertBusinessFact } from '../../data/business-facts';
import { DECK_E_SEED_FACTS, DECK_E_SEED_SECTIONS } from './deck-e-seed-data';

export type SeedDeckEBusinessContextResult = {
  sectionsCreated: number;
  factsUpserted: number;
};

/**
 * Seeds Deck E business context sections and atomic facts for a user.
 * Upserts sections by section_key and facts by (section, fact_key).
 */
export const seedDeckEBusinessContext = async (
  supabase: SupabaseClient,
  userId: string,
): Promise<SeedDeckEBusinessContextResult> => {
  console.log('💾 seedDeckEBusinessContext', { userId });
  const existing = await listBusinessContextSectionsByUserId(supabase, userId);
  const sectionIdByKey = new Map(existing.map((s) => [s.sectionKey, s.id]));

  let sectionsCreated = 0;
  for (const section of DECK_E_SEED_SECTIONS) {
    if (sectionIdByKey.has(section.sectionKey)) continue;
    const created = await createBusinessContextSection(supabase, {
      userId,
      sectionKey: section.sectionKey,
      label: section.label,
      description: section.description,
      sortOrder: section.sortOrder,
    });
    sectionIdByKey.set(section.sectionKey, created.id);
    sectionsCreated += 1;
  }

  let factsUpserted = 0;
  for (const fact of DECK_E_SEED_FACTS) {
    const sectionId = sectionIdByKey.get(fact.sectionKey);
    if (!sectionId) continue;
    await upsertBusinessFact(supabase, {
      userId,
      sectionId,
      factKey: fact.factKey,
      factValue: fact.factValue,
      sortOrder: fact.sortOrder,
    });
    factsUpserted += 1;
  }

  console.log('✅ seedDeckEBusinessContext', { sectionsCreated, factsUpserted });
  return { sectionsCreated, factsUpserted };
};
