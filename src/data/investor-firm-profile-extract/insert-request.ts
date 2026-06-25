import type { SupabaseClient } from '@supabase/supabase-js';

/** Inserts a pending firm-profile extract request. */
export const insertInvestorFirmProfileExtractRequest = async (
  supabase: SupabaseClient,
  params: { id: string; userId: string; investorId: string; content: string },
): Promise<void> => {
  console.log('💾 insertInvestorFirmProfileExtractRequest', { investorId: params.investorId });
  const now = new Date().toISOString();
  const { error } = await supabase.from('investor_firm_profile_extract_requests').insert({
    id: params.id,
    user_id: params.userId,
    investor_id: params.investorId,
    content: params.content,
    status: 'pending',
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(error.message);
};
