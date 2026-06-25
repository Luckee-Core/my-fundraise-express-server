import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckSlideStudioRequestRow } from './types';

/** Loads studio request rows by ids. */
export const listPitchDeckSlideStudioRequestsByIds = async (
  supabase: SupabaseClient,
  ids: string[],
): Promise<PitchDeckSlideStudioRequestRow[]> => {
  if (ids.length === 0) return [];
  console.log('💾 listPitchDeckSlideStudioRequestsByIds', { count: ids.length });
  const { data, error } = await supabase
    .from('pitch_deck_slide_studio_requests')
    .select('id, user_id, pitch_deck_id, slide_key, content, exchange_id, response_id, status, created_at')
    .in('id', ids);
  if (error) throw new Error(error.message);
  return (data ?? []) as PitchDeckSlideStudioRequestRow[];
};
