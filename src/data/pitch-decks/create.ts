import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreatePitchDeckInput, PitchDeckRow } from './types';

/** Inserts a new pitch deck. */
export const createPitchDeck = async (
  supabase: SupabaseClient,
  input: CreatePitchDeckInput,
): Promise<PitchDeckRow> => {
  console.log('💾 createPitchDeck', { name: input.name });
  const { data, error } = await supabase
    .from('pitch_decks')
    .insert({
      name: input.name,
      deck_type: input.deckType ?? 'intro_screener',
      created_by_user_id: input.createdByUserId ?? null,
    })
    .select('*')
    .single();
  if (error) throw new Error(`Failed to create pitch deck: ${error.message}`);
  return data as PitchDeckRow;
};
