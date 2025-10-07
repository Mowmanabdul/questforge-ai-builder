import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HomesteadBuilding } from "@/hooks/useGameState";
import { FlaskConical, Clock, Flower2, Users, Coins } from "lucide-react";

interface HomesteadProps {
  homestead: HomesteadBuilding[];
  gold: number;
  onUpgrade: (buildingId: string) => void;
}

const iconMap: Record<string, any> = {
  'flask-conical': FlaskConical,
  'clock': Clock,
  'flower-2': Flower2,
  'users': Users,
};

const bonusDescriptions: Record<string, (level: number) => string> = {
  'critical_chance': (level) => `${(level * 5).toFixed(0)}% Critical Success Chance`,
  'daily_rush': (level) => level > 0 ? 'Rush 1 Quest Daily (50% XP)' : 'Not Built',
  'rested_xp': (level) => `+${level * 20} Rested XP Daily`,
  'better_bounties': (level) => level > 0 ? `Unlocks Tier ${level} Bounties` : 'Not Built',
};

export const Homestead = ({ homestead, gold, onUpgrade }: HomesteadProps) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">🏰 The Hero's Homestead</CardTitle>
            <CardDescription>Build and upgrade structures for permanent bonuses</CardDescription>
          </div>
          <div className="flex items-center gap-2 text-lg font-semibold text-primary">
            <Coins className="w-5 h-5" />
            {gold}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {homestead.map((building) => {
            const Icon = iconMap[building.icon];
            const upgradeCost = Math.floor(building.baseCost * Math.pow(1.5, building.level));
            const canAfford = gold >= upgradeCost;
            const bonusDesc = bonusDescriptions[building.bonusType](building.level);

            return (
              <Card key={building.id} className="border-2 border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{building.name}</CardTitle>
                        <CardDescription className="text-xs">{building.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Lv {building.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-md bg-muted/50">
                    <p className="text-sm font-medium text-foreground">{bonusDesc}</p>
                  </div>
                  <Button
                    onClick={() => onUpgrade(building.id)}
                    disabled={!canAfford}
                    className="w-full"
                    variant={canAfford ? "default" : "outline"}
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Upgrade ({upgradeCost} Gold)
                  </Button>
                  {!canAfford && (
                    <p className="text-xs text-muted-foreground text-center">
                      Need {upgradeCost - gold} more gold
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
