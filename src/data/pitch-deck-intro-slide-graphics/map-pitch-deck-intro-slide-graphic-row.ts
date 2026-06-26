import type { PitchDeckIntroSlideGraphic, PitchDeckIntroSlideGraphicRow } from './types';

/** Maps a Supabase row to the API PitchDeckIntroSlideGraphic shape. */
export const mapPitchDeckIntroSlideGraphicRow = (
  row: PitchDeckIntroSlideGraphicRow,
): PitchDeckIntroSlideGraphic => ({
  id: row.id,
  pitchDeckId: row.pitch_deck_id,
  slideKey: row.slide_key,
  imageGraphicId: row.image_graphic_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
