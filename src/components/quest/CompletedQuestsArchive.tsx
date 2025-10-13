import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Trash2 } from "lucide-react";
import { Quest } from "@/hooks/useGameState";
import { format } from "date-fns";

interface CompletedQuestsArchiveProps {
  quests: Quest[];
  onRestore: (questId: string) => void;
  onPermanentDelete: (questId: string) => void;
}

export const CompletedQuestsArchive = ({ quests, onRestore, onPermanentDelete }: CompletedQuestsArchiveProps) => {
  return (
    <Card className="glass-card p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">
          Completed Quests Archive
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({quests.length} total)
          </span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Your quest history - restore quests or permanently delete them
        </p>
      </div>

      <div className="space-y-3">
        {quests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">No completed quests yet</p>
            <p className="text-sm">Complete some quests to see them here!</p>
          </div>
        ) : (
          quests.map((quest) => (
            <div
              key={quest.id}
              className="glass-card p-4 rounded-lg border-primary/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{quest.name}</h3>
                  </div>
                  {quest.description && (
                    <p className="text-sm text-muted-foreground mb-2">{quest.description}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {quest.category}
                    </Badge>
                    <span className="text-xs text-secondary font-semibold">
                      {quest.xp} XP
                    </span>
                    {quest.completedAt && (
                      <span className="text-xs text-muted-foreground">
                        Completed {format(quest.completedAt, 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRestore(quest.id)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restore
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onPermanentDelete(quest.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
