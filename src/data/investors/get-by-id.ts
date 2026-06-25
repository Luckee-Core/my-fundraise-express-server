import type { SupabaseClient } from '@supabase/supabase-js';
import type { InvestorRow } from './types';

/**
 * Fetches a single investor by primary key.
 */
export const getInvestorById = async (
  supabase: SupabaseClient,
  id: string,
): Promise<InvestorRow | null> => {
  console.log('💾 getInvestorById', { id });
  const { data, error } = await supabase.from('investors').select('*').eq('id', id).maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch investor: ${error.message}`);
  }

  return (data ?? null) as InvestorRow | null;
};
