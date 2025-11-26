import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Coins, Target, Zap, Calendar, Flame, TrendingUp, Trophy, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedDashboardProps {
  player: any;
  quests: any[];
  dailyFocus: string | null;
}

const AnimatedCounter = React.memo(({ value, duration = 1000 }: { value: number; duration?: number }) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
});

AnimatedCounter.displayName = "AnimatedCounter";

const EnhancedStatCard = React.memo(({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  subtitle, 
  progress, 
  trend,
  trendValue 
}: any) => (
  <Card className="glass-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group overflow-hidden relative">
    {/* Gradient background overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <CardContent className="pt-6 relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className={cn("text-3xl font-bold transition-all duration-300", color)}>
              <AnimatedCounter value={value} />
            </p>
            {trend && trendValue && (
              <div className={cn(
                "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                trend === 'up' ? "text-accent bg-accent/10" : "text-muted-foreground bg-muted/10"
              )}>
                <TrendingUp className={cn("w-3 h-3", trend === 'down' && "rotate-180")} />
                {trendValue}
              </div>
            )}
          </div>
        </div>
        <div className={cn(
          "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
          "bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20"
        )}>
          <Icon className={cn("w-8 h-8 transition-all duration-300", color)} />
        </div>
      </div>
      
      {progress !== undefined && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      <p className="text-xs text-muted-foreground mt-2 font-medium">{subtitle}</p>
    </CardContent>
  </Card>
));

EnhancedStatCard.displayName = "EnhancedStatCard";

const RecentQuestCard = React.memo(({ quest }: { quest: any }) => (
  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-muted/30 to-muted/20 border border-border/50 hover:border-primary/30 transition-all group">
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
        {quest.name}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-xs text-muted-foreground capitalize">
          {quest.category}
        </p>
        <span className="text-xs text-muted-foreground">•</span>
        <p className="text-xs text-muted-foreground">
          {new Date(quest.completedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="text-xs font-bold text-primary border-primary/50 bg-primary/5">
        +{quest.xp} XP
      </Badge>
      <Trophy className="w-4 h-4 text-gold" />
    </div>
  </div>
));

RecentQuestCard.displayName = "RecentQuestCard";

export const EnhancedDashboard = React.memo(({ player, quests, dailyFocus }: EnhancedDashboardProps) => {
  const activeQuests = quests.filter(q => !q.completed).length;
  const completedToday = (player.questHistory || []).filter((q: any) => {
    const today = new Date().toDateString();
    return new Date(q.completedAt).toDateString() === today;
  }).length;

  const nextLevelXP = player.level * 100;
  const xpProgress = (player.xp / nextLevelXP) * 100;
  const recentQuests = (player.questHistory || []).slice(0, 4);
  
  // Calculate weekly progress for trends
  const weeklyQuests = (player.questHistory || []).filter((q: any) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(q.completedAt) >= weekAgo;
  }).length;

  const stats = [
    {
      title: "Level",
      value: player.level,
      icon: Award,
      color: "text-primary",
      subtitle: `${player.xp}/${nextLevelXP} XP to next level`,
      progress: xpProgress,
      trend: "up",
      trendValue: `+${Math.floor(xpProgress)}%`
    },
    {
      title: "Gold",
      value: player.gold,
      icon: Coins,
      color: "text-gold",
      subtitle: "Total wealth earned",
      trend: "up",
      trendValue: `+${player.gold > 100 ? Math.floor(player.gold * 0.1) : player.gold}`
    },
    {
      title: "Streak",
      value: player.streak,
      icon: Flame,
      color: "text-accent",
      subtitle: `${player.streak} days in a row`,
      trend: player.streak > 0 ? "up" : undefined,
      trendValue: player.streak > 1 ? `+${player.streak - 1}` : undefined
    },
    {
      title: "Active Quests",
      value: activeQuests,
      icon: Target,
      color: "text-leisure",
      subtitle: `${completedToday} completed today`,
      trend: completedToday > 0 ? "up" : undefined,
      trendValue: completedToday > 0 ? `+${completedToday}` : undefined
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <EnhancedStatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Recent Activity & Daily Focus */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Completions - Takes 2 columns */}
        <Card className="glass-card xl:col-span-2 group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <span>Recent Victories</span>
                <p className="text-sm font-normal text-muted-foreground">
                  Your latest conquests
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentQuests.length > 0 ? (
              <div className="space-y-3">
                {recentQuests.map((quest: any, idx: number) => (
                  <RecentQuestCard key={idx} quest={quest} />
                ))}
                {recentQuests.length >= 4 && (
                  <div className="text-center pt-2">
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      {(player.questHistory || []).length} total quests completed
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">No quests completed yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Complete your first quest to see it here!</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Daily Focus */}
        <Card className="glass-card group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-leisure/20">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              Daily Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dailyFocus ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/20 relative overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 animate-pulse opacity-50" />
                  
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-primary border-primary/50 bg-primary/10 font-semibold">
                        <Star className="w-3 h-3 mr-1" />
                        Priority Focus
                      </Badge>
                    </div>
                    <p className="text-xl font-bold capitalize text-foreground">
                      {dailyFocus}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Complete <span className="font-semibold text-primary">{dailyFocus}</span> quests for 
                      <span className="font-bold text-primary"> +25% XP bonus</span>!
                    </p>
                    <div className="pt-2 border-t border-border/30">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Flame className="w-3 h-3 text-primary" />
                        Focus on high-priority {dailyFocus} tasks for maximum efficiency
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Weekly progress indicator */}
                <div className="text-center space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">This Week</p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="outline" className="text-xs text-accent border-accent/50">
                      {weeklyQuests} quests completed
                    </Badge>
                    {weeklyQuests > 0 && (
                      <Badge variant="outline" className="text-xs text-primary border-primary/50">
                        +{weeklyQuests * 50} total XP
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-muted/30 to-muted/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">No daily focus set</p>
                  <p className="text-xs text-muted-foreground mt-1">Add quests to get personalized focus recommendations!</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

EnhancedDashboard.displayName = "EnhancedDashboard";
