export type InvestorFirmProfileExtraction = {
  suggestedName: string | null;
  suggestedFirm: string | null;
  firmBio: string | null;
  firmInformation: string | null;
  investmentSectors: string | null;
  stageFocus: string | null;
  typicalCheckSize: string | null;
  officeAddress: string | null;
  thesisNotes: string | null;
  website: string | null;
};

export type InvestorContactExtractionRow = {
  name: string;
  email: string;
  role: string | null;
};

export type InvestorContactSheetExtraction = {
  contacts: InvestorContactExtractionRow[];
};

export type ProcessExtractInvestorFirmProfileResult = {
  extraction: InvestorFirmProfileExtraction;
  requestId: string;
  responseId: string;
  exchangeId: string;
};

export type ProcessExtractInvestorContactsResult = {
  extraction: InvestorContactSheetExtraction;
  requestId: string;
  responseId: string;
  exchangeId: string;
};
