import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckSlideRow } from './types';

/** Fetches one slide by deck id and slide_key. */
export const getPitchDeckSlideByDeckAndSlideKey = async (
  supabase: SupabaseClient,
  pitchDeckId: string,
  slideKey: string,
): Promise<PitchDeckSlideRow | null> => {
  console.log('💾 getPitchDeckSlideByDeckAndSlideKey', { pitchDeckId, slideKey });
  const { data, error } = await supabase
    .from('pitch_deck_slides')
    .select('*')
    .eq('pitch_deck_id', pitchDeckId)
    .eq('slide_key', slideKey)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch pitch deck slide: ${error.message}`);
  return (data ?? null) as PitchDeckSlideRow | null;
};
