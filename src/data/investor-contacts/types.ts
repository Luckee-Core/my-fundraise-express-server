export type InvestorContactRow = {
  id: string;
  investor_id: string;
  name: string;
  email: string;
  role: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateInvestorContactInput = {
  investorId: string;
  name: string;
  email: string;
  role?: string | null;
};

export type UpdateInvestorContactInput = {
  name?: string;
  email?: string;
  role?: string | null;
};
