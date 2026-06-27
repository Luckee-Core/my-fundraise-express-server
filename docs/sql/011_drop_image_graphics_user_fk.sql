-- Single-tenant DB: no users table. image_graphics.user_id is optional metadata only.

ALTER TABLE public.image_graphics
  DROP CONSTRAINT IF EXISTS image_graphics_user_id_fkey;

ALTER TABLE public.image_graphics
  ALTER COLUMN user_id DROP NOT NULL;
