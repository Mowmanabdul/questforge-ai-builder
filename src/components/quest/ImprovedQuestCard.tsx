import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Edit2, Trash2, MessageCircle, Zap, Flame, Clock, Calendar } from "lucide-react";
import { Quest } from "@/hooks/useGameState";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { cn } from "@/lib/utils";

interface ImprovedQuestCardProps {
  quest: Quest;
  dailyFocus: string;
  isSelected: boolean;
  dailyRushUsed: boolean;
  chronoLevel: number;
  onComplete: () => void;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAskAI?: () => void;
  onRush?: () => void;
}

const getPriorityConfig = (priority?: string) => {
  switch (priority) {
    case 'high': return { 
      color: 'border-destructive text-destructive bg-destructive/5', 
      indicator: 'bg-destructive',
      glow: 'shadow-destructive/20'
    };
    case 'medium': return { 
      color: 'border-primary text-primary bg-primary/5', 
      indicator: 'bg-primary',
      glow: 'shadow-primary/20'
    };
    case 'low': return { 
      color: 'border-muted-foreground text-muted-foreground bg-muted/5', 
      indicator: 'bg-muted-foreground',
      glow: 'shadow-muted/20'
    };
    default: return { 
      color: '', 
      indicator: 'bg-border',
      glow: ''
    };
  }
};

const getDueDateStatus = (dueDate?: Date) => {
  if (!dueDate) return { status: 'none', label: '', color: '' };
  
  const date = new Date(dueDate);
  
  if (isPast(date) && !isToday(date)) {
    return { status: 'overdue', label: 'Overdue', color: 'text-destructive bg-destructive/10 border-destructive/20' };
  }
  
  if (isToday(date)) {
    return { status: 'today', label: 'Due Today', color: 'text-primary bg-primary/10 border-primary/20' };
  }
  
  if (isTomorrow(date)) {
    return { status: 'tomorrow', label: 'Due Tomorrow', color: 'text-accent bg-accent/10 border-accent/20' };
  }
  
  return { status: 'future', label: format(date, 'MMM d'), color: 'text-muted-foreground bg-muted/10 border-muted/20' };
};

export const ImprovedQuestCard = React.memo(({
  quest,
  dailyFocus,
  isSelected,
  dailyRushUsed,
  chronoLevel,
  onComplete,
  onSelect,
  onEdit,
  onDelete,
  onAskAI,
  onRush,
}: ImprovedQuestCardProps) => {
  const isFocusedQuest = quest.category === dailyFocus;
  const priorityConfig = getPriorityConfig(quest.priority);
  const dueDateStatus = getDueDateStatus(quest.dueDate);
  
  // Calculate subtask progress
  const subtasks = quest.subtasks || [];
  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const subtaskProgress = subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0;
  const hasSubtasks = subtasks.length > 0;

  return (
    <div
      className={cn(
        "group relative glass-card p-4 sm:p-5 rounded-xl card-hover transition-all duration-300 overflow-hidden",
        "hover:shadow-lg hover:-translate-y-0.5",
        isFocusedQuest && "border-primary/50 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent",
        isSelected && "ring-2 ring-primary/60 scale-[1.02] shadow-lg",
        priorityConfig.glow && `hover:${priorityConfig.glow}`,
        dueDateStatus.status === 'overdue' && "border-destructive/30",
        dueDateStatus.status === 'today' && "border-primary/30"
      )}
    >
      {/* Animated background gradient for focused quests */}
      {isFocusedQuest && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 animate-pulse opacity-50" />
      )}
      
      {/* Priority indicator bar */}
      <div className={cn(
        "absolute top-0 left-0 h-1 w-full transition-all duration-500",
        priorityConfig.indicator
      )} />
      
      {/* XP indicator bar */}
      <div className="absolute top-1 right-0 h-px bg-gradient-to-l from-gold/60 via-gold/30 to-transparent transition-all duration-300 group-hover:from-gold group-hover:via-gold/60" 
           style={{ width: `${Math.min(quest.xp / 200 * 100, 100)}%` }} />
      
      <div className="relative z-10 space-y-3">
        {/* Header section */}
        <div className="flex items-start gap-3">
          {onSelect && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelect}
              className="mt-0.5 flex-shrink-0 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
              aria-label={`Select quest: ${quest.name}`}
            />
          )}
          
          <div className="flex-1 min-w-0">
            {/* Title and focus indicator */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-base sm:text-lg text-foreground break-words line-clamp-2 leading-tight">
                {quest.name}
              </h3>
              {isFocusedQuest && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 border border-primary/30">
                  <Flame className="w-3 h-3 text-primary animate-pulse" />
                  <span className="text-xs font-semibold text-primary">Focus</span>
                </div>
              )}
            </div>
            
            {/* Description */}
            {quest.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                {quest.description}
              </p>
            )}
            
            {/* Subtask progress */}
            {hasSubtasks && (
              <div className="mb-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Subtasks</span>
                  <span className="text-muted-foreground">{completedSubtasks}/{subtasks.length}</span>
                </div>
                <Progress value={subtaskProgress} className="h-1.5" />
              </div>
            )}
          </div>
          
          {/* XP Badge */}
          <div className="flex-shrink-0">
            <Badge variant="secondary" className="text-xs font-bold bg-gradient-to-r from-gold/20 to-gold/30 text-gold border-gold/30">
              ⭐ {quest.xp} XP
              {isFocusedQuest && <span className="text-primary ml-1">(+25%)</span>}
            </Badge>
          </div>
        </div>

        {/* Meta information */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs font-medium hover:bg-muted/50 transition-colors">
            {quest.category}
          </Badge>
          
          {quest.priority && (
            <Badge variant="outline" className={cn("text-xs font-medium", priorityConfig.color)}>
              {quest.priority}
            </Badge>
          )}
          
          {dueDateStatus.status !== 'none' && (
            <Badge variant="outline" className={cn("text-xs font-medium", dueDateStatus.color)}>
              <Calendar className="w-3 h-3 mr-1" />
              {dueDateStatus.label}
            </Badge>
          )}
          
          {hasSubtasks && (
            <Badge variant="outline" className="text-xs">
              {completedSubtasks}/{subtasks.length} tasks
            </Badge>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2 border-t border-border/50">
          {/* Left side - utility buttons */}
          <div className="flex gap-1">
            {onAskAI && (
              <Button
                size="icon"
                variant="ghost"
                onClick={onAskAI}
                className="h-9 w-9 hover:bg-accent/20 hover:text-accent transition-colors"
                aria-label="Ask AI Coach"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                size="icon"
                variant="ghost"
                onClick={onEdit}
                className="h-9 w-9 hover:bg-primary/20 hover:text-primary transition-colors"
                aria-label="Edit quest"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="icon"
                variant="ghost"
                onClick={onDelete}
                className="h-9 w-9 hover:bg-destructive/20 hover:text-destructive transition-colors"
                aria-label="Delete quest"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {/* Right side - action buttons */}
          <div className="flex gap-2 ml-auto">
            {onRush && chronoLevel > 0 && !dailyRushUsed && (
              <Button
                size="sm"
                onClick={onRush}
                variant="outline"
                className="hover:bg-accent/20 hover:border-accent hover:text-accent transition-all"
                aria-label="Rush quest completion"
              >
                <Zap className="w-4 h-4 mr-1" />
                <span className="text-xs font-semibold">Rush</span>
              </Button>
            )}
            
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold transition-all hover:scale-105 shadow-md"
              aria-label="Complete quest"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Complete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

ImprovedQuestCard.displayName = "ImprovedQuestCard";
