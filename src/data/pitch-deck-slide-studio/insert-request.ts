import type { SupabaseClient } from '@supabase/supabase-js';

/** Inserts a pitch deck slide studio user request. */
export const insertPitchDeckSlideStudioRequest = async (
  supabase: SupabaseClient,
  params: { id: string; userId: string; pitchDeckId: string; slideKey: string; content: string },
): Promise<void> => {
  console.log('💾 insertPitchDeckSlideStudioRequest', { pitchDeckId: params.pitchDeckId, slideKey: params.slideKey });
  const now = new Date().toISOString();
  const { error } = await supabase.from('pitch_deck_slide_studio_requests').insert({
    id: params.id,
    user_id: params.userId,
    pitch_deck_id: params.pitchDeckId,
    slide_key: params.slideKey,
    content: params.content,
    status: 'pending',
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(error.message);
};
