-- ============================================================
-- IEEE UoP Hackathon — ONE-SHOT setup
-- Schema + RLS + storage bucket + seeded judges + admin.
-- Idempotent: safe to run on a fresh project or to top up an
-- existing one. Does NOT drop teams or scores.
-- ============================================================

-- 1. Tables
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT NOT NULL,
  members TEXT NOT NULL,
  project_title TEXT NOT NULL,
  project_desc TEXT NOT NULL,
  github_url TEXT NOT NULL,
  deck_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS judges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id  UUID NOT NULL REFERENCES teams(id)  ON DELETE CASCADE,
  judge_id UUID NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
  problem_understanding INT NOT NULL DEFAULT 0 CHECK (problem_understanding BETWEEN 0 AND 25),
  role_completeness     INT NOT NULL DEFAULT 0 CHECK (role_completeness     BETWEEN 0 AND 20),
  fullstack_execution   INT NOT NULL DEFAULT 0 CHECK (fullstack_execution   BETWEEN 0 AND 20),
  uxui_design           INT NOT NULL DEFAULT 0 CHECK (uxui_design           BETWEEN 0 AND 15),
  pitch_storytelling    INT NOT NULL DEFAULT 0 CHECK (pitch_storytelling    BETWEEN 0 AND 10),
  creativity            INT NOT NULL DEFAULT 0 CHECK (creativity            BETWEEN 0 AND 10),
  total INT GENERATED ALWAYS AS (
    problem_understanding + role_completeness + fullstack_execution + uxui_design + pitch_storytelling + creativity
  ) STORED,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (team_id, judge_id)
);

-- 2. Leaderboard view
DROP VIEW IF EXISTS leaderboard;
CREATE VIEW leaderboard AS
SELECT
  t.id          AS team_id,
  t.team_name,
  t.project_title,
  t.members,
  t.github_url,
  COALESCE(SUM(s.total), 0)::INT          AS total_score,
  COALESCE(AVG(s.total), 0)::NUMERIC(5,2) AS avg_score,
  COUNT(s.id)::INT                        AS judges_scored
FROM teams t
LEFT JOIN scores s ON s.team_id = t.id
GROUP BY t.id
ORDER BY total_score DESC;

-- 3. RLS — open policies for a one-day event
ALTER TABLE teams  ENABLE ROW LEVEL SECURITY;
ALTER TABLE judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "open_teams"  ON teams;
DROP POLICY IF EXISTS "open_judges" ON judges;
DROP POLICY IF EXISTS "open_admins" ON admins;
DROP POLICY IF EXISTS "open_scores" ON scores;

CREATE POLICY "open_teams"  ON teams  FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "open_judges" ON judges FOR SELECT USING (true);
CREATE POLICY "open_admins" ON admins FOR SELECT USING (true);
CREATE POLICY "open_scores" ON scores FOR ALL    USING (true) WITH CHECK (true);

GRANT SELECT ON judges      TO anon;
GRANT SELECT ON admins      TO anon;
GRANT ALL    ON teams       TO anon;
GRANT ALL    ON scores      TO anon;
GRANT SELECT ON leaderboard TO anon;

-- 4. Storage bucket for pitch decks (25 MB cap)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('decks', 'decks', true, 26214400)
ON CONFLICT (id) DO UPDATE
  SET public = true, file_size_limit = 26214400;

DROP POLICY IF EXISTS "decks_anon_upload" ON storage.objects;
CREATE POLICY "decks_anon_upload"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'decks');

DROP POLICY IF EXISTS "decks_public_read" ON storage.objects;
CREATE POLICY "decks_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'decks');

-- 5. Seed 5 judges + 1 admin
INSERT INTO judges (username, password, full_name) VALUES
  ('judge1',  'judge-ieee-2026-a', 'Kurdi'),
  ('judge2',  'judge-ieee-2026-b', 'Zaid'),
  ('judge3',  'judge-ieee-2026-c', 'Haymouni'),
  ('doctor1', 'dr-ieee-2026-a',    'Dr. Abdulkareem'),
  ('doctor2', 'dr-ieee-2026-b',    'Dr. Jamal')
ON CONFLICT (username) DO UPDATE
  SET password = EXCLUDED.password,
      full_name = EXCLUDED.full_name;

INSERT INTO admins (username, password, full_name) VALUES
  ('admin', 'admin-ieee-2026', 'Hackathon Admin')
ON CONFLICT (username) DO UPDATE
  SET password = EXCLUDED.password,
      full_name = EXCLUDED.full_name;

-- 6. Verify
SELECT 'judges' AS tbl, COUNT(*) AS n FROM judges
UNION ALL SELECT 'admins', COUNT(*) FROM admins
UNION ALL SELECT 'teams',  COUNT(*) FROM teams
UNION ALL SELECT 'scores', COUNT(*) FROM scores;

SELECT id, public, file_size_limit FROM storage.buckets WHERE id = 'decks';
