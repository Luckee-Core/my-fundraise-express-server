import type { SupabaseClient } from '@supabase/supabase-js';
import type { InvestorRow, UpdateInvestorInput } from './types';

/**
 * Updates an investor row by id.
 */
export const updateInvestor = async (
  supabase: SupabaseClient,
  id: string,
  input: UpdateInvestorInput,
): Promise<InvestorRow> => {
  console.log('💾 updateInvestor', { id });
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) patch.name = input.name;
  if (input.firm !== undefined) patch.firm = input.firm;
  if (input.thesisNotes !== undefined) patch.thesis_notes = input.thesisNotes;
  if (input.stageFocus !== undefined) patch.stage_focus = input.stageFocus;
  if (input.firmBio !== undefined) patch.firm_bio = input.firmBio;
  if (input.firmInformation !== undefined) patch.firm_information = input.firmInformation;
  if (input.investmentSectors !== undefined) patch.investment_sectors = input.investmentSectors;
  if (input.typicalCheckSize !== undefined) patch.typical_check_size = input.typicalCheckSize;
  if (input.officeAddress !== undefined) patch.office_address = input.officeAddress;
  if (input.website !== undefined) patch.website = input.website;
  if (input.status !== undefined) patch.status = input.status;

  const { data, error } = await supabase.from('investors').update(patch).eq('id', id).select('*').single();

  if (error) {
    throw new Error(`Failed to update investor: ${error.message}`);
  }

  return data as InvestorRow;
};
