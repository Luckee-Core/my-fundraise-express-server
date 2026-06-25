import type { SupabaseClient } from '@supabase/supabase-js';

/** Inserts a firm-profile extract exchange row. */
export const insertInvestorFirmProfileExtractExchange = async (
  supabase: SupabaseClient,
  params: {
    id: string;
    userId: string;
    investorId: string;
    requestId: string;
    responseId: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    modelUsed: string;
    status: 'completed' | 'failed' | 'pending';
  },
): Promise<void> => {
  console.log('💾 insertInvestorFirmProfileExtractExchange', { id: params.id });
  const now = new Date().toISOString();
  const { error } = await supabase.from('investor_firm_profile_extract_exchanges').insert({
    id: params.id,
    user_id: params.userId,
    investor_id: params.investorId,
    request_id: params.requestId,
    response_id: params.responseId,
    input_tokens: params.inputTokens,
    output_tokens: params.outputTokens,
    total_tokens: params.totalTokens,
    model_used: params.modelUsed,
    status: params.status,
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(error.message);
};
