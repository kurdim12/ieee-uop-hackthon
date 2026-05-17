-- ============================================================
-- JUDGE. — Hackathon judging platform schema
-- Run this once in the Supabase SQL editor for a fresh project.
-- ============================================================

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT NOT NULL,
  members TEXT NOT NULL,           -- comma-separated names
  project_title TEXT NOT NULL,
  project_desc TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS judges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,          -- plain text, one-day event, low stakes
  full_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id  UUID NOT NULL REFERENCES teams(id)  ON DELETE CASCADE,
  judge_id UUID NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
  innovation   INT NOT NULL CHECK (innovation   BETWEEN 0 AND 25),
  execution    INT NOT NULL CHECK (execution    BETWEEN 0 AND 25),
  presentation INT NOT NULL CHECK (presentation BETWEEN 0 AND 25),
  impact       INT NOT NULL CHECK (impact       BETWEEN 0 AND 25),
  total INT GENERATED ALWAYS AS
    (innovation + execution + presentation + impact) STORED,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (team_id, judge_id)        -- one score per judge per team
);

CREATE OR REPLACE VIEW leaderboard AS
SELECT
  t.id            AS team_id,
  t.team_name,
  t.project_title,
  t.members,
  COALESCE(SUM(s.total), 0)::INT       AS total_score,
  COALESCE(AVG(s.total), 0)::NUMERIC(5,2) AS avg_score,
  COUNT(s.id)::INT                     AS judges_scored
FROM teams t
LEFT JOIN scores s ON s.team_id = t.id
GROUP BY t.id
ORDER BY total_score DESC;

-- ------------------------------------------------------------
-- Row-level security: open policies for a one-day event
-- ------------------------------------------------------------
ALTER TABLE teams  ENABLE ROW LEVEL SECURITY;
ALTER TABLE judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "open_teams"  ON teams;
DROP POLICY IF EXISTS "open_judges" ON judges;
DROP POLICY IF EXISTS "open_scores" ON scores;

CREATE POLICY "open_teams"  ON teams  FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "open_judges" ON judges FOR SELECT USING (true);
CREATE POLICY "open_scores" ON scores FOR ALL    USING (true) WITH CHECK (true);

-- ------------------------------------------------------------
-- Seed judges. CHANGE THESE PASSWORDS BEFORE THE EVENT.
-- ------------------------------------------------------------
INSERT INTO judges (username, password, full_name) VALUES
  ('judge1', 'changeme1', 'Judge One'),
  ('judge2', 'changeme2', 'Judge Two'),
  ('judge3', 'changeme3', 'Judge Three')
ON CONFLICT (username) DO NOTHING;
