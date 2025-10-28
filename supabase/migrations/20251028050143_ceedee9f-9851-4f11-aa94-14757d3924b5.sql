-- Add due_date column to quests table
ALTER TABLE public.quests 
ADD COLUMN IF NOT EXISTS due_date TIMESTAMP WITH TIME ZONE;