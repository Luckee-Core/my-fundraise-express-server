-- Add canvas columns when image_graphics was created from an older mentorai schema.
-- Safe to re-run.

ALTER TABLE public.image_graphics
  ADD COLUMN IF NOT EXISTS canvas_width_px INTEGER,
  ADD COLUMN IF NOT EXISTS canvas_height_px INTEGER;

UPDATE public.image_graphics
SET
  canvas_width_px = COALESCE(canvas_width_px, 1080),
  canvas_height_px = COALESCE(canvas_height_px, 1080)
WHERE canvas_width_px IS NULL OR canvas_height_px IS NULL;

ALTER TABLE public.image_graphics
  ALTER COLUMN canvas_width_px SET DEFAULT 1080,
  ALTER COLUMN canvas_height_px SET DEFAULT 1080;
