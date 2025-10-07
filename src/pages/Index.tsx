import { OracleMessage } from "@/components/quest/OracleMessage";
import { EnhancedQuestList } from "@/components/quest/EnhancedQuestList";
import { EnhancedAddQuestForm } from "@/components/quest/EnhancedAddQuestForm";
import { Dashboard } from "@/components/quest/Dashboard";
import { PlayerProgress } from "@/components/quest/PlayerProgress";
import { ImprovedAnalytics } from "@/components/quest/ImprovedAnalytics";
import { AchievementsGallery } from "@/components/quest/achievements/AchievementsGallery";
import { GoalsTracker } from "@/components/quest/goals/GoalsTracker";
import { QuestTemplates } from "@/components/quest/templates/QuestTemplates";
import { DailyChallenges } from "@/components/quest/challenges/DailyChallenges";
import { PersonalRecords } from "@/components/quest/PersonalRecords";
import { DailyWisdom } from "@/components/quest/motivation/DailyWisdom";
import { KeyboardShortcuts } from "@/components/quest/KeyboardShortcuts";
import { Settings } from "@/components/quest/Settings";
import { useGameState } from "@/hooks/useGameState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Home, Target, TrendingUp, Brain, Settings as SettingsIcon, Sparkles } from "lucide-react";
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
    rushQuest,
    resetAll,
  } = useGameState();

  const [selectedQuests, setSelectedQuests] = useState<string[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);

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
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <KeyboardShortcuts 
        onNewQuest={() => document.getElementById('questName')?.focus()}
        onExportData={() => exportToJSON(player, quests)}
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
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4 lg:grid-cols-5 mb-6 glass-card">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="quests" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Quests</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <div className="space-y-6">
              <Dashboard player={player} quests={quests} dailyFocus={dailyFocus} />
              <DailyChallenges challenges={[]} onClaim={() => {}} />
              <PersonalRecords records={player.personalRecords} />
            </div>
          </TabsContent>

          <TabsContent value="quests" className="space-y-6">
            <div className="flex justify-end mb-4">
              <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Quest Templates
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Quest Templates</DialogTitle>
                  </DialogHeader>
                  <QuestTemplates onUseTemplate={(quest) => {
                    addQuest(quest);
                    setShowTemplates(false);
                  }} />
                </DialogContent>
              </Dialog>
            </div>
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

          <TabsContent value="progress">
            <div className="space-y-6">
              <PlayerProgress player={player} onEquip={equipItem} onUnequip={unequipItem} />
              <AchievementsGallery achievements={player.achievements} />
              <GoalsTracker 
                goals={player.goals} 
                onAddGoal={() => {}} 
                onDeleteGoal={() => {}}
              />
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <div className="space-y-6">
              <ImprovedAnalytics player={player} />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Settings 
              onResetData={resetAll}
              onExportJSON={() => exportToJSON(player, quests)}
              onExportCSV={() => exportToCSV(player, quests)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
