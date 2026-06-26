import type { SupabaseClient } from '@supabase/supabase-js';
import { mapPitchDeckIntroSlideGraphicRow } from './map-pitch-deck-intro-slide-graphic-row';
import type { PitchDeckIntroSlideGraphic, PitchDeckIntroSlideGraphicRow } from './types';

/** Lists intro slide graphics for one pitch deck. */
export const listPitchDeckIntroSlideGraphicsByPitchDeckId = async (
  supabase: SupabaseClient,
  pitchDeckId: string,
): Promise<PitchDeckIntroSlideGraphic[]> => {
  console.log('💾 listPitchDeckIntroSlideGraphicsByPitchDeckId', { pitchDeckId });
  const { data, error } = await supabase
    .from('pitch_deck_intro_slide_graphics')
    .select('*')
    .eq('pitch_deck_id', pitchDeckId)
    .order('slide_key', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapPitchDeckIntroSlideGraphicRow(row as PitchDeckIntroSlideGraphicRow));
};
