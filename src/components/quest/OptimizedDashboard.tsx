import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Coins, Target, Zap, Calendar, Flame, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardProps {
  player: any;
  quests: any[];
  dailyFocus: string | null;
}

const StatCard = React.memo(({ title, value, icon: Icon, color, subtitle, progress }: any) => (
  <Card className="glass-card hover-scale-smooth transition-all duration-300">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={cn("text-3xl font-bold", color)}>{value}</p>
        </div>
        <Icon className={cn("w-10 h-10", color)} />
      </div>
      {progress !== undefined && (
        <Progress value={progress} className="h-2 mb-2" />
      )}
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </CardContent>
  </Card>
));

StatCard.displayName = "StatCard";

const RecentQuestCard = React.memo(({ quest }: { quest: any }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-all">
    <div className="flex-1">
      <p className="text-sm font-medium">{quest.name}</p>
      <p className="text-xs text-muted-foreground capitalize">
        {quest.category}
      </p>
    </div>
    <Badge variant="outline" className="text-primary border-primary/50 text-xs">
      +{quest.xp} XP
    </Badge>
  </div>
));

RecentQuestCard.displayName = "RecentQuestCard";

export const OptimizedDashboard = React.memo(({ player, quests, dailyFocus }: DashboardProps) => {
  const activeQuests = quests.filter(q => !q.completed).length;
  const completedToday = (player.questHistory || []).filter((q: any) => {
    const today = new Date().toDateString();
    return new Date(q.completedAt).toDateString() === today;
  }).length;

  const nextLevelXP = player.level * 100;
  const xpProgress = (player.xp / nextLevelXP) * 100;
  const recentQuests = (player.questHistory || []).slice(0, 3);

  const stats = [
    {
      title: "Level",
      value: player.level,
      icon: Award,
      color: "text-primary",
      subtitle: `${player.xp}/${nextLevelXP} XP`,
      progress: xpProgress
    },
    {
      title: "Gold",
      value: player.gold,
      icon: Coins,
      color: "text-gold",
      subtitle: "Total earned"
    },
    {
      title: "Streak",
      value: player.streak,
      icon: Flame,
      color: "text-accent",
      subtitle: "days in a row"
    },
    {
      title: "Active",
      value: activeQuests,
      icon: Target,
      color: "text-leisure",
      subtitle: `${completedToday} done today`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quests */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-primary" />
              Recent Completions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentQuests.length > 0 ? (
              <div className="space-y-3">
                {recentQuests.map((quest: any, idx: number) => (
                  <RecentQuestCard key={idx} quest={quest} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No completed quests yet</p>
                <p className="text-xs mt-1">Complete your first quest to start tracking progress!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Focus */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-insight" />
              Today's Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dailyFocus ? (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 hover:border-primary/50 transition-all">
                <Badge variant="outline" className="text-primary border-primary/50 mb-2">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Priority Category
                </Badge>
                <p className="text-lg font-semibold capitalize">{dailyFocus}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Complete {dailyFocus} quests for <strong className="text-primary">+25% XP bonus</strong>!
                </p>
                <div className="mt-3 pt-3 border-t border-border/30">
                  <p className="text-xs text-muted-foreground">
                    💡 Tip: Focus on high-priority {dailyFocus} tasks today for maximum efficiency
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No daily focus set yet</p>
                <p className="text-xs mt-1">Add some quests to get a daily focus recommendation!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

OptimizedDashboard.displayName = "OptimizedDashboard";
