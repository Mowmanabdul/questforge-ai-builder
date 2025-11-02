import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Quest } from "./useGameState";

export const useQuestOperations = (
  userId: string | undefined,
  player: any,
  loadPlayerData: () => Promise<void>,
  loadQuests: () => Promise<void>,
  loadCompletedQuests: () => Promise<void>
) => {
  const addQuest = async (quest: Omit<Quest, 'id' | 'completed' | 'createdAt'>) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase.from('quests').insert({
        user_id: userId,
        name: quest.name,
        description: quest.description,
        category: quest.category,
        xp: quest.xp,
        priority: quest.priority || 'medium',
        due_date: quest.dueDate?.toISOString(),
      }).select().single();

      if (error) throw error;
      
      await loadQuests();
      toast.success(`Quest "${quest.name}" added!`);
    } catch (error: any) {
      toast.error('Failed to add quest');
      console.error(error);
    }
  };

  const updateQuest = async (questId: string, updates: Partial<Quest>) => {
    if (!userId) return;

    try {
      const { error } = await supabase.from('quests').update({
        name: updates.name,
        description: updates.description,
        category: updates.category,
        xp: updates.xp,
        priority: updates.priority,
        due_date: updates.dueDate?.toISOString(),
      }).eq('id', questId).eq('user_id', userId);

      if (error) throw error;

      await loadQuests();
      toast.success('Quest updated!');
    } catch (error: any) {
      toast.error('Failed to update quest');
      console.error(error);
    }
  };

  const deleteQuest = async (questId: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('quests')
        .delete()
        .eq('id', questId)
        .eq('user_id', userId);

      if (error) throw error;
      
      await loadQuests();
      toast.success('Quest deleted');
    } catch (error: any) {
      toast.error('Failed to delete quest');
      console.error(error);
    }
  };

  const completeQuest = async (questId: string, quest: Quest) => {
    if (!userId || !player) return;

    try {
      const goldReward = Math.floor(quest.xp * 0.5);
      const newXp = player.xp + quest.xp;
      const newGold = player.gold + goldReward;
      const newQuestsCompleted = player.stats.questsCompleted + 1;

      await supabase.from('quests').update({ completed: true }).eq('id', questId);

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          xp: newXp,
          gold: newGold,
          quests_completed: newQuestsCompleted,
          total_xp: player.stats.totalXp + quest.xp,
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      await supabase.from('quest_history').insert({
        user_id: userId,
        name: quest.name,
        category: quest.category,
        xp: quest.xp,
        gold: goldReward,
      });

      await supabase.from('skills').upsert({
        user_id: userId,
        category: quest.category,
        level: (player.skills[quest.category] || 0) + 1,
      }, { onConflict: 'user_id,category' });

      await Promise.all([loadPlayerData(), loadQuests(), loadCompletedQuests()]);
      toast.success(`Quest completed! +${quest.xp} XP, +${goldReward} Gold`);
    } catch (error: any) {
      console.error('Error completing quest:', error);
      toast.error('Failed to complete quest');
    }
  };

  const rushQuest = async (questId: string, quest: Quest) => {
    if (!userId || !player || player.dailyRushUsed) return;
    
    await completeQuest(questId, quest);
    
    const { error } = await supabase
      .from('profiles')
      .update({ daily_rush_used: true })
      .eq('id', userId);

    if (error) {
      toast.error('Failed to use daily rush');
      return;
    }

    await loadPlayerData();
    toast.success('Daily Rush used! Quest completed instantly!');
  };

  return {
    addQuest,
    updateQuest,
    deleteQuest,
    completeQuest,
    rushQuest,
  };
};
