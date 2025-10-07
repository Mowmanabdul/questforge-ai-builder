import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Coins, Target, TrendingUp, Zap, Gift, Calendar, Flame } from "lucide-react";

interface DashboardProps {
  player: any;
  quests: any[];
  dailyFocus: string | null;
}

export const Dashboard = ({ player, quests, dailyFocus }: DashboardProps) => {
  const activeQuests = quests.filter(q => !q.completed).length;
  const completedToday = (player.questHistory || []).filter((q: any) => {
    const today = new Date().toDateString();
    return new Date(q.completedAt).toDateString() === today;
  }).length;

  const nextLevelXP = player.level * 100;
  const xpProgress = (player.xp / nextLevelXP) * 100;

  const recentQuests = (player.questHistory || []).slice(0, 3);
  const recentRewards = (player.leisureHistory || []).slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-primary/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-3xl font-bold text-primary">{player.level}</p>
              </div>
              <Award className="w-10 h-10 text-primary" />
            </div>
            <Progress value={xpProgress} className="mt-3 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {player.xp}/{nextLevelXP} XP
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-gold/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gold</p>
                <p className="text-3xl font-bold text-gold">{player.gold}</p>
              </div>
              <Coins className="w-10 h-10 text-gold" />
            </div>
            <p className="text-xs text-muted-foreground mt-5">
              Ready to spend on rewards
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-accent/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-3xl font-bold text-accent">{player.streak}</p>
              </div>
              <Flame className="w-10 h-10 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground mt-5">
              {player.streak > 0 ? "Keep it going!" : "Start your streak today"}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-leisure/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Quests</p>
                <p className="text-3xl font-bold text-leisure">{activeQuests}</p>
              </div>
              <Target className="w-10 h-10 text-leisure" />
            </div>
            <p className="text-xs text-muted-foreground mt-5">
              {completedToday} completed today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Focus & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Focus */}
        <Card className="glass-card border-insight/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-insight" />
              Today's Focus
            </CardTitle>
            <CardDescription>Your daily quest priority</CardDescription>
          </CardHeader>
          <CardContent>
            {dailyFocus ? (
              <div className="p-4 rounded-lg bg-insight/10 border border-insight/30">
                <Badge variant="outline" className="text-insight border-insight/50 mb-2">
                  Priority Category
                </Badge>
                <p className="text-lg font-semibold capitalize">{dailyFocus}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Complete {dailyFocus} quests for bonus rewards!
                </p>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No daily focus set yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Progress */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Quick Stats
            </CardTitle>
            <CardDescription>Your progress snapshot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Completed</span>
                <span className="font-semibold">{player.completedQuests} quests</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total XP Earned</span>
                <span className="font-semibold text-primary">{player.xp} XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rewards Unlocked</span>
                <span className="font-semibold text-leisure">
                  {player.leisureHistory?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Custom Rewards</span>
                <span className="font-semibold text-gold">
                  {player.customRewards?.length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quests */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-accent" />
              Recent Completions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentQuests.length > 0 ? (
              <div className="space-y-3">
                {recentQuests.map((quest: any, idx: number) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{quest.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {quest.category} • {new Date(quest.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <Badge variant="outline" className="text-primary border-primary/50">
                        +{quest.xpEarned} XP
                      </Badge>
                      <Badge variant="outline" className="text-gold border-gold/50">
                        +{quest.goldEarned} Gold
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No completed quests yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Rewards */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gift className="w-5 h-5 text-leisure" />
              Recent Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentRewards.length > 0 ? (
              <div className="space-y-3">
                {recentRewards.map((reward: any, idx: number) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{reward.activityName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(reward.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-leisure border-leisure/50">
                      {reward.cost} Gold
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Gift className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No rewards claimed yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
