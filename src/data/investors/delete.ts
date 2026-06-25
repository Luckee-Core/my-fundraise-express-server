import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Deletes an investor row by id.
 */
export const deleteInvestor = async (supabase: SupabaseClient, id: string): Promise<void> => {
  console.log('💾 deleteInvestor', { id });
  const { error } = await supabase.from('investors').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete investor: ${error.message}`);
  }
};
