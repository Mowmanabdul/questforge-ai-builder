import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useRewardOperations = (
  userId: string | undefined,
  player: any,
  loadPlayerData: () => Promise<void>
) => {
  const equipItem = async (item: any) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('loot_items')
        .update({ equipped: true })
        .eq('id', item.id);

      if (error) throw error;
      
      await loadPlayerData();
      toast.success('Item equipped!');
    } catch (error: any) {
      toast.error('Failed to equip item');
    }
  };

  const unequipItem = async (item: any) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('loot_items')
        .update({ equipped: false })
        .eq('id', item.id);

      if (error) throw error;
      
      await loadPlayerData();
      toast.success('Item unequipped');
    } catch (error: any) {
      toast.error('Failed to unequip item');
    }
  };

  const spendOnLeisure = async (activityId: string, activityName: string, cost: number) => {
    if (!userId || !player || player.gold < cost) return;

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ gold: player.gold - cost })
        .eq('id', userId);

      if (profileError) throw profileError;

      await supabase.from('leisure_history').insert({
        user_id: userId,
        activity_name: activityName,
        cost,
      });

      await loadPlayerData();
      toast.success(`Enjoyed ${activityName}! -${cost} Gold`);
    } catch (error: any) {
      toast.error('Failed to complete purchase');
    }
  };

  const addCustomReward = async (reward: any) => {
    if (!userId) return;

    try {
      await supabase.from('custom_rewards').insert({
        user_id: userId,
        name: reward.name,
        description: reward.description,
        cost: reward.cost,
        icon: reward.icon,
        emoji: reward.emoji,
        category: reward.category,
      });

      await loadPlayerData();
      toast.success('Custom reward added!');
    } catch (error: any) {
      toast.error('Failed to add reward');
    }
  };

  const updateCustomReward = async (id: string, updates: any) => {
    if (!userId) return;
    
    try {
      await supabase.from('custom_rewards').update(updates).eq('id', id);
      await loadPlayerData();
      toast.success('Reward updated!');
    } catch (error: any) {
      toast.error('Failed to update reward');
    }
  };

  const deleteCustomReward = async (id: string) => {
    if (!userId) return;
    
    try {
      await supabase.from('custom_rewards').delete().eq('id', id);
      await loadPlayerData();
      toast.success('Reward deleted');
    } catch (error: any) {
      toast.error('Failed to delete reward');
    }
  };

  return {
    equipItem,
    unequipItem,
    spendOnLeisure,
    addCustomReward,
    updateCustomReward,
    deleteCustomReward,
  };
};
