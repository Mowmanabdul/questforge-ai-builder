import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { Player, Quest } from "@/hooks/useGameState";
import { useState, useEffect } from "react";

interface AISageProps {
  player: Player;
  quests: Quest[];
}

export const getAIHabitAdvice = (player: Player, quests: Quest[]): string => {
  const { questHistory, skills, stats, streak } = player;
  
  // No history yet - welcome message
  if (stats.questsCompleted === 0) {
    return "Welcome, brave adventurer! Your journey begins now. Start by completing a small quest to build momentum. Remember: consistency beats intensity.";
  }

  // Analyze for habit stacking
  if (questHistory.length >= 7) {
    const categoryCount: Record<string, number> = {};
    questHistory.slice(-7).forEach(q => {
      categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;
    });
    const mostConsistent = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)[0];
    
    if (mostConsistent && mostConsistent[1] >= 5) {
      return `I see you never miss your '${mostConsistent[0]}' quests. This is a powerful anchor habit! To build something new, try stacking a small 10 XP quest onto this reliable routine. What complements ${mostConsistent[0]}?`;
    }
  }

  // Detect burnout risk
  const recentQuests = questHistory.slice(-5);
  const highXpQuests = recentQuests.filter(q => q.xp >= 100).length;
  if (highXpQuests >= 4 && streak > 3) {
    return "Even heroes need to rest. You've conquered many great quests recently. To prevent burnout and secure your streak, consider adding a low-effort 'Active Recovery' quest tomorrow, like 'Stretch for 5 minutes' or 'Write one thought in a journal.'";
  }

  // Broken streak recovery
  if (streak === 0 && stats.questsCompleted > 5) {
    return "Every hero stumbles. The key is getting back up quickly. Start with a micro-win today: a single 10 XP quest. Just one. That's all it takes to restart your momentum.";
  }

  // Skill synergy - suggest project quests
  const topSkills = Object.entries(skills)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .filter(([, level]) => level >= 3);
  
  if (topSkills.length >= 2) {
    const [skill1, skill2] = topSkills;
    return `Your mastery in '${skill1[0]}' (Lv ${skill1[1]}) and '${skill2[0]}' (Lv ${skill2[1]}) is impressive. I propose a Legendary Project Quest that combines both skills. This will be challenging, but the rewards will be immense. What meaningful project bridges these two domains?`;
  }

  // Balance advice
  const skillsArray = Object.entries(skills);
  if (skillsArray.length >= 3) {
    const lowest = skillsArray.sort(([, a], [, b]) => a - b)[0];
    return `Your journey is taking shape, but I notice '${lowest[0]}' has been neglected. A well-rounded hero trains all their skills. Consider adding one quest in this area to maintain balance.`;
  }

  // Default motivational
  return `You're making excellent progress! Your consistency is ${streak} days strong. Remember: small daily actions compound into extraordinary results. What's your next conquest?`;
};

export const AISage = ({ player, quests }: AISageProps) => {
  const [advice, setAdvice] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const generateAdvice = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setAdvice(getAIHabitAdvice(player, quests));
      setIsRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    generateAdvice();
  }, []); // Only on mount

  return (
    <Card className="glass-card border-primary/30 shadow-glow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <CardTitle className="text-xl">A Word from the Sage</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateAdvice}
            disabled={isRefreshing}
            className="hover:bg-primary/10"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <p className="text-sm leading-relaxed italic text-foreground/90">
            "{advice}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
