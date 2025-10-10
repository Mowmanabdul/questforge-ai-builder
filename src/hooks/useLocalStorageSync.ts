import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SYNC_KEY = 'questlog_synced';

export const useLocalStorageSync = (userId: string | undefined) => {
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const checkAndSync = async () => {
      if (!userId) return;

      // Check if already synced
      const syncStatus = localStorage.getItem(SYNC_KEY);
      if (syncStatus === 'true') {
        setSynced(true);
        return;
      }

      setSyncing(true);
      try {
        // Get localStorage data
        const playerData = localStorage.getItem('questlog_player');
        const questsData = localStorage.getItem('questlog_quests');

        if (!playerData || !questsData) {
          // No local data to sync
          localStorage.setItem(SYNC_KEY, 'true');
          setSynced(true);
          setSyncing(false);
          return;
        }

        const player = JSON.parse(playerData);
        const quests = JSON.parse(questsData);

        // Sync profile
        await supabase.from('profiles').update({
          name: player.name,
          level: player.level,
          xp: player.xp,
          xp_to_next: player.xpToNext,
          gold: player.gold,
          streak: player.streak,
          prestige_level: player.prestigeLevel,
          prestige_points: player.prestigePoints,
          quests_completed: player.stats.questsCompleted,
          total_xp: player.stats.totalXp,
          journey_progress: player.journeyProgress,
          daily_rush_used: player.dailyRushUsed,
          rested_xp: player.restedXp,
          longest_streak: player.personalRecords.longestStreak,
          most_quests_in_day: player.personalRecords.mostQuestsInDay,
          highest_level: player.personalRecords.highestLevel,
          total_gold_earned: player.personalRecords.totalGoldEarned,
          notifications_enabled: player.preferences.notifications,
          tutorial_completed: player.preferences.tutorialCompleted,
        }).eq('id', userId);

        // Sync skills
        if (player.skills && Object.keys(player.skills).length > 0) {
          const skillsData = Object.entries(player.skills).map(([category, level]) => ({
            user_id: userId,
            category,
            level: level as number,
          }));
          await supabase.from('skills').upsert(skillsData, { onConflict: 'user_id,category' });
        }

        // Sync quests
        if (quests.length > 0) {
          const questsToSync = quests.map((q: any) => ({
            user_id: userId,
            name: q.name,
            category: q.category,
            xp: q.xp,
            priority: q.priority || 'medium',
            completed: q.completed,
            is_template: q.isTemplate || false,
            chain_id: q.chainId,
            chain_order: q.chainOrder,
            created_at: q.createdAt,
            completed_at: q.completedAt,
          }));
          await supabase.from('quests').insert(questsToSync);
        }

        // Sync quest history
        if (player.questHistory?.length > 0) {
          const historyToSync = player.questHistory.map((h: any) => ({
            user_id: userId,
            name: h.name,
            category: h.category,
            xp: h.xp,
            gold: h.gold,
            completed_at: h.completedAt,
          }));
          await supabase.from('quest_history').insert(historyToSync);
        }

        // Sync homestead buildings
        if (player.homestead?.length > 0) {
          const buildingsToSync = player.homestead.map((b: any) => ({
            user_id: userId,
            building_id: b.id,
            name: b.name,
            description: b.description,
            icon: b.icon,
            level: b.level,
            base_cost: b.baseCost,
            bonus_type: b.bonusType,
            bonus_value: b.bonusValue,
          }));
          await supabase.from('homestead_buildings').upsert(buildingsToSync, { 
            onConflict: 'user_id,building_id' 
          });
        }

        // Sync loot items
        if (player.inventory?.equipped?.length > 0 || player.inventory?.stored?.length > 0) {
          const allItems = [
            ...(player.inventory.equipped || []).map((i: any) => ({ ...i, equipped: true })),
            ...(player.inventory.stored || []).map((i: any) => ({ ...i, equipped: false })),
          ];
          const itemsToSync = allItems.map((i: any) => ({
            user_id: userId,
            name: i.name,
            type: i.type,
            category: i.category,
            value: i.value,
            rarity: i.rarity,
            icon: i.icon,
            equipped: i.equipped,
          }));
          await supabase.from('loot_items').insert(itemsToSync);
        }

        // Mark as synced
        localStorage.setItem(SYNC_KEY, 'true');
        setSynced(true);
        toast.success("Your data has been synced to the cloud!");
      } catch (error: any) {
        console.error('Error syncing data:', error);
        toast.error("Failed to sync data. Your progress is still saved locally.");
      } finally {
        setSyncing(false);
      }
    };

    checkAndSync();
  }, [userId]);

  return { syncing, synced };
};
