import type { SupabaseClient } from '@supabase/supabase-js';
import { mapPitchDeckIntroSlideGraphicRow } from './map-pitch-deck-intro-slide-graphic-row';
import type {
  PitchDeckIntroSlideGraphic,
  PitchDeckIntroSlideGraphicRow,
  UpsertPitchDeckIntroSlideGraphicInput,
} from './types';

/** Upserts one intro slide graphic link by `(pitchDeckId, slideKey)`. */
export const upsertPitchDeckIntroSlideGraphic = async (
  supabase: SupabaseClient,
  input: UpsertPitchDeckIntroSlideGraphicInput,
): Promise<PitchDeckIntroSlideGraphic> => {
  console.log('💾 upsertPitchDeckIntroSlideGraphic', {
    pitchDeckId: input.pitchDeckId,
    slideKey: input.slideKey,
  });
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('pitch_deck_intro_slide_graphics')
    .upsert(
      {
        pitch_deck_id: input.pitchDeckId,
        slide_key: input.slideKey,
        image_graphic_id: input.imageGraphicId,
        updated_at: now,
      },
      { onConflict: 'pitch_deck_id,slide_key' },
    )
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapPitchDeckIntroSlideGraphicRow(data as PitchDeckIntroSlideGraphicRow);
};
