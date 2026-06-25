import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckSlideStudioResponseRow } from './types';

/** Loads studio response rows by ids. */
export const listPitchDeckSlideStudioResponsesByIds = async (
  supabase: SupabaseClient,
  ids: string[],
): Promise<PitchDeckSlideStudioResponseRow[]> => {
  if (ids.length === 0) return [];
  console.log('💾 listPitchDeckSlideStudioResponsesByIds', { count: ids.length });
  const { data, error } = await supabase
    .from('pitch_deck_slide_studio_responses')
    .select('id, structured, created_at')
    .in('id', ids);
  if (error) throw new Error(error.message);
  return (data ?? []) as PitchDeckSlideStudioResponseRow[];
};
