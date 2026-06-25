import type { SupabaseClient } from '@supabase/supabase-js';
import type { PitchDeckSlideStudioExchangeRow } from './types';

/** Lists exchanges for a deck + slide (newest first). */
export const listPitchDeckSlideStudioExchangesForDeckSlide = async (
  supabase: SupabaseClient,
  pitchDeckId: string,
  slideKey: string,
  limit: number,
): Promise<PitchDeckSlideStudioExchangeRow[]> => {
  console.log('💾 listPitchDeckSlideStudioExchangesForDeckSlide', { pitchDeckId, slideKey });
  const { data, error } = await supabase
    .from('pitch_deck_slide_studio_exchanges')
    .select(
      'id, user_id, pitch_deck_id, slide_key, request_id, response_id, input_tokens, output_tokens, total_tokens, model_used, status, error_message, created_at',
    )
    .eq('pitch_deck_id', pitchDeckId)
    .eq('slide_key', slideKey)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as PitchDeckSlideStudioExchangeRow[];
};
