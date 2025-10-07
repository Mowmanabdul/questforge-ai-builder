import { Achievement } from "@/hooks/useGameState";

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // Quest Achievements
  {
    id: 'first_quest',
    name: 'First Steps',
    description: 'Complete your first quest',
    icon: 'target',
    progress: 0,
    target: 1,
    category: 'quests',
    rarity: 'common',
  },
  {
    id: 'quest_10',
    name: 'Journeyman',
    description: 'Complete 10 quests',
    icon: 'award',
    progress: 0,
    target: 10,
    category: 'quests',
    rarity: 'common',
  },
  {
    id: 'quest_50',
    name: 'Veteran',
    description: 'Complete 50 quests',
    icon: 'trophy',
    progress: 0,
    target: 50,
    category: 'quests',
    rarity: 'rare',
  },
  {
    id: 'quest_100',
    name: 'Centurion',
    description: 'Complete 100 quests',
    icon: 'crown',
    progress: 0,
    target: 100,
    category: 'quests',
    rarity: 'epic',
  },
  {
    id: 'quest_500',
    name: 'Legend',
    description: 'Complete 500 quests',
    icon: 'sparkles',
    progress: 0,
    target: 500,
    category: 'quests',
    rarity: 'legendary',
  },

  // Streak Achievements
  {
    id: 'streak_3',
    name: 'Getting Started',
    description: 'Maintain a 3-day streak',
    icon: 'flame',
    progress: 0,
    target: 3,
    category: 'streak',
    rarity: 'common',
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'zap',
    progress: 0,
    target: 7,
    category: 'streak',
    rarity: 'rare',
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: 'calendar',
    progress: 0,
    target: 30,
    category: 'streak',
    rarity: 'epic',
  },
  {
    id: 'streak_100',
    name: 'Unstoppable',
    description: 'Maintain a 100-day streak',
    icon: 'infinity',
    progress: 0,
    target: 100,
    category: 'streak',
    rarity: 'legendary',
  },

  // XP Achievements
  {
    id: 'xp_1000',
    name: 'Knowledge Seeker',
    description: 'Earn 1,000 total XP',
    icon: 'book',
    progress: 0,
    target: 1000,
    category: 'xp',
    rarity: 'common',
  },
  {
    id: 'xp_5000',
    name: 'Wisdom Gatherer',
    description: 'Earn 5,000 total XP',
    icon: 'brain',
    progress: 0,
    target: 5000,
    category: 'xp',
    rarity: 'rare',
  },
  {
    id: 'xp_10000',
    name: 'Master Scholar',
    description: 'Earn 10,000 total XP',
    icon: 'graduation-cap',
    progress: 0,
    target: 10000,
    category: 'xp',
    rarity: 'epic',
  },

  // Gold Achievements
  {
    id: 'gold_500',
    name: 'Coin Collector',
    description: 'Earn 500 total gold',
    icon: 'coins',
    progress: 0,
    target: 500,
    category: 'gold',
    rarity: 'common',
  },
  {
    id: 'gold_2000',
    name: 'Treasure Hunter',
    description: 'Earn 2,000 total gold',
    icon: 'gem',
    progress: 0,
    target: 2000,
    category: 'gold',
    rarity: 'rare',
  },
  {
    id: 'gold_5000',
    name: 'Wealthy Adventurer',
    description: 'Earn 5,000 total gold',
    icon: 'diamond',
    progress: 0,
    target: 5000,
    category: 'gold',
    rarity: 'epic',
  },

  // Special Achievements
  {
    id: 'level_10',
    name: 'Rising Star',
    description: 'Reach level 10',
    icon: 'star',
    progress: 0,
    target: 10,
    category: 'special',
    rarity: 'rare',
  },
  {
    id: 'level_25',
    name: 'Seasoned Hero',
    description: 'Reach level 25',
    icon: 'shield',
    progress: 0,
    target: 25,
    category: 'special',
    rarity: 'epic',
  },
  {
    id: 'perfect_day',
    name: 'Perfect Day',
    description: 'Complete 10 quests in a single day',
    icon: 'sun',
    progress: 0,
    target: 10,
    category: 'special',
    rarity: 'rare',
  },
  {
    id: 'balanced_hero',
    name: 'Balanced Hero',
    description: 'Complete quests in 5 different categories',
    icon: 'balance-scale',
    progress: 0,
    target: 5,
    category: 'special',
    rarity: 'epic',
  },
];

export const checkAchievementProgress = (
  achievement: Achievement,
  player: any
): { progress: number; justUnlocked: boolean } => {
  let currentProgress = 0;
  const wasUnlocked = !!achievement.unlockedAt;

  switch (achievement.id) {
    case 'first_quest':
    case 'quest_10':
    case 'quest_50':
    case 'quest_100':
    case 'quest_500':
      currentProgress = player.stats.questsCompleted;
      break;
    
    case 'streak_3':
    case 'streak_7':
    case 'streak_30':
    case 'streak_100':
      currentProgress = player.streak;
      break;
    
    case 'xp_1000':
    case 'xp_5000':
    case 'xp_10000':
      currentProgress = player.stats.totalXp;
      break;
    
    case 'gold_500':
    case 'gold_2000':
    case 'gold_5000':
      currentProgress = player.goldTransactions
        ?.filter((t: any) => t.type === 'earned')
        .reduce((sum: number, t: any) => sum + t.amount, 0) || 0;
      break;
    
    case 'level_10':
    case 'level_25':
      currentProgress = player.level;
      break;
    
    case 'perfect_day':
      const today = new Date().toDateString();
      currentProgress = player.questHistory?.filter((q: any) => 
        new Date(q.completedAt).toDateString() === today
      ).length || 0;
      break;
    
    case 'balanced_hero':
      const uniqueCategories = new Set(
        player.questHistory?.map((q: any) => q.category) || []
      );
      currentProgress = uniqueCategories.size;
      break;
  }

  const justUnlocked = !wasUnlocked && currentProgress >= achievement.target;

  return { progress: currentProgress, justUnlocked };
};
