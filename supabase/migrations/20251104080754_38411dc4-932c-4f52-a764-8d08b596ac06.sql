-- Add database indexes for better query performance

-- Index on quests for user-specific queries
CREATE INDEX IF NOT EXISTS idx_quests_user_completed ON quests(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_quests_user_created ON quests(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quests_user_priority ON quests(user_id, priority) WHERE completed = false;
CREATE INDEX IF NOT EXISTS idx_quests_due_date ON quests(user_id, due_date) WHERE completed = false AND due_date IS NOT NULL;

-- Index on quest_history for user activity tracking
CREATE INDEX IF NOT EXISTS idx_quest_history_user_completed ON quest_history(user_id, completed_at DESC);

-- Index on skills for user skill lookup
CREATE INDEX IF NOT EXISTS idx_skills_user_category ON skills(user_id, category);

-- Index on loot_items for equipped items
CREATE INDEX IF NOT EXISTS idx_loot_items_equipped ON loot_items(user_id, equipped) WHERE equipped = true;

-- Index on custom_rewards for user rewards
CREATE INDEX IF NOT EXISTS idx_custom_rewards_user ON custom_rewards(user_id);

-- Index on achievements for user progress
CREATE INDEX IF NOT EXISTS idx_achievements_user_unlocked ON achievements(user_id, unlocked_at);

-- Index on gold_transactions for transaction history
CREATE INDEX IF NOT EXISTS idx_gold_transactions_user_time ON gold_transactions(user_id, timestamp DESC);

-- Index on leisure_history for activity tracking
CREATE INDEX IF NOT EXISTS idx_leisure_history_user_time ON leisure_history(user_id, timestamp DESC);

-- Index on homestead_buildings for user buildings
CREATE INDEX IF NOT EXISTS idx_homestead_buildings_user ON homestead_buildings(user_id);

-- Index on goals for user goals
CREATE INDEX IF NOT EXISTS idx_goals_user_completed ON goals(user_id, completed_at);

ANALYZE quests;
ANALYZE quest_history;
ANALYZE skills;
ANALYZE loot_items;
ANALYZE profiles;