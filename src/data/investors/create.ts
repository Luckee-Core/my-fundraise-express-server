import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreateInvestorInput, InvestorRow } from './types';

/**
 * Inserts a new investor row.
 */
export const createInvestor = async (
  supabase: SupabaseClient,
  input: CreateInvestorInput,
): Promise<InvestorRow> => {
  console.log('💾 createInvestor', { name: input.name });
  const { data, error } = await supabase
    .from('investors')
    .insert({
      name: input.name,
      firm: input.firm ?? null,
      thesis_notes: input.thesisNotes ?? null,
      stage_focus: input.stageFocus ?? null,
      firm_bio: input.firmBio ?? null,
      firm_information: input.firmInformation ?? null,
      investment_sectors: input.investmentSectors ?? null,
      typical_check_size: input.typicalCheckSize ?? null,
      office_address: input.officeAddress ?? null,
      website: input.website ?? null,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to create investor: ${error.message}`);
  }

  return data as InvestorRow;
};
