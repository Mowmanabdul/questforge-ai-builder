import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Quest, Subtask } from "@/hooks/useGameState";
import { Plus, Trash2, Sparkles } from "lucide-react";

interface QuestBreakdownProps {
  quest: Quest;
  onUpdateQuest: (questId: string, updates: Partial<Quest>) => void;
  onRequestAIBreakdown?: (quest: Quest) => void;
}

export const QuestBreakdown = ({ quest, onUpdateQuest, onRequestAIBreakdown }: QuestBreakdownProps) => {
  const [newSubtask, setNewSubtask] = useState("");

  const subtasks = quest.subtasks || [];

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;

    const updatedSubtasks: Subtask[] = [
      ...subtasks,
      {
        id: `subtask-${Date.now()}`,
        name: newSubtask.trim(),
        completed: false
      }
    ];

    onUpdateQuest(quest.id, { subtasks: updatedSubtasks });
    setNewSubtask("");
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    onUpdateQuest(quest.id, { subtasks: updatedSubtasks });
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = subtasks.filter(st => st.id !== subtaskId);
    onUpdateQuest(quest.id, { subtasks: updatedSubtasks });
  };

  const completedCount = subtasks.filter(st => st.completed).length;
  const progress = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0;

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Quest Breakdown</CardTitle>
          {onRequestAIBreakdown && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRequestAIBreakdown(quest)}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              AI Breakdown
            </Button>
          )}
        </div>
        {subtasks.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{completedCount} / {subtasks.length}</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {subtasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No subtasks yet. Add some to break down this quest!
          </p>
        ) : (
          <div className="space-y-2">
            {subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <Checkbox
                  checked={subtask.completed}
                  onCheckedChange={() => handleToggleSubtask(subtask.id)}
                />
                <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {subtask.name}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteSubtask(subtask.id)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Input
            placeholder="Add a subtask..."
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
            className="text-sm"
          />
          <Button size="sm" onClick={handleAddSubtask}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
