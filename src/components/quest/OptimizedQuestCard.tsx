import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Edit2, Trash2, MessageCircle, Zap, Flame } from "lucide-react";
import { Quest } from "@/hooks/useGameState";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface OptimizedQuestCardProps {
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

const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case 'high': return 'border-destructive text-destructive';
    case 'medium': return 'border-primary text-primary';
    case 'low': return 'border-muted-foreground text-muted-foreground';
    default: return '';
  }
};

export const OptimizedQuestCard = React.memo(({
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
}: OptimizedQuestCardProps) => {
  const isFocusedQuest = quest.category === dailyFocus;

  return (
    <div
      className={cn(
        "glass-card p-3 sm:p-4 rounded-lg card-hover transition-all",
        isFocusedQuest && "border-primary/40 glow-primary"
      )}
    >
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        {onSelect && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="mt-1"
            aria-label={`Select ${quest.name}`}
          />
        )}
        
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold text-base sm:text-lg break-words">
                  {quest.name}
                </h3>
                {isFocusedQuest && (
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 animate-icon-pulse" aria-label="Daily focus quest" />
                )}
              </div>
              {quest.description && (
                <p className="text-xs sm:text-sm text-muted-foreground mb-2 break-words line-clamp-2">
                  {quest.description}
                </p>
              )}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs hover-scale-smooth">
                  {quest.category}
                </Badge>
                {quest.priority && (
                  <Badge variant="outline" className={cn("text-xs hover-scale-smooth", getPriorityColor(quest.priority))}>
                    {quest.priority}
                  </Badge>
                )}
                {quest.dueDate && (
                  <Badge variant="outline" className="text-xs">
                    📅 {format(new Date(quest.dueDate), 'MMM d')}
                  </Badge>
                )}
                <span className="text-xs sm:text-sm text-secondary font-semibold flex items-center gap-1">
                  ⭐ {quest.xp} XP
                  {isFocusedQuest && (
                    <span className="text-primary font-bold">(+25%)</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto sm:flex-shrink-0">
          {onAskAI && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onAskAI}
              className="flex-shrink-0 hover-scale-smooth h-10 w-10"
              aria-label="Ask AI Coach about this quest"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onEdit}
              className="flex-shrink-0 hover-scale-smooth h-10 w-10"
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
              className="text-destructive hover:text-destructive flex-shrink-0 hover-scale-smooth h-10 w-10"
              aria-label="Delete quest"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          {onRush && chronoLevel > 0 && !dailyRushUsed && (
            <Button
              size="sm"
              onClick={onRush}
              variant="outline"
              className="flex-shrink-0 hover-scale-smooth min-h-10"
              aria-label="Rush quest completion"
            >
              <Zap className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline text-xs sm:text-sm">Rush</span>
            </Button>
          )}
          <Button
            size="sm"
            onClick={onComplete}
            className="flex-1 sm:flex-initial hover-scale-smooth min-h-11 font-semibold"
            aria-label="Complete quest"
          >
            <CheckCircle2 className="w-4 h-4 sm:mr-1.5" />
            <span className="hidden sm:inline text-xs sm:text-sm">Complete</span>
          </Button>
        </div>
      </div>
    </div>
  );
});

OptimizedQuestCard.displayName = "OptimizedQuestCard";
