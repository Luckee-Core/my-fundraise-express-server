-- Business context: sections + atomic facts (Luckee "what is" store)

CREATE TABLE IF NOT EXISTS public.business_context_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  section_key TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, section_key)
);

CREATE INDEX IF NOT EXISTS idx_business_context_sections_user
  ON public.business_context_sections (user_id, sort_order);

CREATE TABLE IF NOT EXISTS public.business_facts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  section_id UUID NOT NULL REFERENCES public.business_context_sections(id) ON DELETE CASCADE,
  fact_key TEXT NOT NULL,
  fact_value TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, section_id, fact_key)
);

CREATE INDEX IF NOT EXISTS idx_business_facts_user_section
  ON public.business_facts (user_id, section_id, sort_order);
