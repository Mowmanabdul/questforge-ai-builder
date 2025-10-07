import { DashboardStats } from "@/components/quest/DashboardStats";
import { OracleMessage } from "@/components/quest/OracleMessage";
import { QuestList } from "@/components/quest/QuestList";
import { AddQuestForm } from "@/components/quest/AddQuestForm";
import { JourneyMap } from "@/components/quest/JourneyMap";
import { Armory } from "@/components/quest/Armory";
import { Analytics } from "@/components/quest/Analytics";
import { Homestead } from "@/components/quest/Homestead";
import { AISage } from "@/components/quest/AISage";
import { useGameState } from "@/hooks/useGameState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, BarChart3, Home } from "lucide-react";

const Index = () => {
  const { 
    player, 
    quests, 
    dailyFocus,
    oracleMessage,
    addQuest, 
    completeQuest,
    equipItem,
    unequipItem,
    upgradeBuilding,
    rushQuest,
  } = useGameState();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-float">
            QuestLog RPG
          </h1>
          <p className="text-muted-foreground">Transform your tasks into epic quests</p>
        </header>

        {/* Oracle Message */}
        {oracleMessage && (
          <OracleMessage message={oracleMessage} />
        )}

        {/* Navigation Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="homestead" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Homestead
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Dashboard View */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Player Stats & Journey */}
              <div className="space-y-6">
                <DashboardStats player={player} />
                <JourneyMap player={player} />
                <Armory 
                  inventory={player.inventory} 
                  onEquip={equipItem}
                  onUnequip={unequipItem}
                />
              </div>

              {/* Middle Column - Quests */}
              <div className="lg:col-span-2 space-y-6">
                <AISage player={player} quests={quests} />
                <AddQuestForm onAddQuest={addQuest} />
                <QuestList 
                  quests={quests} 
                  dailyFocus={dailyFocus}
                  onCompleteQuest={completeQuest}
                  onRushQuest={rushQuest}
                  dailyRushUsed={player.dailyRushUsed}
                  chronoLevel={player.homestead.find(b => b.id === 'chrono')?.level || 0}
                />
              </div>
            </div>
          </TabsContent>

          {/* Homestead View */}
          <TabsContent value="homestead">
            <Homestead 
              homestead={player.homestead}
              gold={player.gold}
              onUpgrade={upgradeBuilding}
            />
          </TabsContent>

          {/* Analytics View */}
          <TabsContent value="analytics">
            <Analytics player={player} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
