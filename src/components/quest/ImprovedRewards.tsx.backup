import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, Plus, Edit, Trash2, Sparkles, ShoppingBag, Coffee, Film, Heart, Gamepad2, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CustomReward } from "@/hooks/useGameState";
import { z } from "zod";

interface ImprovedRewardsProps {
  gold: number;
  leisureHistory: Array<{ activityName: string; cost: number; timestamp: Date }>;
  customRewards: CustomReward[];
  onSpendGold: (activityId: string, activityName: string, cost: number) => void;
  onAddReward: (reward: Omit<CustomReward, 'id' | 'createdAt'>) => void;
  onUpdateReward: (rewardId: string, updates: Partial<CustomReward>) => void;
  onDeleteReward: (rewardId: string) => void;
}

const CATEGORIES = [
  { value: 'entertainment', label: 'Entertainment', icon: Film, color: 'hsl(330, 81%, 60%)' },
  { value: 'food', label: 'Food & Drink', icon: Coffee, color: 'hsl(43, 96%, 56%)' },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'hsl(142, 71%, 45%)' },
  { value: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'hsl(267, 84%, 64%)' },
  { value: 'wellness', label: 'Self-Care', icon: Heart, color: 'hsl(0, 72%, 51%)' },
  { value: 'hobbies', label: 'Hobbies', icon: Music, color: 'hsl(190, 95%, 56%)' },
];

const rewardSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  description: z.string().trim().min(1, "Description is required").max(100, "Description must be less than 100 characters"),
  cost: z.number().min(1, "Cost must be at least 1").max(10000, "Cost must be less than 10,000"),
  emoji: z.string().trim().min(1, "Emoji is required").max(4, "Emoji must be 1-2 characters"),
  category: z.string().min(1, "Category is required"),
});

export const ImprovedRewards = ({ 
  gold, 
  leisureHistory, 
  customRewards,
  onSpendGold,
  onAddReward,
  onUpdateReward,
  onDeleteReward
}: ImprovedRewardsProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<CustomReward | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: '',
    emoji: '',
    category: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePurchase = (reward: CustomReward) => {
    if (gold < reward.cost) {
      toast({
        title: "Not enough gold!",
        description: `You need ${reward.cost - gold} more gold for this reward.`,
        variant: "destructive",
      });
      return;
    }

    onSpendGold(reward.id, reward.name, reward.cost);
    toast({
      title: `${reward.emoji} ${reward.name} unlocked!`,
      description: "Enjoy your well-earned reward!",
    });
  };

  const handleSubmit = () => {
    try {
      const validated = rewardSchema.parse({
        name: formData.name,
        description: formData.description,
        cost: parseInt(formData.cost),
        emoji: formData.emoji,
        category: formData.category,
      });

      const rewardData = {
        name: validated.name,
        description: validated.description,
        cost: validated.cost,
        emoji: validated.emoji,
        category: validated.category,
        icon: 'sparkles'
      };

      if (editingReward) {
        onUpdateReward(editingReward.id, validated);
        toast({ title: "Reward updated successfully!" });
      } else {
        onAddReward(rewardData);
        toast({ title: "Reward created successfully!" });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', cost: '', emoji: '', category: '' });
    setErrors({});
    setEditingReward(null);
  };

  const handleEdit = (reward: CustomReward) => {
    setEditingReward(reward);
    setFormData({
      name: reward.name,
      description: reward.description,
      cost: reward.cost.toString(),
      emoji: reward.emoji,
      category: reward.category || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (rewardId: string) => {
    if (confirm('Are you sure you want to delete this reward?')) {
      onDeleteReward(rewardId);
      toast({ title: "Reward deleted" });
    }
  };

  const totalSpent = leisureHistory.reduce((sum, h) => sum + h.cost, 0);
  const groupedRewards = CATEGORIES.map(cat => ({
    ...cat,
    rewards: customRewards.filter(r => r.category === cat.value)
  })).filter(cat => cat.rewards.length > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="glass-card border-leisure/30">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-leisure" />
                Your Rewards
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Create and claim rewards that motivate you
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 text-2xl font-bold text-gold">
                  <Coins className="w-6 h-6" />
                  {gold}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalSpent} spent total
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Plus className="w-5 h-5" />
                    Add Reward
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingReward ? 'Edit' : 'Create'} Reward</DialogTitle>
                    <DialogDescription>
                      Design a personalized reward to work towards
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Reward Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., New Video Game"
                        maxLength={50}
                      />
                      {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="What makes this reward special?"
                        maxLength={100}
                        rows={3}
                      />
                      {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cost">Gold Cost</Label>
                        <Input
                          id="cost"
                          type="number"
                          value={formData.cost}
                          onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                          placeholder="100"
                          min="1"
                          max="10000"
                        />
                        {errors.cost && <p className="text-xs text-destructive mt-1">{errors.cost}</p>}
                      </div>
                      <div>
                        <Label htmlFor="emoji">Emoji</Label>
                        <Input
                          id="emoji"
                          value={formData.emoji}
                          onChange={(e) => setFormData(prev => ({ ...prev, emoji: e.target.value }))}
                          placeholder="🎁"
                          maxLength={4}
                        />
                        {errors.emoji && <p className="text-xs text-destructive mt-1">{errors.emoji}</p>}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
                    </div>
                    <Button onClick={handleSubmit} className="w-full">
                      {editingReward ? 'Update' : 'Create'} Reward
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Rewards by Category */}
      {groupedRewards.length > 0 ? (
        <div className="space-y-6">
          {groupedRewards.map(category => {
            const Icon = category.icon;
            return (
              <Card key={category.value} className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Icon className="w-5 h-5" style={{ color: category.color }} />
                    {category.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.rewards.map((reward) => {
                      const canAfford = gold >= reward.cost;
                      return (
                        <Card 
                          key={reward.id} 
                          className={`border-2 transition-all duration-300 ${
                            canAfford 
                              ? 'border-leisure/40 hover:border-leisure hover:glow-leisure' 
                              : 'border-border/30 opacity-75'
                          }`}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-lg flex items-center gap-2 flex-1">
                                <span className="text-2xl">{reward.emoji}</span>
                                <span className="line-clamp-1">{reward.name}</span>
                              </CardTitle>
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => handleEdit(reward)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDelete(reward.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <CardDescription className="text-xs line-clamp-2">
                              {reward.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <Button
                              onClick={() => handlePurchase(reward)}
                              disabled={!canAfford}
                              className="w-full"
                              variant={canAfford ? "default" : "outline"}
                            >
                              <Coins className="w-4 h-4 mr-2" />
                              {reward.cost} Gold
                            </Button>
                            {!canAfford && (
                              <p className="text-xs text-center text-muted-foreground">
                                Need {reward.cost - gold} more gold
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No rewards yet</h3>
            <p className="text-muted-foreground">
              Click the "Add Reward" button above to create your first reward!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Purchase History */}
      {leisureHistory.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl">Recent Claims</CardTitle>
            <CardDescription>Your latest reward purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leisureHistory.slice(0, 8).map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-leisure border-leisure/50">
                      {item.activityName}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gold flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    {item.cost}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
