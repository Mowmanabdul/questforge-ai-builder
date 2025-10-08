import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Coins, Target, Zap, Calendar, Flame } from "lucide-react";

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

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
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

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gold</p>
                <p className="text-3xl font-bold text-gold">{player.gold}</p>
              </div>
              <Coins className="w-10 h-10 text-gold" />
            </div>
            <p className="text-xs text-muted-foreground mt-5">
              Total earned
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-3xl font-bold text-accent">{player.streak}</p>
              </div>
              <Flame className="w-10 h-10 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground mt-5">
              days in a row
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-leisure">{activeQuests}</p>
              </div>
              <Target className="w-10 h-10 text-leisure" />
            </div>
            <p className="text-xs text-muted-foreground mt-5">
              {completedToday} done today
            </p>
          </CardContent>
        </Card>
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
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
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
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No completed quests yet</p>
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
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <Badge variant="outline" className="text-primary border-primary/50 mb-2">
                  Priority Category
                </Badge>
                <p className="text-lg font-semibold capitalize">{dailyFocus}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Complete {dailyFocus} quests for +25% XP bonus!
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No daily focus set yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};