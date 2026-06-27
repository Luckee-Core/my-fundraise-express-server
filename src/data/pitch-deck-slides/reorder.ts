import type { SupabaseClient } from '@supabase/supabase-js';
import type { ReorderPitchDeckSlidesInput } from './types';

/** Bulk-updates slide positions for a deck in the given order. */
export const reorderPitchDeckSlides = async (
  supabase: SupabaseClient,
  input: ReorderPitchDeckSlidesInput,
): Promise<void> => {
  console.log('💾 reorderPitchDeckSlides', {
    pitchDeckId: input.pitchDeckId,
    count: input.slideIds.length,
  });
  const now = new Date().toISOString();
  const updates = input.slideIds.map((slideId, position) =>
    supabase
      .from('pitch_deck_slides')
      .update({ position, updated_at: now })
      .eq('id', slideId)
      .eq('pitch_deck_id', input.pitchDeckId),
  );
  const results = await Promise.all(updates);
  const failed = results.find((result) => result.error);
  if (failed?.error) {
    throw new Error(`Failed to reorder pitch deck slides: ${failed.error.message}`);
  }
};
