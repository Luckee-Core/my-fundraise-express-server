-- Investor profile columns + extract ledgers (adapted from mentorai 149+150; user_id TEXT, no users FK)

ALTER TABLE public.investors
  ADD COLUMN IF NOT EXISTS firm_bio TEXT,
  ADD COLUMN IF NOT EXISTS firm_information TEXT,
  ADD COLUMN IF NOT EXISTS investment_sectors TEXT,
  ADD COLUMN IF NOT EXISTS typical_check_size TEXT,
  ADD COLUMN IF NOT EXISTS office_address TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT;

ALTER TABLE public.investors
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'not_contacted'
  CHECK (status IN ('not_contacted', 'contacted', 'contacted_lost', 'intro'));

CREATE TABLE IF NOT EXISTS public.investor_firm_profile_extract_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  structured JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.investor_firm_profile_extract_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  investor_id UUID NOT NULL REFERENCES public.investors(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  response_id UUID REFERENCES public.investor_firm_profile_extract_responses(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.investor_firm_profile_extract_exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  investor_id UUID NOT NULL REFERENCES public.investors(id) ON DELETE CASCADE,
  request_id UUID NOT NULL REFERENCES public.investor_firm_profile_extract_requests(id) ON DELETE CASCADE,
  response_id UUID REFERENCES public.investor_firm_profile_extract_responses(id) ON DELETE SET NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER,
  model_used TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inv_firm_extract_ex_investor_created
  ON public.investor_firm_profile_extract_exchanges(investor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inv_firm_extract_req_investor_created
  ON public.investor_firm_profile_extract_requests(investor_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.investor_contact_sheet_extract_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  structured JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.investor_contact_sheet_extract_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  investor_id UUID NOT NULL REFERENCES public.investors(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  response_id UUID REFERENCES public.investor_contact_sheet_extract_responses(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.investor_contact_sheet_extract_exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  investor_id UUID NOT NULL REFERENCES public.investors(id) ON DELETE CASCADE,
  request_id UUID NOT NULL REFERENCES public.investor_contact_sheet_extract_requests(id) ON DELETE CASCADE,
  response_id UUID REFERENCES public.investor_contact_sheet_extract_responses(id) ON DELETE SET NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER,
  model_used TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inv_contact_sheet_extract_ex_investor_created
  ON public.investor_contact_sheet_extract_exchanges(investor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inv_contact_sheet_extract_req_investor_created
  ON public.investor_contact_sheet_extract_requests(investor_id, created_at DESC);
