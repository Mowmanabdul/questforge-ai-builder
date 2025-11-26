import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Coins, 
  Gift, 
  Coffee, 
  Gamepad2, 
  Utensils, 
  ShoppingBag, 
  Star, 
  Plus,
  Sparkles,
  Trophy,
  Target,
  Heart,
  Edit2,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModernRewardsProps {
  gold: number;
  leisureHistory: any[];
  customRewards: any[];
  onSpendGold: (activityId: string, activityName: string, cost: number) => void;
  onAddReward: (reward: any) => void;
  onUpdateReward: (id: string, reward: any) => void;
  onDeleteReward: (id: string) => void;
}

const defaultRewards = [
  { id: "coffee", name: "Coffee Break", cost: 50, icon: Coffee, color: "from-amber-500 to-orange-500", isDefault: true },
  { id: "snack", name: "Favorite Snack", cost: 30, icon: Utensils, color: "from-green-500 to-emerald-500", isDefault: true },
  { id: "gaming", name: "30min Gaming", cost: 100, icon: Gamepad2, color: "from-purple-500 to-pink-500", isDefault: true },
  { id: "shopping", name: "Small Purchase", cost: 150, icon: ShoppingBag, color: "from-blue-500 to-cyan-500", isDefault: true },
  { id: "movie", name: "Movie Night", cost: 200, icon: Star, color: "from-red-500 to-rose-500", isDefault: true },
];

export const ModernRewards = ({
  gold,
  leisureHistory,
  customRewards,
  onSpendGold,
  onAddReward,
  onUpdateReward,
  onDeleteReward
}: ModernRewardsProps) => {
  const [isAddingReward, setIsAddingReward] = useState(false);
  const [editingReward, setEditingReward] = useState<any>(null);
  const [newReward, setNewReward] = useState({ name: "", cost: 0, description: "" });

  const allRewards = [...defaultRewards, ...customRewards];

  const handleAddReward = () => {
    if (newReward.name && newReward.cost > 0) {
      onAddReward({
        id: Date.now().toString(),
        ...newReward,
        icon: Gift,
        color: "from-indigo-500 to-purple-500"
      });
      setNewReward({ name: "", cost: 0, description: "" });
      setIsAddingReward(false);
    }
  };

  const RewardCard = ({ reward, isCustom = false }: { reward: any; isCustom?: boolean }) => {
    const IconComponent = reward.icon || Gift;
    const canAfford = gold >= reward.cost;
    const isEditable = isCustom || reward.isDefault;
    
    return (
      <motion.div
        layout
        whileHover={{ scale: 1.01 }}
        className={cn(
          "relative overflow-hidden rounded-lg p-4 transition-all duration-200 border",
          `bg-gradient-to-br ${reward.color} text-white`,
          canAfford ? "cursor-pointer hover:shadow-lg" : "opacity-60 cursor-not-allowed"
        )}
        onClick={() => canAfford && onSpendGold(reward.id, reward.name, reward.cost)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-white/20">
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm mb-1 truncate">{reward.name}</h3>
              <div className="flex items-center gap-1">
                <Coins className="w-3 h-3" />
                <span className="font-bold text-sm">{reward.cost}</span>
              </div>
            </div>
          </div>
          
          {isEditable && (
            <div className="flex gap-1 opacity-70 hover:opacity-100">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingReward(reward);
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              {isCustom && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteReward(reward.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}
        </div>
          
          {reward.description && (
            <p className="text-sm text-white/80 mb-3 line-clamp-2">{reward.description}</p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4" />
              <span className="font-bold">{reward.cost}</span>
            </div>
            {!canAfford && (
              <Badge variant="secondary" className="text-xs">
                Need {reward.cost - gold} more
              </Badge>
            )}
          </div>
        </div>
        
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
          <IconComponent className="w-full h-full" />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Rewards</h1>
        </div>
        <p className="text-muted-foreground text-sm">Treat yourself for your achievements</p>
        
        {/* Gold Balance */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50">
          <Coins className="w-4 h-4 text-yellow-600" />
          <span className="font-bold text-lg text-yellow-700">{gold}</span>
          <span className="text-yellow-600 text-sm">Gold</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
          <Heart className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold text-green-600">{leisureHistory.length}</div>
          <div className="text-sm text-muted-foreground">Rewards Claimed</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20">
          <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold text-blue-600">{allRewards.length}</div>
          <div className="text-sm text-muted-foreground">Available Rewards</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20">
          <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <div className="text-2xl font-bold text-purple-600">
            {leisureHistory.reduce((sum, item) => sum + (item.cost || 0), 0)}
          </div>
          <div className="text-sm text-muted-foreground">Gold Spent</div>
        </div>
      </div>

      {/* Add Custom Reward Button */}
      <div className="flex justify-center">
        <Dialog open={isAddingReward} onOpenChange={setIsAddingReward}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Reward
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Custom Reward</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Reward name"
                value={newReward.name}
                onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Gold cost"
                value={newReward.cost || ''}
                onChange={(e) => setNewReward({ ...newReward, cost: parseInt(e.target.value) || 0 })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={newReward.description}
                onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
              />
              <Button onClick={handleAddReward} className="w-full">
                Create Reward
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {allRewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              isCustom={customRewards.includes(reward)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Recent Activity */}
      {leisureHistory.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Recent Rewards
          </h2>
          <div className="space-y-2">
            {leisureHistory.slice(-5).reverse().map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Gift className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{item.activity || "Reward"}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.date ? new Date(item.date).toLocaleDateString() : "Recently"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Coins className="w-3 h-3 text-yellow-600" />
                  {item.cost || 0}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
