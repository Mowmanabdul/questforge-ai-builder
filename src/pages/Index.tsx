import { OracleMessage } from "@/components/quest/OracleMessage";
import { EnhancedQuestList } from "@/components/quest/EnhancedQuestList";
import { EnhancedAddQuestForm } from "@/components/quest/EnhancedAddQuestForm";
import { Dashboard } from "@/components/quest/Dashboard";
import { PlayerProgress } from "@/components/quest/PlayerProgress";
import { ImprovedAnalytics } from "@/components/quest/ImprovedAnalytics";
import { AchievementsGallery } from "@/components/quest/achievements/AchievementsGallery";
import { DailyWisdom } from "@/components/quest/motivation/DailyWisdom";
import { ImprovedRewards } from "@/components/quest/ImprovedRewards";
import { KeyboardShortcuts } from "@/components/quest/KeyboardShortcuts";
import { Settings } from "@/components/quest/Settings";
import { useGameState } from "@/hooks/useGameState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Home, Target, TrendingUp, Settings as SettingsIcon, Sparkles, BarChart3 } from "lucide-react";
import { useState } from "react";
import { exportToJSON, exportToCSV } from "@/utils/dataExport";

const Index = () => {
  const { 
    player, 
    quests, 
    dailyFocus,
    oracleMessage,
    addQuest,
    deleteQuest,
    completeQuest,
    equipItem,
    unequipItem,
    rushQuest,
    spendOnLeisure,
    addCustomReward,
    updateCustomReward,
    deleteCustomReward,
    resetAll,
  } = useGameState();

  const [selectedQuests, setSelectedQuests] = useState<string[]>([]);

  const handleSelectQuest = (questId: string) => {
    setSelectedQuests(prev => 
      prev.includes(questId) 
        ? prev.filter(id => id !== questId)
        : [...prev, questId]
    );
  };

  const handleBulkComplete = () => {
    selectedQuests.forEach(id => completeQuest(id));
    setSelectedQuests([]);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-primary/5">
      <KeyboardShortcuts 
        onNewQuest={() => document.getElementById('questName')?.focus()}
        onExportData={() => exportToJSON(player, quests)}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header with Settings */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="flex justify-end mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="glass-card border-primary/20 hover:border-primary/40 transition-all z-50"
                >
                  <SettingsIcon className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader className="mb-6">
                  <SheetTitle className="flex items-center gap-2 text-2xl">
                    <SettingsIcon className="w-6 h-6" />
                    Settings
                  </SheetTitle>
                </SheetHeader>
                <Settings 
                  onResetData={resetAll}
                  onExportJSON={() => exportToJSON(player, quests)}
                  onExportCSV={() => exportToCSV(player, quests)}
                />
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-bold mb-3 bg-gradient-to-r from-primary via-leisure to-insight bg-clip-text text-transparent">
              QuestLog
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">Gamify your life, one quest at a time ⚔️</p>
        </header>

        {/* Oracle Message */}
        {oracleMessage && <OracleMessage message={oracleMessage} />}

        {/* Navigation Tabs */}
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 mb-8 glass-card p-1">
            <TabsTrigger 
              value="home" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="quests" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Quests</span>
            </TabsTrigger>
            <TabsTrigger 
              value="rewards" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <div className="space-y-6">
              <DailyWisdom />
              <Dashboard player={player} quests={quests} dailyFocus={dailyFocus} />
            </div>
          </TabsContent>

          <TabsContent value="quests" className="space-y-6">
            <EnhancedAddQuestForm onAddQuest={addQuest} />
            <EnhancedQuestList 
              quests={quests} 
              dailyFocus={dailyFocus}
              onCompleteQuest={completeQuest}
              onDeleteQuest={deleteQuest}
              onRushQuest={rushQuest}
              dailyRushUsed={player.dailyRushUsed}
              chronoLevel={player.homestead.find(b => b.id === 'chrono')?.level || 0}
              selectedQuests={selectedQuests}
              onSelectQuest={handleSelectQuest}
              onBulkComplete={handleBulkComplete}
            />
          </TabsContent>

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

          <TabsContent value="progress">
            <div className="space-y-6">
              <PlayerProgress player={player} onEquip={equipItem} onUnequip={unequipItem} />
              <AchievementsGallery achievements={player.achievements} />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <ImprovedAnalytics player={player} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
