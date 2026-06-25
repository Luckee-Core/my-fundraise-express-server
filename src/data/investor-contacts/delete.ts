import type { SupabaseClient } from '@supabase/supabase-js';

/** Deletes an investor contact by id. */
export const deleteInvestorContact = async (supabase: SupabaseClient, id: string): Promise<void> => {
  console.log('💾 deleteInvestorContact', { id });
  const { error } = await supabase.from('investor_contacts').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete investor contact: ${error.message}`);
};
