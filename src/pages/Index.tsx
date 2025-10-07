import { OracleMessage } from "@/components/quest/OracleMessage";
import { QuestList } from "@/components/quest/QuestList";
import { AddQuestForm } from "@/components/quest/AddQuestForm";
import { Dashboard } from "@/components/quest/Dashboard";
import { ImprovedRewards } from "@/components/quest/ImprovedRewards";
import { PlayerProgress } from "@/components/quest/PlayerProgress";
import { ImprovedAnalytics } from "@/components/quest/ImprovedAnalytics";
import { WeeklyInsights } from "@/components/quest/WeeklyInsights";
import { useGameState } from "@/hooks/useGameState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Target, Gift, TrendingUp, Brain } from "lucide-react";

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
    addCustomReward,
    updateCustomReward,
    deleteCustomReward,
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
          <TabsList className="grid w-full max-w-5xl mx-auto grid-cols-5 mb-6 glass-card">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="quests" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Quests</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <Dashboard 
              player={player}
              quests={quests}
              dailyFocus={dailyFocus}
            />
          </TabsContent>

          {/* Quests Tab */}
          <TabsContent value="quests" className="space-y-6">
            <AddQuestForm onAddQuest={addQuest} />
            <QuestList 
              quests={quests} 
              dailyFocus={dailyFocus}
              onCompleteQuest={completeQuest}
              onRushQuest={rushQuest}
              dailyRushUsed={player.dailyRushUsed}
              chronoLevel={player.homestead.find(b => b.id === 'chrono')?.level || 0}
            />
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards">
            <ImprovedRewards
              gold={player.gold}
              leisureHistory={player.leisureHistory}
              customRewards={player.customRewards}
              onSpendGold={spendOnLeisure}
              onAddReward={addCustomReward}
              onUpdateReward={updateCustomReward}
              onDeleteReward={deleteCustomReward}
            />
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <PlayerProgress
              player={player}
              onEquip={equipItem}
              onUnequip={unequipItem}
            />
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Tabs defaultValue="coach" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
                <TabsTrigger value="coach">AI Coach</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="coach">
                <WeeklyInsights player={player} quests={quests} />
              </TabsContent>
              <TabsContent value="analytics">
                <ImprovedAnalytics player={player} />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
