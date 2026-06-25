import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckSlideRow, UpsertPitchDeckSlideInput } from './types';

/** Upserts a pitch deck slide by deck + slide_key. */
export const upsertPitchDeckSlide = async (
  supabase: SupabaseClient,
  input: UpsertPitchDeckSlideInput,
): Promise<PitchDeckSlideRow> => {
  console.log('💾 upsertPitchDeckSlide', { pitchDeckId: input.pitchDeckId, slideKey: input.slideKey });
  const { data, error } = await supabase
    .from('pitch_deck_slides')
    .upsert(
      {
        pitch_deck_id: input.pitchDeckId,
        slide_key: input.slideKey,
        content_json: input.contentJson,
        position: input.position,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'pitch_deck_id,slide_key' },
    )
    .select('*')
    .single();
  if (error) throw new Error(`Failed to upsert pitch deck slide: ${error.message}`);
  return data as PitchDeckSlideRow;
};
