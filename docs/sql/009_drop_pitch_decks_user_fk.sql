-- Single-tenant DB: no users table. created_by_user_id is optional metadata only.

ALTER TABLE public.pitch_decks
  DROP CONSTRAINT IF EXISTS pitch_decks_created_by_user_id_fkey;
