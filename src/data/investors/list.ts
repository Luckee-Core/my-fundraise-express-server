import type { SupabaseClient } from '@supabase/supabase-js';
import type { InvestorRow } from './types';

/**
 * Lists all investors ordered by created_at descending.
 */
export const listInvestors = async (supabase: SupabaseClient): Promise<InvestorRow[]> => {
  console.log('💾 listInvestors');
  const { data, error } = await supabase
    .from('investors')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch investors: ${error.message}`);
  }

  return (data ?? []) as InvestorRow[];
};
