import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface Quest {
  id: string;
  name: string;
  category: string;
  xp: number;
  completed: boolean;
  createdAt: Date;
}

export interface LootItem {
  id: string;
  name: string;
  type: 'xp_boost' | 'gold_boost' | 'streak_protection';
  category?: string;
  value: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
}

export interface Player {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  gold: number;
  streak: number;
  prestigeLevel: number;
  prestigePoints: number;
  stats: {
    questsCompleted: number;
    totalXp: number;
  };
  skills: Record<string, number>;
  inventory: {
    equipped: LootItem[];
    stored: LootItem[];
  };
  journeyProgress: number;
}

export interface OracleMessage {
  text: string;
  type: 'levelUp' | 'streakContinued' | 'firstQuest' | 'lootFound';
}

const LOOT_TABLE: LootItem[] = [
  { id: 'g1', name: 'Gloves of Diligence', type: 'xp_boost', category: 'Work', value: 0.05, rarity: 'common', icon: 'shield' },
  { id: 'r1', name: 'Ring of Focus', type: 'xp_boost', value: 0.1, rarity: 'rare', icon: 'sparkles' },
  { id: 'a1', name: 'Amulet of Prosperity', type: 'gold_boost', value: 0.15, rarity: 'epic', icon: 'gem' },
  { id: 'c1', name: 'Crown of Champions', type: 'xp_boost', value: 0.2, rarity: 'legendary', icon: 'crown' },
];

const ORACLE_MESSAGES = {
  levelUp: [
    "The Oracle smiles upon you. Your power grows, hero!",
    "You've ascended to new heights! The realm recognizes your strength.",
    "A surge of energy flows through you. Level up achieved!"
  ],
  streakContinued: [
    "Another day, another victory! Your determination is inspiring.",
    "The streak continues! The gods favor your persistence.",
    "Consistency is the path to mastery. Well done, adventurer!"
  ],
  firstQuest: [
    "And so your journey begins... May your path be filled with glory!",
    "The Oracle has foreseen great things in your future, brave one.",
    "Welcome, hero! Your legend starts today."
  ],
  lootFound: [
    "Fortune favors the bold! A treasure has revealed itself to you.",
    "The spirits of adventure smile upon you with this gift!",
    "Destiny has placed this artifact in your path."
  ]
};

const getRandomMessage = (type: keyof typeof ORACLE_MESSAGES) => {
  const messages = ORACLE_MESSAGES[type];
  return messages[Math.floor(Math.random() * messages.length)];
};

// Placeholder AI function
export const getAIQuestSuggestion = async (): Promise<Partial<Quest>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const suggestions = [
    { name: 'Meditate for 10 minutes', category: 'Mindfulness', xp: 70 },
    { name: 'Read 20 pages of a book', category: 'Learning', xp: 80 },
    { name: 'Exercise for 30 minutes', category: 'Fitness', xp: 100 },
    { name: 'Write in your journal', category: 'Personal', xp: 60 },
    { name: 'Learn a new skill', category: 'Learning', xp: 120 },
  ];
  
  return suggestions[Math.floor(Math.random() * suggestions.length)];
};

const calculateXpForLevel = (level: number) => {
  return Math.floor(100 * Math.pow(level, 1.5));
};

const rollForLoot = (): LootItem | null => {
  if (Math.random() < 0.1) { // 10% chance
    return LOOT_TABLE[Math.floor(Math.random() * LOOT_TABLE.length)];
  }
  return null;
};

