import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Quest, Player, OracleMessage } from "./useGameState";

export const useSupabaseGameState = (userId: string | undefined) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [oracleMessage, setOracleMessage] = useState<OracleMessage | null>(null);

  // Load player data
  const loadPlayerData = useCallback(async () => {
    if (!userId) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Load skills
      const { data: skills } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', userId);

      // Load loot items
      const { data: lootItems } = await supabase
        .from('loot_items')
        .select('*')
        .eq('user_id', userId);

      // Load homestead buildings
      const { data: buildings } = await supabase
        .from('homestead_buildings')
        .select('*')
        .eq('user_id', userId);

      // Load quest history
      const { data: history } = await supabase
        .from('quest_history')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(50);

      // Load gold transactions
      const { data: transactions } = await supabase
        .from('gold_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(100);

      // Load custom rewards
      const { data: rewards } = await supabase
        .from('custom_rewards')
        .select('*')
        .eq('user_id', userId);

      // Load leisure history
      const { data: leisure } = await supabase
        .from('leisure_history')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(50);

      // Load achievements
      const { data: achievements } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId);

      // Load goals
      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId);

      // Transform skills to object (deduplicate by taking max level per category)
      // Trim category names to prevent duplicates from whitespace
      const skillsObj = skills?.reduce((acc, skill) => {
        const trimmedCategory = skill.category.trim();
        if (!trimmedCategory) return acc; // Skip empty categories
        const currentLevel = acc[trimmedCategory] || 0;
        acc[trimmedCategory] = Math.max(currentLevel, skill.level);
        return acc;
      }, {} as Record<string, number>) || {};

      // Transform loot items to inventory
      const equipped = lootItems?.filter(item => item.equipped).map(item => ({
        id: item.id,
        name: item.name,
        type: item.type as any,
        category: item.category,
        value: Number(item.value),
        rarity: item.rarity as any,
        icon: item.icon
      })) || [];

      const stored = lootItems?.filter(item => !item.equipped).map(item => ({
        id: item.id,
        name: item.name,
        type: item.type as any,
        category: item.category,
        value: Number(item.value),
        rarity: item.rarity as any,
        icon: item.icon
      })) || [];

      const playerData: Player = {
        name: profile.name,
        level: profile.level,
        xp: profile.xp,
        xpToNext: profile.xp_to_next,
        gold: profile.gold,
        streak: profile.streak,
        prestigeLevel: profile.prestige_level,
        prestigePoints: profile.prestige_points,
        stats: {
          questsCompleted: profile.quests_completed,
          totalXp: profile.total_xp,
        },
        skills: skillsObj,
        inventory: { equipped, stored },
        journeyProgress: profile.journey_progress,
        questHistory: history?.map(h => ({
          id: h.id,
          name: h.name,
          category: h.category,
          xp: h.xp,
          gold: h.gold,
          completedAt: new Date(h.completed_at),
        })) || [],
        goldTransactions: transactions?.map(t => ({
          id: t.id,
          amount: t.amount,
          type: t.type as 'earned' | 'spent',
          source: t.source,
          timestamp: new Date(t.timestamp),
        })) || [],
        homestead: buildings?.map(b => ({
          id: b.building_id,
          name: b.name,
          description: b.description,
          icon: b.icon,
          level: b.level,
          baseCost: b.base_cost,
          bonusType: b.bonus_type as any,
          bonusValue: Number(b.bonus_value),
        })) || [],
        dailyRushUsed: profile.daily_rush_used,
        restedXp: profile.rested_xp,
        leisureHistory: leisure?.map(l => ({
          activityName: l.activity_name,
          cost: l.cost,
          timestamp: new Date(l.timestamp),
        })) || [],
        customRewards: rewards?.map(r => ({
          id: r.id,
          name: r.name,
          description: r.description,
          cost: r.cost,
          icon: r.icon,
          emoji: r.emoji,
          category: r.category,
          createdAt: new Date(r.created_at),
        })) || [],
        achievements: achievements?.map(a => ({
          id: a.achievement_id,
          name: a.name,
          description: a.description,
          icon: a.icon,
          progress: a.progress,
          target: a.target,
          category: a.category as any,
          rarity: a.rarity as any,
          unlockedAt: a.unlocked_at ? new Date(a.unlocked_at) : undefined,
        })) || [],
        goals: goals?.map(g => ({
          id: g.id,
          name: g.name,
          description: g.description,
          target: g.target,
          current: g.current,
          type: g.type as any,
          category: g.category,
          createdAt: new Date(g.created_at),
          completedAt: g.completed_at ? new Date(g.completed_at) : undefined,
        })) || [],
        personalRecords: {
          longestStreak: profile.longest_streak,
          mostQuestsInDay: profile.most_quests_in_day,
          highestLevel: profile.highest_level,
          totalGoldEarned: profile.total_gold_earned,
        },
        preferences: {
          notifications: profile.notifications_enabled,
          tutorialCompleted: profile.tutorial_completed,
        },
      };

      setPlayer(playerData);
    } catch (error: any) {
      console.error('Error loading player data:', error);
      toast.error('Failed to load player data');
    }
  }, [userId]);

  // Load quests
  const loadQuests = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const questsData: Quest[] = data.map(q => ({
        id: q.id,
        name: q.name,
        category: q.category,
        xp: q.xp,
        completed: q.completed,
        completedAt: q.completed_at ? new Date(q.completed_at) : undefined,
        createdAt: new Date(q.created_at),
        description: q.description || undefined,
        dueDate: q.due_date ? new Date(q.due_date) : undefined,
        priority: q.priority as any,
        isTemplate: q.is_template,
        chainId: q.chain_id,
        chainOrder: q.chain_order,
      }));

      setQuests(questsData);
    } catch (error: any) {
      console.error('Error loading quests:', error);
      toast.error('Failed to load quests');
    }
  }, [userId]);

  // Load completed quests
  const loadCompletedQuests = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('completed_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const questsData: Quest[] = data.map(q => ({
        id: q.id,
        name: q.name,
        category: q.category,
        xp: q.xp,
        completed: q.completed,
        completedAt: q.completed_at ? new Date(q.completed_at) : undefined,
        createdAt: new Date(q.created_at),
        description: q.description || undefined,
        priority: q.priority as any,
        isTemplate: q.is_template,
        chainId: q.chain_id,
        chainOrder: q.chain_order,
      }));

      setCompletedQuests(questsData);
    } catch (error: any) {
      console.error('Error loading completed quests:', error);
      toast.error('Failed to load completed quests');
    }
  }, [userId]);

  // Initial load
  useEffect(() => {
    if (userId) {
      Promise.all([loadPlayerData(), loadQuests(), loadCompletedQuests()]).finally(() => setLoading(false));
    }
  }, [userId, loadPlayerData, loadQuests, loadCompletedQuests]);

  return {
    player,
    quests,
    completedQuests,
    loading,
    oracleMessage,
    setOracleMessage,
    setPlayer,
    setQuests,
    loadPlayerData,
    loadQuests,
    loadCompletedQuests,
  };
};
