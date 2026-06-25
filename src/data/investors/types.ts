/** Database row shape for investors table. */
export type InvestorRow = {
  id: string;
  name: string;
  firm: string | null;
  thesis_notes: string | null;
  stage_focus: string | null;
  firm_bio: string | null;
  firm_information: string | null;
  investment_sectors: string | null;
  typical_check_size: string | null;
  office_address: string | null;
  website: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CreateInvestorInput = {
  name: string;
  firm?: string | null;
  thesisNotes?: string | null;
  stageFocus?: string | null;
  firmBio?: string | null;
  firmInformation?: string | null;
  investmentSectors?: string | null;
  typicalCheckSize?: string | null;
  officeAddress?: string | null;
  website?: string | null;
  status?: string;
};

export type UpdateInvestorInput = {
  name?: string;
  firm?: string | null;
  thesisNotes?: string | null;
  stageFocus?: string | null;
  firmBio?: string | null;
  firmInformation?: string | null;
  investmentSectors?: string | null;
  typicalCheckSize?: string | null;
  officeAddress?: string | null;
  website?: string | null;
  status?: string;
};
