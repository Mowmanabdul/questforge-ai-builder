-- Create a temporary table with deduplicated skills (max level per user per trimmed category)
CREATE TEMP TABLE deduplicated_skills AS
SELECT 
  user_id,
  TRIM(category) as category,
  MAX(level) as level
FROM skills
GROUP BY user_id, TRIM(category);

-- Delete all skills
DELETE FROM skills;

-- Insert back the deduplicated skills
INSERT INTO skills (user_id, category, level)
SELECT user_id, category, level
FROM deduplicated_skills;