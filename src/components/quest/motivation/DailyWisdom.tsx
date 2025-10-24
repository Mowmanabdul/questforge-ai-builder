import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const WISDOM_QUOTES = [
  { text: "Every legendary hero started at Level 1. Your journey begins with a single quest.", author: "Ancient Gamer Wisdom", icon: "⚔️" },
  { text: "Grinding daily quests builds the foundation for epic victories.", author: "The Sage", icon: "🎮" },
  { text: "Even small XP gains compound into legendary power over time.", author: "Elder Adventurer", icon: "✨" },
  { text: "The best time to start your quest was yesterday. The second best time is now.", author: "Time Mage Council", icon: "⏰" },
  { text: "Progress, not perfection. Every quest completed makes you stronger.", author: "Training Master", icon: "💪" },
  { text: "Your streak is your power multiplier. Protect it like your most valuable loot.", author: "Streak Guardian", icon: "🔥" },
  { text: "Boss battles are just side quests broken into smaller encounters.", author: "Dungeon Strategist", icon: "🐉" },
  { text: "The secret to leveling up? Show up daily and complete your quests.", author: "Grand Champion", icon: "🏆" },
  { text: "Rest is part of the strategy. Even heroes need to recover at the inn.", author: "Innkeeper's Wisdom", icon: "🛡️" },
  { text: "Your quest log doesn't define you. Your completed quests do.", author: "Achievement Hunter", icon: "📜" },
  { text: "Every master was once a beginner who refused to give up on their main quest.", author: "Guild Master", icon: "🎯" },
  { text: "Focus on your daily bonus category. That's where the XP multiplier awaits.", author: "Efficiency Expert", icon: "⚡" },
  { text: "Consistency beats intensity. A daily quest completed is worth more than a weekly sprint.", author: "Marathon Runner", icon: "🏃" },
  { text: "Your future power level depends on the quests you complete today.", author: "Oracle of Progress", icon: "🔮" },
  { text: "Excellence isn't a destination, it's a continuous grind with amazing rewards.", author: "Legendary Smith", icon: "⚒️" },
];

export const DailyWisdom = () => {
  const [quote, setQuote] = useState(WISDOM_QUOTES[0]);

  useEffect(() => {
    // Get quote based on the day
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setQuote(WISDOM_QUOTES[dayOfYear % WISDOM_QUOTES.length]);
  }, []);

  return (
    <Card className="glass-card border-primary/20 bg-gradient-to-br from-primary/5 via-insight/5 to-leisure/5 animate-fade-in overflow-hidden relative">
      <div className="absolute top-0 right-0 text-6xl opacity-10 select-none">
        {quote.icon}
      </div>
      <CardContent className="pt-6 relative z-10">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-insight/20 backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-primary/70 mb-2 font-semibold">
              ✨ Daily Wisdom
            </p>
            <p className="text-sm font-medium mb-2 leading-relaxed">
              {quote.icon} "{quote.text}"
            </p>
            <p className="text-xs text-muted-foreground font-medium">— {quote.author}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
