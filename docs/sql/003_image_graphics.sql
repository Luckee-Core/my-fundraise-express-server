-- Graphics Studio rows (adapted from city-nonprofits 043; table only)

CREATE TABLE IF NOT EXISTS public.image_graphics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Untitled graphic',
  canvas_width_px INTEGER NOT NULL DEFAULT 1080 CHECK (canvas_width_px >= 64 AND canvas_width_px <= 8192),
  canvas_height_px INTEGER NOT NULL DEFAULT 1080 CHECK (canvas_height_px >= 64 AND canvas_height_px <= 8192),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS image_graphics_updated_at_idx ON public.image_graphics (updated_at DESC);

COMMENT ON TABLE public.image_graphics IS 'Graphics Studio layouts; TSX in metadata->studioDraft->tsx; generation status in metadata.';
