import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreateInvestorContactInput, InvestorContactRow } from './types';

/** Inserts a new investor contact. */
export const createInvestorContact = async (
  supabase: SupabaseClient,
  input: CreateInvestorContactInput,
): Promise<InvestorContactRow> => {
  console.log('💾 createInvestorContact', { investorId: input.investorId });
  const { data, error } = await supabase
    .from('investor_contacts')
    .insert({
      investor_id: input.investorId,
      name: input.name,
      email: input.email,
      role: input.role ?? null,
    })
    .select('*')
    .single();
  if (error) throw new Error(`Failed to create investor contact: ${error.message}`);
  return data as InvestorContactRow;
};
