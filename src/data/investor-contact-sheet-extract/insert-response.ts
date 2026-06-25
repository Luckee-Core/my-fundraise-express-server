import type { SupabaseClient } from '@supabase/supabase-js';

/** Inserts a contact-sheet extract response row. */
export const insertInvestorContactSheetExtractResponse = async (
  supabase: SupabaseClient,
  id: string,
  structured: unknown,
): Promise<void> => {
  console.log('💾 insertInvestorContactSheetExtractResponse', { id });
  const now = new Date().toISOString();
  const { error } = await supabase.from('investor_contact_sheet_extract_responses').insert({
    id,
    structured,
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(error.message);
};
