import type { SupabaseClient } from '@supabase/supabase-js';
import type { InvestorContactRow } from './types';

/**
 * Lists investor contacts, optionally filtered by investor_id.
 */
export const listInvestorContactsByInvestorId = async (
  supabase: SupabaseClient,
  investorId?: string,
): Promise<InvestorContactRow[]> => {
  console.log('💾 listInvestorContactsByInvestorId', { investorId });
  let query = supabase.from('investor_contacts').select('*').order('created_at', { ascending: false });
  if (investorId) query = query.eq('investor_id', investorId);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch investor contacts: ${error.message}`);
  return (data ?? []) as InvestorContactRow[];
};
