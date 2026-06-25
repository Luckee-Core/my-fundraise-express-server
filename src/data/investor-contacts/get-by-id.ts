import type { SupabaseClient } from '@supabase/supabase-js';
import type { InvestorContactRow } from './types';

/** Fetches one investor contact by id. */
export const getInvestorContactById = async (
  supabase: SupabaseClient,
  id: string,
): Promise<InvestorContactRow | null> => {
  console.log('💾 getInvestorContactById', { id });
  const { data, error } = await supabase.from('investor_contacts').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`Failed to fetch investor contact: ${error.message}`);
  return (data ?? null) as InvestorContactRow | null;
};
