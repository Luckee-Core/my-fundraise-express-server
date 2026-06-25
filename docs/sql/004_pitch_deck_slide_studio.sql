-- Pitch Deck Slide Studio ledger tables (adapted from mentorai 138)

CREATE TABLE IF NOT EXISTS public.pitch_deck_slide_studio_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  structured JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pitch_deck_slide_studio_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  pitch_deck_id UUID NOT NULL REFERENCES public.pitch_decks (id) ON DELETE CASCADE,
  slide_key VARCHAR(64) NOT NULL,
  content TEXT NOT NULL,
  exchange_id UUID,
  response_id UUID REFERENCES public.pitch_deck_slide_studio_responses (id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pitch_deck_slide_studio_exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  pitch_deck_id UUID NOT NULL REFERENCES public.pitch_decks (id) ON DELETE CASCADE,
  slide_key VARCHAR(64) NOT NULL,
  request_id UUID NOT NULL REFERENCES public.pitch_deck_slide_studio_requests (id) ON DELETE CASCADE,
  response_id UUID REFERENCES public.pitch_deck_slide_studio_responses (id) ON DELETE SET NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER,
  credits_used INTEGER DEFAULT 0,
  tokens_per_credit NUMERIC DEFAULT 11.11,
  model_used TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.pitch_deck_slide_studio_requests
  DROP CONSTRAINT IF EXISTS fk_pdss_requests_exchange;

ALTER TABLE public.pitch_deck_slide_studio_requests
  ADD CONSTRAINT fk_pdss_requests_exchange
  FOREIGN KEY (exchange_id)
  REFERENCES public.pitch_deck_slide_studio_exchanges (id)
  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_pdss_exchanges_deck_slide_created
  ON public.pitch_deck_slide_studio_exchanges (pitch_deck_id, slide_key, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pdss_requests_deck_slide
  ON public.pitch_deck_slide_studio_requests (pitch_deck_id, slide_key);

CREATE INDEX IF NOT EXISTS idx_pdss_exchanges_user_deck_slide
  ON public.pitch_deck_slide_studio_exchanges (user_id, pitch_deck_id, slide_key);
