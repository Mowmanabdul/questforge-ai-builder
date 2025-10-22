import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Quest } from "@/hooks/useGameState";
import { QuestBreakdown } from "./QuestBreakdown";
import { format } from "date-fns";

interface EditQuestDialogProps {
  quest: Quest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (questId: string, updates: Partial<Quest>) => void;
  categories: string[];
  onRequestAIBreakdown?: (quest: Quest) => void;
}

export const EditQuestDialog = ({ quest, open, onOpenChange, onSave, categories, onRequestAIBreakdown }: EditQuestDialogProps) => {
  const [name, setName] = useState(quest.name);
  const [description, setDescription] = useState(quest.description || "");
  const [category, setCategory] = useState(quest.category);
  const [xp, setXp] = useState(quest.xp.toString());
  const [priority, setPriority] = useState(quest.priority || "medium");
  const [dueDate, setDueDate] = useState<Date | undefined>(quest.dueDate);
  const [currentQuest, setCurrentQuest] = useState(quest);

  const handleSave = () => {
    onSave(quest.id, {
      name,
      description,
      category,
      xp: parseInt(xp),
      priority: priority as any,
      dueDate,
    });
    onOpenChange(false);
  };

  const handleUpdateSubtasks = (questId: string, updates: Partial<Quest>) => {
    setCurrentQuest({ ...currentQuest, ...updates });
    onSave(questId, updates);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Quest</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Quest Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What needs to be done?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this quest..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="xp">XP Reward</Label>
              <Input
                id="xp"
                type="number"
                min="10"
                step="10"
                value={xp}
                onChange={(e) => setXp(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(val) => setPriority(val as 'low' | 'medium' | 'high')}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">🟢 Low</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="high">🔴 High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <QuestBreakdown
            quest={currentQuest}
            onUpdateQuest={handleUpdateSubtasks}
            onRequestAIBreakdown={onRequestAIBreakdown}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
