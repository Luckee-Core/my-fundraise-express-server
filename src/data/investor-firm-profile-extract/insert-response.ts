import type { SupabaseClient } from '@supabase/supabase-js';

/** Inserts a firm-profile extract response row. */
export const insertInvestorFirmProfileExtractResponse = async (
  supabase: SupabaseClient,
  id: string,
  structured: unknown,
): Promise<void> => {
  console.log('💾 insertInvestorFirmProfileExtractResponse', { id });
  const now = new Date().toISOString();
  const { error } = await supabase.from('investor_firm_profile_extract_responses').insert({
    id,
    structured,
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(error.message);
};
