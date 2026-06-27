-- Free-form pitch deck slides: title, nullable template_key, no unique per template

ALTER TABLE public.pitch_deck_slides
  DROP CONSTRAINT IF EXISTS pitch_deck_slides_pitch_deck_id_slide_key_key;

ALTER TABLE public.pitch_deck_slides
  ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL DEFAULT 'Untitled slide';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'pitch_deck_slides'
      AND column_name = 'slide_key'
  ) THEN
    ALTER TABLE public.pitch_deck_slides RENAME COLUMN slide_key TO template_key;
  END IF;
END
$$;

ALTER TABLE public.pitch_deck_slides
  ALTER COLUMN template_key DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_pitch_deck_slides_deck_position
  ON public.pitch_deck_slides (pitch_deck_id, position);
