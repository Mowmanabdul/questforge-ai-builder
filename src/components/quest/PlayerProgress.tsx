import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "./DashboardStats";
import { JourneyMap } from "./JourneyMap";
import { Armory } from "./Armory";
import { Progress } from "@/components/ui/progress";
import { Sword, Shield, Zap, Target, User, Backpack } from "lucide-react";
import { Player, LootItem } from "@/hooks/useGameState";

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
    work: <Sword className="w-4 h-4 text-primary" />,
    health: <Shield className="w-4 h-4 text-accent" />,
    learning: <Target className="w-4 h-4 text-insight" />,
    social: <Zap className="w-4 h-4 text-leisure" />,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl">Character Progress</CardTitle>
          <CardDescription>View your stats, journey, and equipment</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="journey" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Journey</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Backpack className="w-4 h-4" />
                <span className="hidden sm:inline">Inventory</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <DashboardStats player={player} />
              
              {/* Skills Mastery */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xl">Skills Mastery</CardTitle>
                  <CardDescription>Your progress in different areas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(skillProgress).map(([skill, progress]) => (
                    <div key={skill} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {skillIcons[skill]}
                          <span className="text-sm font-medium capitalize">{skill}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="journey">
              <JourneyMap player={player} />
            </TabsContent>

            <TabsContent value="inventory">
              <Armory 
                inventory={player.inventory}
                onEquip={onEquip}
                onUnequip={onUnequip}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
