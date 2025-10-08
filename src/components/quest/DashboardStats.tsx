import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame, Coins, Star } from "lucide-react";
import { Player } from "@/hooks/useGameState";

interface DashboardStatsProps {
  player: Player;
}

export const DashboardStats = ({ player }: DashboardStatsProps) => {
  const xpPercentage = (player.xp / player.xpToNext) * 100;

  return (
    <Card className="glass-card p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-1">
          {player.name}
          {player.prestigeLevel > 0 && (
            <span className="text-secondary ml-2 text-2xl">[P{player.prestigeLevel}]</span>
          )}
        </h2>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Trophy className="w-4 h-4 text-primary" />
          <span>Level {player.level}</span>
        </div>
      </div>

      {/* XP Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Experience</span>
          <span className="font-semibold">{player.xp} / {player.xpToNext} XP</span>
        </div>
        <Progress value={xpPercentage} className="h-3 progress-glow" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-lg text-center">
          <Coins className="w-6 h-6 text-secondary mx-auto mb-2" />
          <div className="text-2xl font-bold text-secondary">{player.gold}</div>
          <div className="text-xs text-muted-foreground">Gold</div>
        </div>

        <div className="glass-card p-4 rounded-lg text-center">
          <Flame className="w-6 h-6 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold">{player.streak}</div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </div>

        <div className="glass-card p-4 rounded-lg text-center col-span-2">
          <Star className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">{player.stats.questsCompleted}</div>
          <div className="text-xs text-muted-foreground">Quests Completed</div>
        </div>
      </div>

      {/* Skills */}
      {Object.keys(player.skills).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Skills</h3>
          {Object.entries(player.skills).map(([skill, level]) => (
            <div key={skill} className="flex items-center justify-between">
              <span className="text-sm">{skill}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Lvl {level}</span>
                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${Math.min((level / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
