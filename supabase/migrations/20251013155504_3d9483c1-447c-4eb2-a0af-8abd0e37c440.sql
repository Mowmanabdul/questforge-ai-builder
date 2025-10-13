-- Add description field to quests table
ALTER TABLE quests ADD COLUMN IF NOT EXISTS description TEXT;