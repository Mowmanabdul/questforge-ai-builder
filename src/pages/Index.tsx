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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
    <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-primary/5">
      <KeyboardShortcuts 
        onNewQuest={() => document.getElementById('questName')?.focus()}
        onExportData={() => exportToJSON(player, quests)}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header with Settings */}
        <header className="relative text-center mb-8 animate-fade-in">
          <div className="absolute top-0 right-0">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="glass-card border-primary/20 hover:border-primary/40 hover:scale-110 transition-all"
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
            <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-primary via-leisure to-insight animate-pulse" />
            <h1 className="relative text-5xl md:text-7xl font-bold mb-3 bg-gradient-to-r from-primary via-leisure to-insight bg-clip-text text-transparent animate-fade-in drop-shadow-2xl">
              QuestLog
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground font-medium">Gamify your life, one quest at a time ⚔️</p>
        </header>

        {/* Daily Wisdom */}
        <div className="mb-6">
          <DailyWisdom />
        </div>

        {/* Oracle Message */}
        {oracleMessage && <OracleMessage message={oracleMessage} />}

        {/* Navigation Tabs */}
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8 glass-card border border-primary/10 shadow-lg p-1.5">
            <TabsTrigger 
              value="home" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground transition-all"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="quests" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-leisure data-[state=active]:to-leisure/80 data-[state=active]:text-primary-foreground transition-all"
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">Quests</span>
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-insight data-[state=active]:to-insight/80 data-[state=active]:text-primary-foreground transition-all"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">Progress</span>
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-gold data-[state=active]:to-gold/80 data-[state=active]:text-primary-foreground transition-all"
            >
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="animate-fade-in">
            <div className="space-y-6">
              <Dashboard player={player} quests={quests} dailyFocus={dailyFocus} />
              <DailyChallenges challenges={[]} onClaim={() => {}} />
              <PersonalRecords records={player.personalRecords} />
            </div>
          </TabsContent>

          <TabsContent value="quests" className="space-y-6 animate-fade-in">
            <div className="flex justify-end mb-4">
              <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="gap-2 glass-card border-leisure/30 hover:border-leisure/60 hover:bg-leisure/10 transition-all hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4 text-leisure" />
                    Quest Templates
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto glass-card">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Quest Templates</DialogTitle>
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

          <TabsContent value="progress" className="animate-fade-in">
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

          <TabsContent value="insights" className="animate-fade-in">
            <div className="space-y-6">
              <ImprovedAnalytics player={player} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
