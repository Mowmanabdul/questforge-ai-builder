import { DashboardStats } from "./DashboardStats";
import { JourneyMap } from "./JourneyMap";
import { Armory } from "./Armory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Player, LootItem } from "@/hooks/useGameState";

interface PlayerProgressProps {
  player: Player;
  onEquip: (item: LootItem) => void;
  onUnequip: (item: LootItem) => void;
}

export const PlayerProgress = ({ player, onEquip, onUnequip }: PlayerProgressProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Stats */}
        <div className="space-y-6">
          <DashboardStats player={player} />
          <JourneyMap player={player} />
        </div>

        {/* Middle & Right - Skills & Inventory */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills Breakdown */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl">⚔️ Skills Mastery</CardTitle>
              <CardDescription>Your expertise across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(player.skills).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(player.skills)
                    .sort(([, a], [, b]) => b - a)
                    .map(([skill, level]) => {
                      const maxLevel = Math.max(...Object.values(player.skills));
                      const percentage = (level / maxLevel) * 100;
                      
                      return (
                        <div key={skill} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{skill}</Badge>
                            </div>
                            <span className="text-sm font-semibold">Level {level}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Complete quests to build your skills!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Armory */}
          <Armory 
            inventory={player.inventory}
            onEquip={onEquip}
            onUnequip={onUnequip}
          />
        </div>
      </div>
    </div>
  );
};
