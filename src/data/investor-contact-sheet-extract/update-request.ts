import type { SupabaseClient } from '@supabase/supabase-js';

/** Updates a contact-sheet extract request after completion. */
export const updateInvestorContactSheetExtractRequest = async (
  supabase: SupabaseClient,
  requestId: string,
  patch: { responseId: string; status: 'completed' | 'failed' },
): Promise<void> => {
  console.log('💾 updateInvestorContactSheetExtractRequest', { requestId });
  const { error } = await supabase
    .from('investor_contact_sheet_extract_requests')
    .update({ response_id: patch.responseId, status: patch.status, updated_at: new Date().toISOString() })
    .eq('id', requestId);
  if (error) throw new Error(error.message);
};
