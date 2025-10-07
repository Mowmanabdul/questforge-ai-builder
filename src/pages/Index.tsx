import { DashboardStats } from "@/components/quest/DashboardStats";
import { OracleMessage } from "@/components/quest/OracleMessage";
import { QuestList } from "@/components/quest/QuestList";
import { AddQuestForm } from "@/components/quest/AddQuestForm";
import { JourneyMap } from "@/components/quest/JourneyMap";
import { Armory } from "@/components/quest/Armory";
import { AnalyticsCharts } from "@/components/quest/AnalyticsCharts";
import { LeisureRewards } from "@/components/quest/LeisureRewards";
import { WeeklyInsights } from "@/components/quest/WeeklyInsights";
import { useGameState } from "@/hooks/useGameState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, BarChart3, Sparkles } from "lucide-react";

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
    spendOnLeisure,
    upgradeBuilding,
    rushQuest,
  } = useGameState();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-primary via-leisure to-insight bg-clip-text text-transparent">
            QuestLog
          </h1>
          <p className="text-lg text-muted-foreground">Gamify your life, one quest at a time</p>
        </header>

        {/* Oracle Message */}
        {oracleMessage && (
          <OracleMessage message={oracleMessage} />
        )}

        {/* Navigation Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 mb-6 glass-card">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="leisure" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Leisure</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard View */}
          <TabsContent value="dashboard" className="space-y-6">
            <WeeklyInsights player={player} quests={quests} />
            
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

              {/* Right Column - Quests */}
              <div className="lg:col-span-2 space-y-6">
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

          {/* Leisure & Rewards View */}
          <TabsContent value="leisure">
            <LeisureRewards
              gold={player.gold}
              leisureHistory={player.leisureHistory}
              onSpendGold={spendOnLeisure}
            />
          </TabsContent>

          {/* Analytics View */}
          <TabsContent value="analytics">
            <AnalyticsCharts player={player} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
