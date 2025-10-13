import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { Quest } from "@/hooks/useGameState";
import { toast } from "sonner";

interface EnhancedAddQuestFormProps {
  onAddQuest: (quest: Omit<Quest, 'id' | 'completed' | 'createdAt'>) => void;
}

export const EnhancedAddQuestForm = ({ onAddQuest }: EnhancedAddQuestFormProps) => {
  const [questName, setQuestName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

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
    });

    // Reset form
    setQuestName("");
    setDescription("");
    setPriority('medium');
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Add New Quest</CardTitle>
        <CardDescription>Create a new quest to complete</CardDescription>
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

          <Button type="submit" className="w-full">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Quest
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
