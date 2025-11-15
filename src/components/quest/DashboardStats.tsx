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
    <div className="space-y-4 animate-fade-in">
      {/* Hero Card - Player Info */}
      <Card className="glass-card border-primary/30 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-purple-500/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent animate-pulse" />
        </div>
        <div className="p-6 relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Crown className="w-6 h-6 text-primary drop-shadow-lg" />
                {player.name}
              </h2>
              <p className="text-muted-foreground font-medium">Level {player.level} Adventurer</p>
            </div>
            <div className="text-right bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
              <div className="text-3xl font-bold bg-gradient-to-br from-primary to-purple-400 bg-clip-text text-transparent">{player.level}</div>
              <p className="text-xs text-muted-foreground font-medium">Level</p>
            </div>
          </div>

          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Progress to Level {player.level + 1}</span>
              <span className="font-bold text-foreground">{player.xp} / {player.xpToNext} XP</span>
            </div>
            <Progress value={xpPercentage} className="h-3 shadow-inner" />
            <p className="text-xs text-muted-foreground text-right font-medium">
              {xpNeeded} XP needed
            </p>
          </div>

        </div>
      </Card>

      {/* Core Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="glass-card card-hover border-yellow-500/20 group">
          <div className="p-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-2 rounded-lg bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors">
                <Coins className="w-8 h-8 text-yellow-500 drop-shadow-lg" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-br from-yellow-400 to-yellow-600 bg-clip-text text-transparent">{player.gold}</div>
              <p className="text-xs text-muted-foreground font-semibold">Gold</p>
            </div>
          </div>
        </Card>
        
        <Card className="glass-card card-hover border-orange-500/20 group">
          <div className="p-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                <Flame className="w-8 h-8 text-orange-500 drop-shadow-lg" />
              </div>
              <div className="text-2xl font-bold text-orange-500">{player.streak}</div>
              <p className="text-xs text-muted-foreground font-semibold">Streak</p>
            </div>
          </div>
        </Card>
        
        <Card className="glass-card card-hover border-primary/20 group">
          <div className="p-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Trophy className="w-8 h-8 text-primary drop-shadow-lg" />
              </div>
              <div className="text-2xl font-bold text-primary">{player.stats.questsCompleted}</div>
              <p className="text-xs text-muted-foreground font-semibold">Quests</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Skills Section */}
      {Object.keys(player.skills).length > 0 && (
        <Card className="glass-card border-primary/20">
          <div className="p-6">
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
          </div>
        </Card>
      )}
    </div>
  );
};
