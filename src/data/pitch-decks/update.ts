import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckRow, UpdatePitchDeckInput } from './types';

/** Updates a pitch deck by id. */
export const updatePitchDeck = async (
  supabase: SupabaseClient,
  id: string,
  input: UpdatePitchDeckInput,
): Promise<PitchDeckRow> => {
  console.log('💾 updatePitchDeck', { id });
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) patch.name = input.name;
  if (input.status !== undefined) patch.status = input.status;
  const { data, error } = await supabase.from('pitch_decks').update(patch).eq('id', id).select('*').single();
  if (error) throw new Error(`Failed to update pitch deck: ${error.message}`);
  return data as PitchDeckRow;
};
