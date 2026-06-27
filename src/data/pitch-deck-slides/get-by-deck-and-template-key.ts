import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckSlideRow } from './types';

/** Fetches one slide by deck id and template_key. */
export const getPitchDeckSlideByDeckAndTemplateKey = async (
  supabase: SupabaseClient,
  pitchDeckId: string,
  templateKey: string,
): Promise<PitchDeckSlideRow | null> => {
  console.log('💾 getPitchDeckSlideByDeckAndTemplateKey', { pitchDeckId, templateKey });
  const { data, error } = await supabase
    .from('pitch_deck_slides')
    .select('*')
    .eq('pitch_deck_id', pitchDeckId)
    .eq('template_key', templateKey)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch pitch deck slide: ${error.message}`);
  return (data ?? null) as PitchDeckSlideRow | null;
};
