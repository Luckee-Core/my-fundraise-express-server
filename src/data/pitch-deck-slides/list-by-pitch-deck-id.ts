import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckSlideRow } from './types';

/** Lists slides for a pitch deck ordered by position. */
export const listPitchDeckSlidesByPitchDeckId = async (
  supabase: SupabaseClient,
  pitchDeckId: string,
): Promise<PitchDeckSlideRow[]> => {
  console.log('💾 listPitchDeckSlidesByPitchDeckId', { pitchDeckId });
  const { data, error } = await supabase
    .from('pitch_deck_slides')
    .select('*')
    .eq('pitch_deck_id', pitchDeckId)
    .order('position', { ascending: true });
  if (error) throw new Error(`Failed to fetch pitch deck slides: ${error.message}`);
  return (data ?? []) as PitchDeckSlideRow[];
};
