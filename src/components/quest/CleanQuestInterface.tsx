import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle2, 
  Flame, 
  Search, 
  Calendar,
  Plus,
  Target,
  Trophy,
  Filter,
  Star,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Quest } from "@/hooks/useGameState";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CleanQuestInterfaceProps {
  quests: Quest[];
  dailyFocus: string;
  onCompleteQuest: (id: string) => void;
  onAddQuest?: (quest: any) => void;
}

const CleanQuestCard = ({ quest, dailyFocus, onComplete }: any) => {
  const isFocused = quest.category === dailyFocus;
  
  const getDueDateInfo = () => {
    if (!quest.dueDate) return null;
    const date = new Date(quest.dueDate);
    
    if (isPast(date) && !isToday(date)) {
      return { status: 'overdue', label: 'Overdue', color: 'text-red-500' };
    }
    if (isToday(date)) {
      return { status: 'today', label: 'Today', color: 'text-primary' };
    }
    if (isTomorrow(date)) {
      return { status: 'tomorrow', label: 'Tomorrow', color: 'text-amber-500' };
    }
    return { status: 'future', label: format(date, 'MMM d'), color: 'text-muted-foreground' };
  };
  
  const dueDateInfo = getDueDateInfo();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition-all duration-300",
        "bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-sm",
        "hover:from-card/90 hover:via-card/70 hover:to-card/50",
        "hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1",
        "border-border/30",
        isFocused && "border-primary/60 from-primary/15 via-card/70 to-accent/15 shadow-xl shadow-primary/25 ring-1 ring-primary/20"
      )}
    >
      {/* Priority indicator - left border accent */}
      <div className={cn(
        "absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl",
        quest.priority === 'high' && "bg-gradient-to-b from-destructive via-destructive/80 to-destructive/50",
        quest.priority === 'medium' && "bg-gradient-to-b from-amber-500 via-amber-500/80 to-amber-500/50",
        quest.priority === 'low' && "bg-gradient-to-b from-blue-500 via-blue-500/80 to-blue-500/50"
      )} />
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>
      
      {/* Focus glow */}
      {isFocused && (
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-sm -z-10" />
      )}
      
      <div className="relative p-4 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {isFocused && (
                <div className="p-1 rounded-lg bg-primary/20">
                  <Flame className="icon-sm text-primary" />
                </div>
              )}
              <h3 className="font-bold text-base text-foreground line-clamp-2 leading-tight">
                {quest.name}
              </h3>
            </div>
            
            {quest.description && (
              <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                {quest.description}
              </p>
            )}
          </div>
          
          {/* XP Badge - premium look */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-br from-primary/15 via-primary/10 to-accent/15 border border-primary/30 shadow-lg">
              <Star className="icon-sm text-primary fill-primary/20" />
              <span className="text-sm font-bold text-primary">{quest.xp}</span>
            </div>
            {isFocused && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/20 border border-accent/30">
                <Flame className="w-3 h-3 text-accent" />
                <span className="text-xs text-accent font-bold">+25%</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Meta info - enhanced layout */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge 
              variant="outline" 
              className="text-xs font-medium bg-gradient-to-r from-muted/30 to-muted/20 border-muted-foreground/30 hover:border-muted-foreground/50 transition-colors"
            >
              {quest.category}
            </Badge>
            
            {dueDateInfo && (
              <Badge variant="outline" className={cn(
                "text-xs font-medium border-current/40 hover:border-current/60 transition-colors",
                dueDateInfo.color,
                dueDateInfo.status === 'overdue' && "bg-red-500/10",
                dueDateInfo.status === 'today' && "bg-primary/10",
                dueDateInfo.status === 'tomorrow' && "bg-amber-500/10"
              )}>
                <Calendar className="icon-sm mr-1" />
                {dueDateInfo.label}
              </Badge>
            )}
          </div>
          
          {/* Complete button - enhanced */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onComplete(quest.id);
            }}
            size="sm"
            className="shrink-0 bg-accent/80 hover:bg-accent text-accent-foreground border border-accent/30 hover:border-accent/50 shadow-sm hover:shadow-md transition-all"
          >
            <CheckCircle2 className="icon-sm mr-1.5" />
            Complete
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export const CleanQuestInterface = ({ 
  quests, 
  dailyFocus, 
  onCompleteQuest,
  onAddQuest
}: CleanQuestInterfaceProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredQuests = quests.filter(quest => {
    if (!searchQuery) return true;
    return quest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           quest.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           quest.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Sort quests: daily focus first, then by priority
  const sortedQuests = filteredQuests.sort((a, b) => {
    if (a.category === dailyFocus && b.category !== dailyFocus) return -1;
    if (b.category === dailyFocus && a.category !== dailyFocus) return 1;
    
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
           (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
  });

  const highPriorityCount = quests.filter(q => q.priority === 'high').length;
  const dueSoonCount = quests.filter(q => 
    q.dueDate && new Date(q.dueDate) <= new Date(Date.now() + 24*60*60*1000)
  ).length;
  const totalXP = quests.reduce((sum, q) => sum + q.xp, 0);
  const focusCount = quests.filter(q => q.category === dailyFocus && !q.completed).length;

  return (
    <div className="space-y-6">
      {/* Clean Header */}
      <div className="space-y-6">
        {/* Search - Top priority */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 icon-sm text-muted-foreground" />
          <Input
            placeholder="Search quests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 glass-card border-border/60 focus-visible:border-primary/50 bg-transparent text-base"
          />
        </div>

        {/* Simple Stats Bar - Always Visible */}
        <div className="glass-card border-border/40 rounded-xl p-3">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="font-semibold">{highPriorityCount}</span>
              <span className="text-muted-foreground text-xs">High Priority</span>
            </div>
            <div className="h-4 w-px bg-border/40" />
            <div className="flex items-center gap-1.5 text-sm">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">{dueSoonCount}</span>
              <span className="text-muted-foreground text-xs">Due Soon</span>
            </div>
            <div className="h-4 w-px bg-border/40" />
            <div className="flex items-center gap-1.5 text-sm">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="font-semibold">{totalXP}</span>
              <span className="text-muted-foreground text-xs">Total XP</span>
            </div>
            {dailyFocus && (
              <>
                <div className="h-4 w-px bg-border/40" />
                <div className="flex items-center gap-1.5 text-sm">
                  <Flame className="w-4 h-4 text-accent" />
                  <span className="font-semibold">{focusCount}</span>
                  <span className="text-muted-foreground text-xs">{dailyFocus}</span>
                  <Badge variant="outline" className="bg-accent/20 border-accent/40 text-accent text-[10px] font-bold ml-1">
                    +25%
                  </Badge>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quest count header with Add button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Active Quests
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredQuests.length} quest{filteredQuests.length !== 1 ? 's' : ''} ready to conquer
            </p>
          </div>
          {onAddQuest && (
            <Button
              onClick={onAddQuest}
              size="sm"
              className="bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Quest
            </Button>
          )}
        </div>
      </div>

      {/* Quest List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {sortedQuests.map((quest) => (
            <CleanQuestCard
              key={quest.id}
              quest={quest}
              dailyFocus={dailyFocus}
              onComplete={onCompleteQuest}
            />
          ))}
        </AnimatePresence>
      </div>

      {sortedQuests.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 border border-primary/30">
            <Target className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">No quests found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {searchQuery ? 'Try adjusting your search terms or clearing filters' : 'Start your adventure by creating your first quest!'}
          </p>
          {onAddQuest && !searchQuery && (
            <Button onClick={onAddQuest} variant="gradient" size="lg">
              <Plus className="icon-sm mr-2" />
              Create Your First Quest
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
};
