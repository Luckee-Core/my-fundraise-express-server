-- Investors, pitch decks, slides (adapted from mentorai 040; no users FK)

DO $$
BEGIN
  CREATE TYPE pitch_deck_type AS ENUM (
    'intro_screener',
    'investor_deep_dive'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  CREATE TYPE pitch_deck_status AS ENUM (
    'draft',
    'sent',
    'archived'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

CREATE TABLE IF NOT EXISTS public.pitch_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  deck_type pitch_deck_type NOT NULL DEFAULT 'intro_screener',
  version_number INTEGER NOT NULL DEFAULT 1,
  status pitch_deck_status NOT NULL DEFAULT 'draft',
  parent_deck_id UUID REFERENCES public.pitch_decks (id) ON DELETE SET NULL,
  created_by_user_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pitch_deck_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_deck_id UUID NOT NULL REFERENCES public.pitch_decks (id) ON DELETE CASCADE,
  slide_key VARCHAR(64) NOT NULL,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (pitch_deck_id, slide_key)
);

CREATE TABLE IF NOT EXISTS public.investors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  firm VARCHAR(255),
  thesis_notes TEXT,
  stage_focus VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.investor_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES public.investors (id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pitch_deck_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_deck_id UUID NOT NULL REFERENCES public.pitch_decks (id) ON DELETE CASCADE,
  investor_id UUID REFERENCES public.investors (id) ON DELETE SET NULL,
  investor_contact_id UUID REFERENCES public.investor_contacts (id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  note TEXT
);

CREATE INDEX IF NOT EXISTS idx_pitch_decks_type ON public.pitch_decks (deck_type);
CREATE INDEX IF NOT EXISTS idx_pitch_decks_status ON public.pitch_decks (status);
CREATE INDEX IF NOT EXISTS idx_pitch_decks_parent ON public.pitch_decks (parent_deck_id);
CREATE INDEX IF NOT EXISTS idx_pitch_deck_slides_deck_id ON public.pitch_deck_slides (pitch_deck_id);
CREATE INDEX IF NOT EXISTS idx_investor_contacts_investor_id ON public.investor_contacts (investor_id);
CREATE INDEX IF NOT EXISTS idx_pitch_deck_sends_pitch_deck_id ON public.pitch_deck_sends (pitch_deck_id);
