import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlusCircle, CalendarIcon } from "lucide-react";
import { Quest } from "@/hooks/useGameState";
import { toast } from "sonner";
import { format } from "date-fns";

interface EnhancedAddQuestFormProps {
  onAddQuest: (quest: Omit<Quest, 'id' | 'completed' | 'createdAt'>) => void;
}

export const EnhancedAddQuestForm = ({ onAddQuest }: EnhancedAddQuestFormProps) => {
  const [questName, setQuestName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questName.trim()) {
      toast.error("Please enter a quest name");
      return;
    }

    const xpByPriority = { low: 30, medium: 50, high: 80 };

    onAddQuest({
      name: questName,
      description: description || undefined,
      category,
      xp: xpByPriority[priority],
      priority,
      dueDate: dueDate,
    });

    // Reset form
    setQuestName("");
    setDescription("");
    setPriority('medium');
    setDueDate(undefined);
  };

  return (
    <Card className="glass-card border-primary/20 hover:border-primary/30 transition-all">
      <CardHeader className="border-b border-primary/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <PlusCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Add New Quest</CardTitle>
            <CardDescription>Create a new quest to complete</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="questName">Quest Name</Label>
            <Input
              id="questName"
              placeholder="What do you want to accomplish?"
              value={questName}
              onChange={(e) => setQuestName(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add details about this quest..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background/50"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Learning">Learning</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(val) => setPriority(val as 'low' | 'medium' | 'high')}>
                <SelectTrigger id="priority" className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">🔴 High (80 XP)</SelectItem>
                  <SelectItem value="medium">🟡 Medium (50 XP)</SelectItem>
                  <SelectItem value="low">🟢 Low (30 XP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-background/50"
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

          <Button type="submit" className="w-full">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Quest
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
