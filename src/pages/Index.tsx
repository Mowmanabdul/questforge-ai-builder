import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OracleMessage } from "@/components/quest/OracleMessage";
import { EnhancedQuestList } from "@/components/quest/EnhancedQuestList";
import { EnhancedAddQuestForm } from "@/components/quest/EnhancedAddQuestForm";
import { EditQuestDialog } from "@/components/quest/EditQuestDialog";
import { CompletedQuestsArchive } from "@/components/quest/CompletedQuestsArchive";
import { AICoachChat } from "@/components/quest/AICoachChat";
import { OptimizedDashboard } from "@/components/quest/OptimizedDashboard";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { MobileBottomNav } from "@/components/quest/MobileBottomNav";
import { EnhancedAnalytics } from "@/components/quest/EnhancedAnalytics";
import { DailyWisdom } from "@/components/quest/motivation/DailyWisdom";
import { ProactiveCoach } from "@/components/quest/ProactiveCoach";
import { ImprovedRewards } from "@/components/quest/ImprovedRewards";
import { KeyboardShortcuts } from "@/components/quest/KeyboardShortcuts";
import { KeyboardShortcutsHelp } from "@/components/quest/KeyboardShortcutsHelp";
import { EmptyStateGuide } from "@/components/quest/EmptyStateGuide";
import { Settings } from "@/components/quest/Settings";
import { QuestListSkeleton } from "@/components/quest/QuestListSkeleton";
import { DashboardSkeleton } from "@/components/quest/DashboardSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useSupabaseGameState } from "@/hooks/useSupabaseGameState";
import { useLocalStorageSync } from "@/hooks/useLocalStorageSync";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Home, Target, Archive as ArchiveIcon, Sparkles, Gift, Settings as SettingsIcon, LogOut, Loader2 } from "lucide-react";
import { exportToJSON, exportToCSV } from "@/utils/dataExport";
import { Quest } from "@/hooks/useGameState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { player, quests, completedQuests, loading: dataLoading, oracleMessage, setPlayer, setQuests, loadPlayerData, loadQuests, loadCompletedQuests } = useSupabaseGameState(user?.id);
  const { syncing } = useLocalStorageSync(user?.id);
  const [selectedQuests, setSelectedQuests] = useState<string[]>([]);
  const [dailyFocus, setDailyFocus] = useState<string>("");
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [deleteConfirmQuest, setDeleteConfirmQuest] = useState<string | null>(null);
  const [aiCoachQuestContext, setAiCoachQuestContext] = useState<Quest | undefined>();
  const [activeTab, setActiveTab] = useState<string>("home");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Generate daily focus
  useEffect(() => {
    if (player && Object.keys(player.skills).length > 0) {
      const saved = localStorage.getItem('questlog_daily_focus');
      if (saved) {
        const { focus, date } = JSON.parse(saved);
        if (new Date(date).toDateString() === new Date().toDateString()) {
          setDailyFocus(focus);
          return;
        }
      }
      const categories = Object.keys(player.skills);
      const newFocus = categories[Math.floor(Math.random() * categories.length)];
      setDailyFocus(newFocus);
      localStorage.setItem('questlog_daily_focus', JSON.stringify({
        focus: newFocus,
        date: new Date().toISOString()
      }));
    }
  }, [player]);

  const handleSelectQuest = (questId: string) => {
    setSelectedQuests(prev => 
      prev.includes(questId) 
        ? prev.filter(id => id !== questId)
        : [...prev, questId]
    );
  };

  const addQuest = async (quest: Omit<Quest, 'id' | 'completed' | 'createdAt'>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.from('quests').insert({
        user_id: user.id,
        name: quest.name,
        description: quest.description,
        category: quest.category,
        xp: quest.xp,
        priority: quest.priority || 'medium',
        due_date: quest.dueDate?.toISOString(),
      }).select().single();

      if (error) throw error;
      
      await loadQuests();
      toast.success(`Quest "${quest.name}" added!`);
    } catch (error: any) {
      toast.error('Failed to add quest');
    }
  };

  const editQuest = async (questId: string, updates: Partial<Quest>) => {
    try {
      const updateData: any = {
        name: updates.name,
        description: updates.description,
        category: updates.category,
        xp: updates.xp,
        priority: updates.priority,
        due_date: updates.dueDate?.toISOString(),
      };

      // Handle due date
      if (updates.dueDate !== undefined) {
        updateData.due_date = updates.dueDate;
      }

      // Handle subtasks (store as JSON)
      if (updates.subtasks !== undefined) {
        updateData.subtasks = updates.subtasks;
      }

      const { error } = await supabase.from('quests').update(updateData).eq('id', questId);

      if (error) throw error;
      
      await loadQuests();
      toast.success('Quest updated!');
    } catch (error: any) {
      toast.error('Failed to update quest');
    }
  };

  const deleteQuest = async (questId: string) => {
    try {
      const { error } = await supabase.from('quests').delete().eq('id', questId);
      if (error) throw error;
      
      await loadQuests();
      setDeleteConfirmQuest(null);
      toast.success('Quest deleted');
    } catch (error: any) {
      toast.error('Failed to delete quest');
    }
  };

  const restoreQuest = async (questId: string) => {
    try {
      const { error } = await supabase
        .from('quests')
        .update({ completed: false, completed_at: null })
        .eq('id', questId);

      if (error) throw error;
      
      await Promise.all([loadQuests(), loadCompletedQuests()]);
      toast.success('Quest restored!');
    } catch (error: any) {
      toast.error('Failed to restore quest');
    }
  };

  const permanentDeleteQuest = async (questId: string) => {
    try {
      const { error } = await supabase.from('quests').delete().eq('id', questId);
      if (error) throw error;
      
      await loadCompletedQuests();
      toast.success('Quest permanently deleted');
    } catch (error: any) {
      toast.error('Failed to delete quest');
    }
  };

  const completeQuest = async (questId: string) => {
    if (!user || !player) return;
    
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    try {
      // Mark quest as completed
      const { error: questError } = await supabase
        .from('quests')
        .update({ completed: true, completed_at: new Date().toISOString() })
        .eq('id', questId);

      if (questError) throw questError;

      // Calculate rewards
      const goldReward = Math.floor(quest.xp / 10);
      
      // Calculate level ups
      let newXp = player.xp + quest.xp;
      let newLevel = player.level;
      let xpForNextLevel = player.level * 100;
      
      // Process level ups
      while (newXp >= xpForNextLevel) {
        newXp -= xpForNextLevel;
        newLevel++;
        xpForNextLevel = newLevel * 100;
        
        toast.success(`🎉 Level Up! You are now Level ${newLevel}!`, {
          duration: 3000,
        });
      }
      
      const newGold = player.gold + goldReward;
      const newQuestsCompleted = player.stats.questsCompleted + 1;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          level: newLevel,
          xp: newXp,
          xp_to_next: xpForNextLevel,
          gold: newGold,
          quests_completed: newQuestsCompleted,
          total_xp: player.stats.totalXp + quest.xp,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Add to history
      await supabase.from('quest_history').insert({
        user_id: user.id,
        name: quest.name,
        category: quest.category,
        xp: quest.xp,
        gold: goldReward,
      });

      // Update skill
      await supabase.from('skills').upsert({
        user_id: user.id,
        category: quest.category,
        level: (player.skills[quest.category] || 0) + 1,
      }, { onConflict: 'user_id,category' });

      await Promise.all([loadPlayerData(), loadQuests(), loadCompletedQuests()]);
      toast.success(`Quest completed! +${quest.xp} XP, +${goldReward} Gold`);
    } catch (error: any) {
      console.error('Error completing quest:', error);
      toast.error('Failed to complete quest');
    }
  };

  const handleBulkComplete = async () => {
    for (const id of selectedQuests) {
      await completeQuest(id);
    }
    setSelectedQuests([]);
  };

  const handleAskAICoach = (quest: Quest) => {
    setAiCoachQuestContext(quest);
    setActiveTab('coach');
  };

  const handleRequestAIBreakdown = (quest: Quest) => {
    setAiCoachQuestContext(quest);
    setActiveTab('coach');
  };

  const handleClearAIContext = () => {
    setAiCoachQuestContext(undefined);
  };

  const handleEditQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (quest) setEditingQuest(quest);
  };

  const handleDeleteQuest = (questId: string) => {
    setDeleteConfirmQuest(questId);
  };

  const handleRushQuest = async (questId: string) => {
    await rushQuest(questId);
  };

  const rushQuest = async (questId: string) => {
    if (!user || !player || player.dailyRushUsed) return;
    
    await completeQuest(questId);
    
    const { error } = await supabase
      .from('profiles')
      .update({ daily_rush_used: true })
      .eq('id', user.id);

    if (error) {
      toast.error('Failed to use daily rush');
      return;
    }

    await loadPlayerData();
    toast.success('Daily Rush used! Quest completed instantly!');
  };

  const equipItem = async (item: any) => {
    try {
      const { error } = await supabase
        .from('loot_items')
        .update({ equipped: true })
        .eq('id', item.id);

      if (error) throw error;
      
      await loadPlayerData();
      toast.success('Item equipped!');
    } catch (error: any) {
      toast.error('Failed to equip item');
    }
  };

  const unequipItem = async (item: any) => {
    try {
      const { error } = await supabase
        .from('loot_items')
        .update({ equipped: false })
        .eq('id', item.id);

      if (error) throw error;
      
      await loadPlayerData();
      toast.success('Item unequipped');
    } catch (error: any) {
      toast.error('Failed to unequip item');
    }
  };

  const spendOnLeisure = async (activityId: string, activityName: string, cost: number) => {
    if (!user || !player || player.gold < cost) return;

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ gold: player.gold - cost })
        .eq('id', user.id);

      if (profileError) throw profileError;

      await supabase.from('leisure_history').insert({
        user_id: user.id,
        activity_name: activityName,
        cost,
      });

      await loadPlayerData();
      toast.success(`Enjoyed ${activityName}! -${cost} Gold`);
    } catch (error: any) {
      toast.error('Failed to complete purchase');
    }
  };

  const addCustomReward = async (reward: any) => {
    if (!user) return;

    try {
      await supabase.from('custom_rewards').insert({
        user_id: user.id,
        name: reward.name,
        description: reward.description,
        cost: reward.cost,
        icon: reward.icon,
        emoji: reward.emoji,
        category: reward.category,
      });

      await loadPlayerData();
      toast.success('Custom reward added!');
    } catch (error: any) {
      toast.error('Failed to add reward');
    }
  };

  const updateCustomReward = async (id: string, updates: any) => {
    try {
      await supabase.from('custom_rewards').update(updates).eq('id', id);
      await loadPlayerData();
      toast.success('Reward updated!');
    } catch (error: any) {
      toast.error('Failed to update reward');
    }
  };

  const deleteCustomReward = async (id: string) => {
    try {
      await supabase.from('custom_rewards').delete().eq('id', id);
      await loadPlayerData();
      toast.success('Reward deleted');
    } catch (error: any) {
      toast.error('Failed to delete reward');
    }
  };

  const resetAll = async () => {
    if (!user) return;

    try {
      // Delete all user data
      await Promise.all([
        supabase.from('quests').delete().eq('user_id', user.id),
        supabase.from('quest_history').delete().eq('user_id', user.id),
        supabase.from('skills').delete().eq('user_id', user.id),
        supabase.from('loot_items').delete().eq('user_id', user.id),
        supabase.from('homestead_buildings').delete().eq('user_id', user.id),
        supabase.from('gold_transactions').delete().eq('user_id', user.id),
        supabase.from('custom_rewards').delete().eq('user_id', user.id),
        supabase.from('leisure_history').delete().eq('user_id', user.id),
        supabase.from('achievements').delete().eq('user_id', user.id),
        supabase.from('goals').delete().eq('user_id', user.id),
      ]);

      // Reset profile
      await supabase.from('profiles').update({
        level: 1,
        xp: 0,
        xp_to_next: 100,
        gold: 0,
        streak: 0,
        prestige_level: 0,
        prestige_points: 0,
        quests_completed: 0,
        total_xp: 0,
        journey_progress: 0,
        daily_rush_used: false,
        rested_xp: 0,
        longest_streak: 0,
        most_quests_in_day: 0,
        highest_level: 1,
        total_gold_earned: 0,
      }).eq('id', user.id);

      await Promise.all([loadPlayerData(), loadQuests(), loadCompletedQuests()]);
      toast.success('All data has been reset');
    } catch (error: any) {
      toast.error('Failed to reset data');
    }
  };

  if (authLoading || dataLoading || syncing || !player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">
            {syncing ? "Syncing your progress..." : "Loading your quest log..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 pb-24 md:pb-8 bg-gradient-to-br from-background via-background to-primary/5">
      <KeyboardShortcuts 
        onNewQuest={() => document.getElementById('questName')?.focus()}
        onExportData={() => exportToJSON(player, quests)}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header with Settings */}
        <header className="text-center mb-6 sm:mb-8 animate-fade-in">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div />
            <div className="flex gap-2">
              <KeyboardShortcutsHelp />
              <Button 
                variant="outline" 
                size="icon"
                onClick={signOut}
                className="glass-card border-primary/20 hover:border-destructive/40 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="glass-card border-primary/20 hover:border-primary/40 transition-all"
                  >
                    <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5" />
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
          </div>
          
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-primary via-leisure to-insight bg-clip-text text-transparent animate-fade-in">
              QuestLog
            </h1>
            {player.prestigeLevel > 0 && (
              <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-secondary to-gold rounded-full border border-secondary/50 animate-pulse">
                <span className="text-xs font-bold text-secondary-foreground">
                  Prestige {player.prestigeLevel}
                </span>
              </div>
            )}
          </div>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Gamify your life, one quest at a time ⚔️
          </p>
        </header>

        {/* Oracle Message */}
        {oracleMessage && <OracleMessage message={oracleMessage} />}
        
        {/* Proactive AI Coach */}
        <ProactiveCoach 
          player={player} 
          activeQuests={quests}
          onNavigateToCoach={() => setActiveTab('coach')}
        />

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop Navigation - Hidden on mobile */}
          <TabsList className="hidden md:grid w-full max-w-4xl mx-auto grid-cols-5 mb-8 glass-card p-1 gap-1">
            <TabsTrigger 
              value="home" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:bg-primary/10"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="quests" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:bg-primary/10"
            >
              <Target className="w-4 h-4" />
              <span>Quests</span>
            </TabsTrigger>
            <TabsTrigger 
              value="archive" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:bg-primary/10"
            >
              <ArchiveIcon className="w-4 h-4" />
              <span>Archive</span>
            </TabsTrigger>
            <TabsTrigger 
              value="coach" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:bg-primary/10"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Coach</span>
            </TabsTrigger>
            <TabsTrigger 
              value="rewards" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:bg-primary/10"
            >
              <Gift className="w-4 h-4" />
              <span>Rewards</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            {dataLoading ? (
              <DashboardSkeleton />
            ) : (
              <div className="space-y-6">
                <DailyWisdom />
                <OptimizedDashboard 
                  player={player} 
                  quests={quests}
                  dailyFocus={dailyFocus}
                />
                <EnhancedAnalytics player={player} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="quests" className="space-y-6">
            {quests.length === 0 && !dataLoading ? (
              <EmptyStateGuide onGetStarted={() => document.getElementById('questName')?.focus()} />
            ) : null}
            <EnhancedAddQuestForm onAddQuest={addQuest} />
            {dataLoading ? (
              <QuestListSkeleton />
            ) : (
              <EnhancedQuestList 
                quests={quests} 
                dailyFocus={dailyFocus}
                onCompleteQuest={completeQuest}
                onDeleteQuest={handleDeleteQuest}
                onEditQuest={handleEditQuest}
                onAskAICoach={handleAskAICoach}
                onRushQuest={handleRushQuest}
                dailyRushUsed={player.dailyRushUsed}
                chronoLevel={player.homestead.find(b => b.id === 'chrono')?.level || 0}
                selectedQuests={selectedQuests}
                onSelectQuest={handleSelectQuest}
                onBulkComplete={handleBulkComplete}
              />
            )}
          </TabsContent>

          <TabsContent value="archive">
            {dataLoading ? (
              <QuestListSkeleton />
            ) : (
              <CompletedQuestsArchive
                quests={completedQuests}
                onRestore={restoreQuest}
                onPermanentDelete={permanentDeleteQuest}
              />
            )}
          </TabsContent>

          <TabsContent value="coach">
            <AICoachChat 
              player={player} 
              activeQuests={quests}
              questContext={aiCoachQuestContext}
              onAddQuest={addQuest}
              onClearContext={handleClearAIContext}
              onUpdateQuest={editQuest}
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
        </Tabs>

        {/* Mobile Bottom Navigation - Fixed at bottom */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
          <div className="glass-card border-t border-primary/20 px-2 py-3">
            <div className="flex justify-around items-center max-w-lg mx-auto">
              <button
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'home' 
                    ? 'bg-primary text-primary-foreground scale-110' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-xs font-medium">Home</span>
              </button>
              <button
                onClick={() => setActiveTab('quests')}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'quests' 
                    ? 'bg-primary text-primary-foreground scale-110' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Target className="w-5 h-5" />
                <span className="text-xs font-medium">Quests</span>
              </button>
              <button
                onClick={() => setActiveTab('archive')}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'archive' 
                    ? 'bg-primary text-primary-foreground scale-110' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <ArchiveIcon className="w-5 h-5" />
                <span className="text-xs font-medium">Archive</span>
              </button>
              <button
                onClick={() => setActiveTab('coach')}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'coach' 
                    ? 'bg-primary text-primary-foreground scale-110' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-medium">Coach</span>
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'rewards' 
                    ? 'bg-primary text-primary-foreground scale-110' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Gift className="w-5 h-5" />
                <span className="text-xs font-medium">Rewards</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Edit Quest Dialog */}
        {editingQuest && (
          <EditQuestDialog
            quest={editingQuest}
            open={!!editingQuest}
            onOpenChange={(open) => !open && setEditingQuest(null)}
            onSave={editQuest}
            categories={Array.from(new Set(quests.map(q => q.category)))}
            onRequestAIBreakdown={handleRequestAIBreakdown}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteConfirmQuest} onOpenChange={(open) => !open && setDeleteConfirmQuest(null)}>
          <AlertDialogContent className="glass-card">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl flex items-center gap-2">
                <div className="p-2 rounded-full bg-destructive/10">
                  <Target className="w-5 h-5 text-destructive" />
                </div>
                Delete Quest?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                This will permanently delete the quest. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:bg-muted">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteConfirmQuest && deleteQuest(deleteConfirmQuest)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Quest
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Index;
