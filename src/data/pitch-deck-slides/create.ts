import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreatePitchDeckSlideInput, PitchDeckSlideRow } from './types';

/** Inserts a new pitch deck slide row. */
export const createPitchDeckSlide = async (
  supabase: SupabaseClient,
  input: CreatePitchDeckSlideInput,
): Promise<PitchDeckSlideRow> => {
  console.log('💾 createPitchDeckSlide', { pitchDeckId: input.pitchDeckId, title: input.title });
  const { data, error } = await supabase
    .from('pitch_deck_slides')
    .insert({
      pitch_deck_id: input.pitchDeckId,
      title: input.title,
      template_key: input.templateKey ?? null,
      content_json: input.contentJson,
      position: input.position,
      updated_at: new Date().toISOString(),
    })
    .select('*')
    .single();
  if (error) throw new Error(`Failed to create pitch deck slide: ${error.message}`);
  return data as PitchDeckSlideRow;
};
