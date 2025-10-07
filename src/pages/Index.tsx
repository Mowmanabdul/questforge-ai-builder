import { OracleMessage } from "@/components/quest/OracleMessage";
import { EnhancedQuestList } from "@/components/quest/EnhancedQuestList";
import { EnhancedAddQuestForm } from "@/components/quest/EnhancedAddQuestForm";
import { Dashboard } from "@/components/quest/Dashboard";
import { ImprovedRewards } from "@/components/quest/ImprovedRewards";
import { PlayerProgress } from "@/components/quest/PlayerProgress";
import { ImprovedAnalytics } from "@/components/quest/ImprovedAnalytics";
import { WeeklyInsights } from "@/components/quest/WeeklyInsights";
import { AchievementsGallery } from "@/components/quest/achievements/AchievementsGallery";
import { GoalsTracker } from "@/components/quest/goals/GoalsTracker";
import { QuestTemplates } from "@/components/quest/templates/QuestTemplates";
import { DailyChallenges } from "@/components/quest/challenges/DailyChallenges";
import { PersonalRecords } from "@/components/quest/PersonalRecords";
import { DailyWisdom } from "@/components/quest/motivation/DailyWisdom";
import { KeyboardShortcuts } from "@/components/quest/KeyboardShortcuts";
import { useGameState } from "@/hooks/useGameState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Target, Gift, TrendingUp, Brain, Trophy, Sparkles } from "lucide-react";
import { useState } from "react";
import { exportToJSON, exportToCSV } from "@/utils/dataExport";

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

  const handleExportJSON = () => {
    exportToJSON(player, quests);
  };

  const handleExportCSV = () => {
    exportToCSV(player, quests);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <KeyboardShortcuts 
        onNewQuest={() => document.getElementById('questName')?.focus()}
        onExportData={handleExportJSON}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-primary via-leisure to-insight bg-clip-text text-transparent">
            QuestLog
          </h1>
          <p className="text-lg text-muted-foreground">Gamify your life, one quest at a time</p>
        </header>

        {/* Daily Wisdom */}
        <div className="mb-6">
          <DailyWisdom />
        </div>

        {/* Oracle Message */}
        {oracleMessage && <OracleMessage message={oracleMessage} />}

        {/* Navigation Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full max-w-6xl mx-auto grid-cols-3 lg:grid-cols-6 mb-6 glass-card">
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
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="space-y-6">
              <Dashboard player={player} quests={quests} dailyFocus={dailyFocus} />
              <PersonalRecords records={player.personalRecords} />
            </div>
          </TabsContent>

          <TabsContent value="quests">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="active">Active Quests</TabsTrigger>
                <TabsTrigger value="templates">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Templates
                </TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="space-y-6">
                <EnhancedAddQuestForm onAddQuest={addQuest} />
                <EnhancedQuestList 
                  quests={quests} 
                  dailyFocus={dailyFocus}
                  onCompleteQuest={completeQuest}
                  onRushQuest={rushQuest}
                  dailyRushUsed={player.dailyRushUsed}
                  chronoLevel={player.homestead.find(b => b.id === 'chrono')?.level || 0}
                  selectedQuests={selectedQuests}
                  onSelectQuest={handleSelectQuest}
                  onBulkComplete={handleBulkComplete}
                />
              </TabsContent>
              <TabsContent value="templates">
                <QuestTemplates onUseTemplate={addQuest} />
              </TabsContent>
            </Tabs>
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
              <GoalsTracker 
                goals={player.goals} 
                onAddGoal={() => {}} 
                onDeleteGoal={() => {}}
              />
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsGallery achievements={player.achievements} />
          </TabsContent>

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
