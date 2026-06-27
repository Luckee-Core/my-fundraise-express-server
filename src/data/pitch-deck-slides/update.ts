import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckSlideRow, UpdatePitchDeckSlideInput } from './types';

/** Updates a pitch deck slide by id. */
export const updatePitchDeckSlide = async (
  supabase: SupabaseClient,
  input: UpdatePitchDeckSlideInput,
): Promise<PitchDeckSlideRow> => {
  console.log('💾 updatePitchDeckSlide', { id: input.id });
  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (input.title !== undefined) patch.title = input.title;
  if (input.templateKey !== undefined) patch.template_key = input.templateKey;
  if (input.contentJson !== undefined) patch.content_json = input.contentJson;
  if (input.position !== undefined) patch.position = input.position;

  const { data, error } = await supabase
    .from('pitch_deck_slides')
    .update(patch)
    .eq('id', input.id)
    .select('*')
    .single();
  if (error) throw new Error(`Failed to update pitch deck slide: ${error.message}`);
  return data as PitchDeckSlideRow;
};
