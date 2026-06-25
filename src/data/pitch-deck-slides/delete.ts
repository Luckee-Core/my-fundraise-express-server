import type { SupabaseClient } from '@supabase/supabase-js';

/** Deletes a pitch deck slide by id. */
export const deletePitchDeckSlide = async (supabase: SupabaseClient, id: string): Promise<void> => {
  console.log('💾 deletePitchDeckSlide', { id });
  const { error } = await supabase.from('pitch_deck_slides').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete pitch deck slide: ${error.message}`);
};