export const useGameState = () => {
  const [player, setPlayer] = useState<Player>(() => {
    const saved = localStorage.getItem('questlog_player');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        inventory: parsed.inventory || { equipped: [], stored: [] }
      };
    }
    return {
      name: 'Hero',
      level: 1,
      xp: 0,
      xpToNext: calculateXpForLevel(1),
      gold: 0,
      streak: 0,
      prestigeLevel: 0,
      prestigePoints: 0,
      stats: { questsCompleted: 0, totalXp: 0 },
      skills: {},
      inventory: { equipped: [], stored: [] },
      journeyProgress: 0,
    };
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('questlog_quests');
    if (saved) {
      return JSON.parse(saved).map((q: any) => ({
        ...q,
        createdAt: new Date(q.createdAt)
      }));
    }
    
    // Tutorial quests for first-time users
    return [
      {
        id: 'tutorial-1',
        name: 'Embark on Your First Quest',
        category: 'Tutorial',
        xp: 10,
        completed: false,
        createdAt: new Date(),
      },
      {
        id: 'tutorial-2',
        name: 'Master Your Skills',
        category: 'Tutorial',
        xp: 10,
        completed: false,
        createdAt: new Date(),
      },
    ];
  });

  const [dailyFocus, setDailyFocus] = useState<string>(() => {
    const saved = localStorage.getItem('questlog_daily_focus');
    if (saved) {
      const { focus, date } = JSON.parse(saved);
      if (new Date(date).toDateString() === new Date().toDateString()) {
        return focus;
      }
    }
    return '';
  });

  const [oracleMessage, setOracleMessage] = useState<OracleMessage | null>(null);

  // Generate daily focus
  useEffect(() => {
    if (!dailyFocus && Object.keys(player.skills).length > 0) {
      const categories = Object.keys(player.skills);
      const newFocus = categories[Math.floor(Math.random() * categories.length)];
      setDailyFocus(newFocus);
      localStorage.setItem('questlog_daily_focus', JSON.stringify({
        focus: newFocus,
        date: new Date().toISOString()
      }));
    }
  }, [player.skills, dailyFocus]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('questlog_player', JSON.stringify(player));
  }, [player]);

  useEffect(() => {
    localStorage.setItem('questlog_quests', JSON.stringify(quests));
  }, [quests]);

  const showOracleMessage = useCallback((type: keyof typeof ORACLE_MESSAGES) => {
    const message: OracleMessage = {
      text: getRandomMessage(type),
      type
    };
    setOracleMessage(message);
    
    setTimeout(() => {
      setOracleMessage(null);
    }, 5000);
  }, []);

  const calculateRewards = useCallback((quest: Quest) => {
    let xpBonus = 1;
    let goldBonus = 1;

    // Apply equipped item bonuses
    player.inventory.equipped.forEach(item => {
      if (item.type === 'xp_boost') {
        if (!item.category || item.category === quest.category) {
          xpBonus += item.value;
        }
      } else if (item.type === 'gold_boost') {
        goldBonus += item.value;
      }
    });

    // Apply daily focus bonus
    if (quest.category === dailyFocus) {
      xpBonus *= 1.25;
    }

    // Apply prestige bonus
    const prestigeBonus = 1 + (player.prestigePoints * 0.02);
    xpBonus *= prestigeBonus;
    goldBonus *= prestigeBonus;

    const finalXp = Math.floor(quest.xp * xpBonus);
    const finalGold = Math.floor((quest.xp / 10) * goldBonus);

    return { xp: finalXp, gold: finalGold, xpBonus, goldBonus };
  }, [player.inventory.equipped, player.prestigePoints, dailyFocus]);

  const addQuest = useCallback((quest: Omit<Quest, 'id' | 'completed' | 'createdAt'>) => {
    const newQuest: Quest = {
      ...quest,
      id: `quest-${Date.now()}`,
      completed: false,
      createdAt: new Date(),
    };
    setQuests(prev => [...prev, newQuest]);
    toast.success(`Quest "${quest.name}" added!`);
  }, []);

  const completeQuest = useCallback((questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    const rewards = calculateRewards(quest);
    let leveledUp = false;
    let newLevel = player.level;

    setPlayer(prev => {
      let newXp = prev.xp + rewards.xp;
      let newXpToNext = prev.xpToNext;
      let level = prev.level;

      // Check for level up
      while (newXp >= newXpToNext) {
        newXp -= newXpToNext;
        level += 1;
        newXpToNext = calculateXpForLevel(level);
        leveledUp = true;
      }

      newLevel = level;

      // Update skills
      const newSkills = { ...prev.skills };
      newSkills[quest.category] = (newSkills[quest.category] || 0) + 1;

      return {
        ...prev,
        xp: newXp,
        xpToNext: newXpToNext,
        level,
        gold: prev.gold + rewards.gold,
        streak: prev.streak + 1,
        stats: {
          questsCompleted: prev.stats.questsCompleted + 1,
          totalXp: prev.stats.totalXp + rewards.xp,
        },
        skills: newSkills,
        journeyProgress: Math.min(prev.journeyProgress + 1, 10),
      };
    });

    // Roll for loot
    const loot = rollForLoot();
    if (loot) {
      setPlayer(prev => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          stored: [...prev.inventory.stored, loot]
        }
      }));
      toast.success(`🎁 ${loot.name} found!`, {
        description: `A ${loot.rarity} item has been added to your armory!`
      });
      showOracleMessage('lootFound');
    }

    setQuests(prev => prev.filter(q => q.id !== questId));

    // Show messages
    if (leveledUp) {
      toast.success(`🎉 Level Up! You are now level ${newLevel}!`);
      showOracleMessage('levelUp');
    } else if (player.stats.questsCompleted === 0) {
      showOracleMessage('firstQuest');
    }

    toast.success(`Quest completed! +${rewards.xp} XP, +${rewards.gold} Gold`);
  }, [quests, player, calculateRewards, showOracleMessage]);

  const equipItem = useCallback((item: LootItem) => {
    if (player.inventory.equipped.length >= 3) {
      toast.error('Maximum 3 items can be equipped!');
      return;
    }

    setPlayer(prev => ({
      ...prev,
      inventory: {
        equipped: [...prev.inventory.equipped, item],
        stored: prev.inventory.stored.filter(i => i.id !== item.id)
      }
    }));
    toast.success(`${item.name} equipped!`);
  }, [player.inventory.equipped.length]);

  const unequipItem = useCallback((item: LootItem) => {
    setPlayer(prev => ({
      ...prev,
      inventory: {
        equipped: prev.inventory.equipped.filter(i => i.id !== item.id),
        stored: [...prev.inventory.stored, item]
      }
    }));
    toast.success(`${item.name} unequipped!`);
  }, []);

  return {
    player,
    quests,
    dailyFocus,
    oracleMessage,
    addQuest,
    completeQuest,
    equipItem,
    unequipItem,
  };
};
