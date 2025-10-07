import { DailyChallenge } from "@/hooks/useGameState";

export const generateDailyChallenges = (date: Date): DailyChallenge[] => {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  
  // Use day of year to generate consistent challenges for each day
  const seed = dayOfYear % 20;
  
  const challengeTemplates = [
    // Complete X quests
    {
      name: 'Daily Hustle',
      description: 'Complete 3 quests today',
      requirement: { type: 'complete_quests' as const, count: 3 },
      reward: { xp: 50, gold: 30 },
    },
    {
      name: 'Quest Marathon',
      description: 'Complete 5 quests today',
      requirement: { type: 'complete_quests' as const, count: 5 },
      reward: { xp: 100, gold: 60 },
    },
    {
      name: 'Overachiever',
      description: 'Complete 8 quests today',
      requirement: { type: 'complete_quests' as const, count: 8 },
      reward: { xp: 200, gold: 120 },
    },
    // Earn X XP
    {
      name: 'XP Hunter',
      description: 'Earn 150 XP today',
      requirement: { type: 'earn_xp' as const, count: 150 },
      reward: { xp: 30, gold: 40 },
    },
    {
      name: 'Knowledge Seeker',
      description: 'Earn 300 XP today',
      requirement: { type: 'earn_xp' as const, count: 300 },
      reward: { xp: 50, gold: 80 },
    },
    // Complete category quests
    {
      name: 'Work Focus',
      description: 'Complete 2 Work quests',
      requirement: { type: 'complete_category' as const, count: 2, category: 'Work' },
      reward: { xp: 60, gold: 40 },
    },
    {
      name: 'Fitness Challenge',
      description: 'Complete 2 Fitness quests',
      requirement: { type: 'complete_category' as const, count: 2, category: 'Fitness' },
      reward: { xp: 60, gold: 40 },
    },
    {
      name: 'Learning Sprint',
      description: 'Complete 2 Learning quests',
      requirement: { type: 'complete_category' as const, count: 2, category: 'Learning' },
      reward: { xp: 60, gold: 40 },
    },
    {
      name: 'Mindfulness Master',
      description: 'Complete 2 Mindfulness quests',
      requirement: { type: 'complete_category' as const, count: 2, category: 'Mindfulness' },
      reward: { xp: 60, gold: 40 },
    },
    {
      name: 'Social Butterfly',
      description: 'Complete 2 Social quests',
      requirement: { type: 'complete_category' as const, count: 2, category: 'Social' },
      reward: { xp: 60, gold: 40 },
    },
  ];

  // Select 2-3 challenges for the day based on the seed
  const numChallenges = 2 + (seed % 2);
  const selectedChallenges = [];
  
  for (let i = 0; i < numChallenges; i++) {
    const index = (seed + i * 7) % challengeTemplates.length;
    const template = challengeTemplates[index];
    
    selectedChallenges.push({
      id: `challenge_${date.toISOString().split('T')[0]}_${i}`,
      ...template,
      date,
      completed: false,
    });
  }

  return selectedChallenges;
};
