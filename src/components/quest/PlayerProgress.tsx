import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "./DashboardStats";
import { Progress } from "@/components/ui/progress";
import { Sword, Shield, Target, Zap } from "lucide-react";
import { Player, LootItem } from "@/hooks/useGameState";
import { Armory } from "./Armory";

interface PlayerProgressProps {
  player: Player;
  onEquip: (item: LootItem) => void;
  onUnequip: (item: LootItem) => void;
}

export const PlayerProgress = ({ player, onEquip, onUnequip }: PlayerProgressProps) => {
  // Calculate skill progress for visualization
  const skillProgress: Record<string, number> = {};
  Object.entries(player.skills).forEach(([skill, level]) => {
    skillProgress[skill] = Math.min((level / 10) * 100, 100);
  });

  const skillIcons: Record<string, JSX.Element> = {
    Work: <Sword className="w-4 h-4 text-primary" />,
    Health: <Shield className="w-4 h-4 text-accent" />,
    Learning: <Target className="w-4 h-4 text-insight" />,
    Social: <Zap className="w-4 h-4 text-leisure" />,
  };

  return (
    <div className="space-y-6">
      {/* Character Stats */}
      <DashboardStats player={player} />
      
      {/* Skills Mastery */}
      {Object.keys(player.skills).length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl">Skills Mastery</CardTitle>
            <CardDescription>Your progress in different life areas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(skillProgress).map(([skill, progress]) => (
              <div key={skill} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {skillIcons[skill] || <Target className="w-4 h-4 text-primary" />}
                    <span className="text-sm font-medium capitalize">{skill}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Level {player.skills[skill]}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Inventory */}
      <Armory 
        inventory={player.inventory}
        onEquip={onEquip}
        onUnequip={onUnequip}
      />
    </div>
  );
};