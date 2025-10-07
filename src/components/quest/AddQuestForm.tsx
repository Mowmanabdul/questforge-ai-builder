import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Wand2 } from "lucide-react";
import { Quest, getAIQuestSuggestion } from "@/hooks/useGameState";
import { toast } from "sonner";

interface AddQuestFormProps {
  onAddQuest: (quest: Omit<Quest, 'id' | 'completed' | 'createdAt'>) => void;
}

export const AddQuestForm = ({ onAddQuest }: AddQuestFormProps) => {
  const [questName, setQuestName] = useState("");
  const [category, setCategory] = useState("");
  const [xp, setXp] = useState(50);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questName.trim() || !category.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    onAddQuest({
      name: questName,
      category,
      xp,
    });

    setQuestName("");
    setCategory("");
    setXp(50);
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
          {isLoadingAI ? 'Seeking...' : 'Seek Guidance'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="questName">Quest Name</Label>
          <Input
            id="questName"
            placeholder="Enter your quest..."
            value={questName}
            onChange={(e) => setQuestName(e.target.value)}
            className="bg-background/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
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

        <Button type="submit" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Create Quest
        </Button>
      </form>
    </Card>
  );
};
