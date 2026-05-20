-- ============================================================
-- Switch scoring schema from 4 criteria (25 each) to the
-- Hackathon 2026 six-criterion schema (25 / 20 / 20 / 15 / 10 / 10).
-- Run once in Supabase SQL Editor.
-- ============================================================

-- Drop GENERATED total first (depends on the old columns)
ALTER TABLE scores DROP COLUMN IF EXISTS total;

-- Drop the old 4 criteria columns
ALTER TABLE scores DROP COLUMN IF EXISTS innovation;
ALTER TABLE scores DROP COLUMN IF EXISTS execution;
ALTER TABLE scores DROP COLUMN IF EXISTS presentation;
ALTER TABLE scores DROP COLUMN IF EXISTS impact;

-- Add the new 6 criteria columns with their max-score check constraints
ALTER TABLE scores ADD COLUMN problem_understanding INT NOT NULL DEFAULT 0 CHECK (problem_understanding BETWEEN 0 AND 25);
ALTER TABLE scores ADD COLUMN role_completeness     INT NOT NULL DEFAULT 0 CHECK (role_completeness     BETWEEN 0 AND 20);
ALTER TABLE scores ADD COLUMN fullstack_execution   INT NOT NULL DEFAULT 0 CHECK (fullstack_execution   BETWEEN 0 AND 20);
ALTER TABLE scores ADD COLUMN uxui_design           INT NOT NULL DEFAULT 0 CHECK (uxui_design           BETWEEN 0 AND 15);
ALTER TABLE scores ADD COLUMN pitch_storytelling    INT NOT NULL DEFAULT 0 CHECK (pitch_storytelling    BETWEEN 0 AND 10);
ALTER TABLE scores ADD COLUMN creativity            INT NOT NULL DEFAULT 0 CHECK (creativity            BETWEEN 0 AND 10);

-- Recreate total — sum of the six (still maxes at 100)
ALTER TABLE scores ADD COLUMN total INT GENERATED ALWAYS AS (
  problem_understanding
  + role_completeness
  + fullstack_execution
  + uxui_design
  + pitch_storytelling
  + creativity
) STORED;

-- Verify
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'scores'
ORDER BY ordinal_position;
