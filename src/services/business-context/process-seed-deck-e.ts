import type { SupabaseClient } from '@supabase/supabase-js';
import { seedDeckEBusinessContext } from '../../utils/business-context/seed-deck-e-business-context';
import { seedDeckEPitchDeck } from '../../utils/business-context/seed-deck-e-pitch-deck';

export type ProcessSeedDeckEInput = {
  userId: string;
  includePitchDeck?: boolean;
};

export type ProcessSeedDeckEResult = {
  businessContext: { sectionsCreated: number; factsUpserted: number };
  pitchDeck?: { pitchDeckId: string; slidesUpserted: number };
};

/** Seeds Deck E business context and optionally the pitch deck. */
export const processSeedDeckE = async (
  supabase: SupabaseClient,
  input: ProcessSeedDeckEInput,
): Promise<ProcessSeedDeckEResult> => {
  const businessContext = await seedDeckEBusinessContext(supabase, input.userId);
  const result: ProcessSeedDeckEResult = { businessContext };
  if (input.includePitchDeck) {
    result.pitchDeck = await seedDeckEPitchDeck(supabase, input.userId);
  }
  return result;
};
