import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Coins, Popcorn, Gamepad2, Coffee, Music, Heart, Sparkles, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CustomReward } from "@/hooks/useGameState";
import { z } from "zod";

interface LeisureActivity {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  emoji: string;
}

interface RewardsManagerProps {
  gold: number;
  leisureHistory: Array<{ activityName: string; cost: number; timestamp: Date }>;
  customRewards: CustomReward[];
  onSpendGold: (activityId: string, activityName: string, cost: number) => void;
  onAddReward: (reward: Omit<CustomReward, 'id' | 'createdAt'>) => void;
  onUpdateReward: (rewardId: string, updates: Partial<CustomReward>) => void;
  onDeleteReward: (rewardId: string) => void;
}

const iconMap: Record<string, any> = {
  'popcorn': Popcorn,
  'gamepad': Gamepad2,
  'coffee': Coffee,
  'music': Music,
  'heart': Heart,
  'sparkles': Sparkles,
};

const PRESET_ACTIVITIES: LeisureActivity[] = [
  { id: 'movie', name: 'Movie Night', description: 'Cinematic experience', cost: 50, icon: 'popcorn', emoji: '🎬' },
  { id: 'gaming', name: 'Gaming Session', description: '2 hours of gaming', cost: 30, icon: 'gamepad', emoji: '🎮' },
  { id: 'cafe', name: 'Café Treat', description: 'Coffee & pastry', cost: 15, icon: 'coffee', emoji: '☕' },
  { id: 'concert', name: 'Concert Ticket', description: 'Live music', cost: 120, icon: 'music', emoji: '🎵' },
  { id: 'spa', name: 'Spa Day', description: 'Relaxation time', cost: 80, icon: 'heart', emoji: '💆' },
  { id: 'custom', name: 'Surprise Treat', description: 'Something special', cost: 25, icon: 'sparkles', emoji: '✨' },
];

const rewardSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  description: z.string().trim().min(1, "Description is required").max(100, "Description must be less than 100 characters"),
  cost: z.number().min(1, "Cost must be at least 1").max(10000, "Cost must be less than 10,000"),
  emoji: z.string().trim().min(1, "Emoji is required").max(4, "Emoji must be 1-2 characters"),
});

export const RewardsManager = ({ 
  gold, 
  leisureHistory, 
  customRewards,
  onSpendGold,
  onAddReward,
  onUpdateReward,
  onDeleteReward
}: RewardsManagerProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<CustomReward | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: '',
    emoji: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePurchase = (activity: LeisureActivity | CustomReward) => {
    if (gold < activity.cost) {
      toast({
        title: "Not enough gold!",
        description: `You need ${activity.cost - gold} more gold for this reward.`,
        variant: "destructive",
      });
      return;
    }

    onSpendGold(activity.id, activity.name, activity.cost);
    toast({
      title: `${'emoji' in activity ? activity.emoji : '✨'} ${activity.name} unlocked!`,
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
      });

      const rewardData: Omit<CustomReward, 'id' | 'createdAt'> = {
        name: validated.name,
        description: validated.description,
        cost: validated.cost,
        emoji: validated.emoji,
        icon: 'sparkles'
      };

      if (editingReward) {
        onUpdateReward(editingReward.id, validated);
      } else {
        onAddReward(rewardData);
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
    setFormData({ name: '', description: '', cost: '', emoji: '' });
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
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (rewardId: string) => {
    if (confirm('Are you sure you want to delete this reward?')) {
      onDeleteReward(rewardId);
    }
  };

  const totalSpent = leisureHistory.reduce((sum, h) => sum + h.cost, 0);
  const allRewards = [...PRESET_ACTIVITIES, ...customRewards];

  return (
    <div className="space-y-6">
      <Card className="glass-card border-leisure/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-leisure" />
                Rewards
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Spend your gold on things that make you happy
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-2xl font-bold text-gold">
                <Coins className="w-6 h-6" />
                {gold}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalSpent} spent total
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Rewards</h3>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Custom Reward
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingReward ? 'Edit' : 'Create'} Custom Reward</DialogTitle>
                  <DialogDescription>
                    Add a personalized reward to motivate yourself
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
                    />
                    {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
                  </div>
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
                  <Button onClick={handleSubmit} className="w-full">
                    {editingReward ? 'Update' : 'Create'} Reward
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allRewards.map((reward) => {
              const Icon = 'icon' in reward ? iconMap[reward.icon] : Sparkles;
              const canAfford = gold >= reward.cost;
              const isCustom = 'createdAt' in reward;

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
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-3 rounded-xl ${
                          canAfford ? 'bg-leisure/10' : 'bg-muted/30'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            canAfford ? 'text-leisure' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {reward.emoji} {reward.name}
                          </CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {reward.description}
                          </CardDescription>
                        </div>
                      </div>
                      {isCustom && (
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleEdit(reward as CustomReward)}
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
                      )}
                    </div>
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

      {/* Leisure History */}
      {leisureHistory.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl">Purchase History</CardTitle>
            <CardDescription>Your latest rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leisureHistory.slice(0, 10).map((item, idx) => (
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
