import type { SupabaseClient } from '@supabase/supabase-js';

/** Marks a studio request completed with exchange + response ids. */
export const updatePitchDeckSlideStudioRequestCompletion = async (
  supabase: SupabaseClient,
  requestId: string,
  patch: { exchangeId: string; responseId: string; status: 'completed' | 'failed' },
): Promise<void> => {
  console.log('💾 updatePitchDeckSlideStudioRequestCompletion', { requestId });
  const { error } = await supabase
    .from('pitch_deck_slide_studio_requests')
    .update({
      exchange_id: patch.exchangeId,
      response_id: patch.responseId,
      status: patch.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId);
  if (error) throw new Error(error.message);
};
