-- ============================================================
-- Add pitch-deck uploads to the submission flow.
-- Adds teams.deck_url, creates a public `decks` Storage bucket,
-- and grants anon the ability to upload + read deck files.
-- ============================================================

-- 1. New column on teams
ALTER TABLE teams ADD COLUMN IF NOT EXISTS deck_url TEXT;

-- 2. Public bucket for the decks (25 MB cap)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('decks', 'decks', true, 26214400)
ON CONFLICT (id) DO UPDATE
  SET public = true,
      file_size_limit = 26214400;

-- 3. Storage policies — anon can upload AND read deck files
DROP POLICY IF EXISTS "decks_anon_upload" ON storage.objects;
CREATE POLICY "decks_anon_upload"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'decks');

DROP POLICY IF EXISTS "decks_public_read" ON storage.objects;
CREATE POLICY "decks_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'decks');

-- 4. Verify
SELECT id, name, public, file_size_limit FROM storage.buckets WHERE id = 'decks';
SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE 'decks_%';
