import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame, Coins, Star, Crown, Sparkles, TrendingUp } from "lucide-react";
import { Player } from "@/hooks/useGameState";

interface DashboardStatsProps {
  player: Player;
}

export const DashboardStats = ({ player }: DashboardStatsProps) => {
  const xpPercentage = (player.xp / player.xpToNext) * 100;
  const xpNeeded = player.xpToNext - player.xp;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Card with Enhanced Design */}
      <Card className="glass-card border-primary/30 glow-primary overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-leisure/5 opacity-50" />
        <div className="p-6 relative">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
                <Crown className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-1 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {player.name}
              {player.prestigeLevel > 0 && (
                <span className="text-secondary ml-2 text-2xl">[P{player.prestigeLevel}]</span>
              )}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-lg font-semibold text-foreground">Level {player.level}</span>
            </div>
          </div>

          {/* XP Progress with Better Visual Feedback */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Experience Progress</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{player.xp} / {player.xpToNext} XP</span>
                <Badge variant="outline" className="border-primary/30 bg-primary/5 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {Math.floor(xpPercentage)}%
                </Badge>
              </div>
            </div>
            <Progress value={xpPercentage} className="h-4 progress-glow" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Next level in {xpNeeded} XP</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" />
                Level {player.level + 1}
              </span>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-card p-4 rounded-lg text-center hover:border-secondary/40 transition-all card-hover">
              <Coins className="w-7 h-7 text-secondary mx-auto mb-2 animate-pulse" />
              <div className="text-2xl font-bold text-secondary">{player.gold}</div>
              <div className="text-xs text-muted-foreground">Gold</div>
            </div>

            <div className="glass-card p-4 rounded-lg text-center hover:border-accent/40 transition-all card-hover">
              <Flame className="w-7 h-7 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-accent">{player.streak}</div>
              <div className="text-xs text-muted-foreground">Streak</div>
            </div>

            <div className="glass-card p-4 rounded-lg text-center hover:border-primary/40 transition-all card-hover">
              <Star className="w-7 h-7 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{player.stats.questsCompleted}</div>
              <div className="text-xs text-muted-foreground">Quests</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Skills Section - Enhanced */}
      {Object.keys(player.skills).length > 0 && (
        <Card className="glass-card p-6 border-primary/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Skill Progress
          </h3>
          <div className="space-y-3">
            {Object.entries(player.skills)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 5)
              .map(([skill, level]) => (
                <div key={skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{skill}</span>
                    <Badge variant="outline" className="text-xs border-primary/30">
                      Level {level}
                    </Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                      style={{ width: `${Math.min(((level as number) / 10) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
          {Object.keys(player.skills).length > 5 && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              Showing top 5 skills • {Object.keys(player.skills).length} total
            </p>
          )}
        </Card>
      )}
    </div>
  );
};
