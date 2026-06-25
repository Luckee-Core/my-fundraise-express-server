import type { SupabaseClient } from '@supabase/supabase-js';
import { getPitchDeckById } from './get-by-id';
import type { PitchDeckRow } from './types';

/** Creates a new version row from an existing pitch deck. */
export const createPitchDeckVersion = async (
  supabase: SupabaseClient,
  id: string,
): Promise<PitchDeckRow> => {
  console.log('💾 createPitchDeckVersion', { id });
  const currentDeck = await getPitchDeckById(supabase, id);
  if (!currentDeck) throw new Error('Pitch deck not found');
  const { data, error } = await supabase
    .from('pitch_decks')
    .insert({
      name: currentDeck.name,
      deck_type: currentDeck.deck_type,
      version_number: currentDeck.version_number + 1,
      status: 'draft',
      parent_deck_id: currentDeck.id,
      created_by_user_id: currentDeck.created_by_user_id,
    })
    .select('*')
    .single();
  if (error) throw new Error(`Failed to create pitch deck version: ${error.message}`);
  return data as PitchDeckRow;
};
