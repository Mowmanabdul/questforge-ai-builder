import { useEffect, useState } from 'react';
import { OracleMessage } from './OracleMessage';
import { OracleMessage as OracleMessageType } from '@/hooks/useGameState';

interface ProactiveCoachProps {
  player: any;
  activeQuests: any[];
  onNavigateToCoach?: () => void;
}

export const ProactiveCoach = ({ player, activeQuests, onNavigateToCoach }: ProactiveCoachProps) => {
  const [message, setMessage] = useState<OracleMessageType | null>(null);

  useEffect(() => {
    // Check for proactive coaching opportunities
    const lastCheck = localStorage.getItem('last_coach_check');
    const now = new Date();
    const today = now.toDateString();

    // Only show one message per day
    if (lastCheck === today) return;

    // Priority 1: Streak warning (2 days without completing quest)
    const lastActivity = localStorage.getItem('last_quest_completed');
    if (lastActivity) {
      const daysSince = Math.floor((now.getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince >= 2 && player.streak > 0) {
        setMessage({
          text: `🔥 Your ${player.streak}-day streak is at risk! Complete at least one quest today to keep your momentum alive, Champion!`,
          type: 'streakContinued'
        });
        localStorage.setItem('last_coach_check', today);
        return;
      }
    }

    // Priority 2: Daily check-in (morning motivation)
    const hour = now.getHours();
    if (hour >= 6 && hour <= 10 && activeQuests.length > 0) {
      const highPriority = activeQuests.filter(q => q.priority === 'high').length;
      if (highPriority > 0) {
        setMessage({
          text: `⚔️ Good morning, Adventurer! You have ${highPriority} high-priority quest${highPriority > 1 ? 's' : ''} waiting. Time to level up!`,
          type: 'levelUp'
        });
        localStorage.setItem('last_coach_check', today);
        return;
      }
    }

    // Priority 3: Overloaded quest log
    if (activeQuests.length >= 10) {
      setMessage({
        text: `📋 Your quest log is overflowing with ${activeQuests.length} active quests! Consider tackling a few quick wins to lighten the load.`,
        type: 'lootFound'
      });
      localStorage.setItem('last_coach_check', today);
      return;
    }

    // Priority 4: No active quests (need motivation)
    if (activeQuests.length === 0) {
      setMessage({
        text: `🎯 Your quest log is empty, Hero! Ready to embark on new adventures? What challenge shall we tackle today?`,
        type: 'levelUp'
      });
      localStorage.setItem('last_coach_check', today);
      return;
    }

    // Priority 5: Milestone celebration
    const questsCompleted = player.stats.questsCompleted || 0;
    const milestones = [10, 25, 50, 100, 250, 500, 1000];
    const lastCelebrated = parseInt(localStorage.getItem('last_milestone_celebrated') || '0');
    
    for (const milestone of milestones) {
      if (questsCompleted >= milestone && lastCelebrated < milestone) {
        setMessage({
          text: `🎉 LEGENDARY ACHIEVEMENT! You've completed ${milestone} quests! Your dedication is truly epic, Champion! 🏆`,
          type: 'levelUp'
        });
        localStorage.setItem('last_coach_check', today);
        localStorage.setItem('last_milestone_celebrated', milestone.toString());
        return;
      }
    }

    // Priority 6: Daily focus reminder
    const highestSkill = Object.entries(player.skills)
      .sort((a, b) => (b[1] as number) - (a[1] as number))[0];
    
    if (highestSkill && Math.random() > 0.7) {
      const [category, level] = highestSkill;
      setMessage({
        text: `✨ Your ${category} skill is at Level ${level}! Today's bonus XP could help you push even further. Strike while the iron is hot!`,
        type: 'lootFound'
      });
      localStorage.setItem('last_coach_check', today);
      return;
    }

  }, [player, activeQuests]);

  // Track quest completions for streak warning
  useEffect(() => {
    if (player.stats.questsCompleted > 0) {
      localStorage.setItem('last_quest_completed', new Date().toISOString());
    }
  }, [player.stats.questsCompleted]);

  if (!message) return null;

  return <OracleMessage message={message} />;
};
