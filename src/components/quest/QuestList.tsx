import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Flame } from "lucide-react";
import { Quest } from "@/hooks/useGameState";

interface QuestListProps {
  quests: Quest[];
  dailyFocus: string;
  onCompleteQuest: (questId: string) => void;
}

export const QuestList = ({ quests, dailyFocus, onCompleteQuest }: QuestListProps) => {
  return (
    <Card className="glass-card p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Active Quests</h2>
        {dailyFocus && (
          <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/30 rounded-lg">
            <Flame className="w-5 h-5 text-primary pulse-glow" />
            <div>
              <span className="text-sm font-semibold">Today's Focus: {dailyFocus}</span>
              <span className="text-xs text-muted-foreground ml-2">+25% XP Bonus</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {quests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">No active quests</p>
            <p className="text-sm">Add a quest above to begin your journey!</p>
          </div>
        ) : (
          quests.map((quest) => (
            <div
              key={quest.id}
              className={`glass-card p-4 rounded-lg transition-all hover:border-primary/50 ${
                quest.category === dailyFocus ? 'border-primary/30 glow-primary' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{quest.name}</h3>
                    {quest.category === dailyFocus && (
                      <Flame className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {quest.category}
                    </Badge>
                    <span className="text-xs text-secondary font-semibold">
                      {quest.xp} XP
                      {quest.category === dailyFocus && (
                        <span className="text-primary ml-1">(+25%)</span>
                      )}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onCompleteQuest(quest.id)}
                  className="flex-shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Complete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
