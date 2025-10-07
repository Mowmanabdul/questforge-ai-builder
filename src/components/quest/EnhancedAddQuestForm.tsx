import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Plus, Wand2, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { Quest, getAIQuestSuggestion } from "@/hooks/useGameState";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EnhancedAddQuestFormProps {
  onAddQuest: (quest: Omit<Quest, 'id' | 'completed' | 'createdAt'>) => void;
}

export const EnhancedAddQuestForm = ({ onAddQuest }: EnhancedAddQuestFormProps) => {
  const [questName, setQuestName] = useState("");
  const [category, setCategory] = useState("");
  const [xp, setXp] = useState(50);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questName.trim() || !category.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    onAddQuest({
      name: questName,
      category,
      xp,
      priority,
      dueDate,
      recurring: isRecurring ? { frequency: recurringFrequency } : undefined,
    });

    // Reset form
    setQuestName("");
    setCategory("");
    setXp(50);
    setPriority('medium');
    setDueDate(undefined);
    setIsRecurring(false);
    setRecurringFrequency('daily');
  };

  const handleAISuggestion = async () => {
    setIsLoadingAI(true);
    try {
      const suggestion = await getAIQuestSuggestion();
      setQuestName(suggestion.name || "");
      setCategory(suggestion.category || "");
      setXp(suggestion.xp || 50);
      toast.success("The Oracle has provided guidance!");
    } catch (error) {
      toast.error("The Oracle is resting. Try again later.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Add New Quest</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAISuggestion}
          disabled={isLoadingAI}
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Wand2 className={`w-4 h-4 mr-2 ${isLoadingAI ? 'animate-spin' : ''}`} />
          {isLoadingAI ? 'Seeking...' : 'AI Suggest'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="questName">Quest Name *</Label>
          <Input
            id="questName"
            placeholder="Enter your quest..."
            value={questName}
            onChange={(e) => setQuestName(e.target.value)}
            className="bg-background/50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              placeholder="e.g., Work, Fitness"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="xp">XP Reward</Label>
            <Input
              id="xp"
              type="number"
              min="10"
              max="500"
              step="10"
              value={xp}
              onChange={(e) => setXp(Number(e.target.value))}
              className="bg-background/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
              <SelectTrigger className="bg-background/50">
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
            <Label>Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-background/50",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <Switch
              id="recurring"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
            <div>
              <Label htmlFor="recurring" className="cursor-pointer">
                Recurring Quest
              </Label>
              <p className="text-xs text-muted-foreground">
                Auto-renews after completion
              </p>
            </div>
          </div>
          {isRecurring && (
            <Select value={recurringFrequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setRecurringFrequency(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {dueDate && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/30">
            <AlertCircle className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent">
              Due in {Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
            </span>
          </div>
        )}

        <Button type="submit" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Create Quest
        </Button>
      </form>
    </Card>
  );
};
