import type { SupabaseClient } from '@supabase/supabase-js';

/** Inserts a pitch deck slide studio exchange row. */
export const insertPitchDeckSlideStudioExchange = async (
  supabase: SupabaseClient,
  params: {
    id: string;
    userId: string;
    pitchDeckId: string;
    slideKey: string;
    requestId: string;
    responseId: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    modelUsed: string;
    status: 'completed' | 'failed' | 'pending';
    errorMessage?: string | null;
  },
): Promise<void> => {
  console.log('💾 insertPitchDeckSlideStudioExchange', { id: params.id });
  const now = new Date().toISOString();
  const { error } = await supabase.from('pitch_deck_slide_studio_exchanges').insert({
    id: params.id,
    user_id: params.userId,
    pitch_deck_id: params.pitchDeckId,
    slide_key: params.slideKey,
    request_id: params.requestId,
    response_id: params.responseId,
    input_tokens: params.inputTokens,
    output_tokens: params.outputTokens,
    total_tokens: params.totalTokens,
    credits_used: 0,
    model_used: params.modelUsed,
    status: params.status,
    error_message: params.errorMessage ?? null,
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(error.message);
};
