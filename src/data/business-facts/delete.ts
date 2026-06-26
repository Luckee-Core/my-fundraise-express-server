import type { SupabaseClient } from '@supabase/supabase-js';

/** Deletes a business fact by id. */
export const deleteBusinessFact = async (supabase: SupabaseClient, id: string): Promise<void> => {
  console.log('💾 deleteBusinessFact', { id });
  const { error } = await supabase.from('business_facts').delete().eq('id', id);
  if (error) {
    throw new Error(`Failed to delete business fact: ${error.message}`);
  }
};
