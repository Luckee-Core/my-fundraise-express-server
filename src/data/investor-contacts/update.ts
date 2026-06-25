import type { SupabaseClient } from '@supabase/supabase-js';
import type { InvestorContactRow, UpdateInvestorContactInput } from './types';

/** Updates an investor contact by id. */
export const updateInvestorContact = async (
  supabase: SupabaseClient,
  id: string,
  input: UpdateInvestorContactInput,
): Promise<InvestorContactRow> => {
  console.log('💾 updateInvestorContact', { id });
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) patch.name = input.name;
  if (input.email !== undefined) patch.email = input.email;
  if (input.role !== undefined) patch.role = input.role;
  const { data, error } = await supabase.from('investor_contacts').update(patch).eq('id', id).select('*').single();
  if (error) throw new Error(`Failed to update investor contact: ${error.message}`);
  return data as InvestorContactRow;
};
