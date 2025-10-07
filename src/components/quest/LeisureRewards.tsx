import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Popcorn, Gamepad2, Coffee, Music, Heart, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LeisureActivity {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  emoji: string;
}

interface LeisureRewardsProps {
  gold: number;
  leisureHistory: Array<{ activityName: string; cost: number; timestamp: Date }>;
  onSpendGold: (activityId: string, activityName: string, cost: number) => void;
}

const iconMap: Record<string, any> = {
  'popcorn': Popcorn,
  'gamepad': Gamepad2,
  'coffee': Coffee,
  'music': Music,
  'heart': Heart,
  'sparkles': Sparkles,
};

const LEISURE_ACTIVITIES: LeisureActivity[] = [
  {
    id: 'movie',
    name: 'Movie Night',
    description: 'Treat yourself to a cinematic experience',
    cost: 50,
    icon: 'popcorn',
    emoji: '🎬'
  },
  {
    id: 'gaming',
    name: 'Gaming Session',
    description: '2 hours of pure gaming bliss',
    cost: 30,
    icon: 'gamepad',
    emoji: '🎮'
  },
  {
    id: 'cafe',
    name: 'Café Treat',
    description: 'Your favorite coffee & pastry',
    cost: 15,
    icon: 'coffee',
    emoji: '☕'
  },
  {
    id: 'concert',
    name: 'Concert Ticket',
    description: 'Live music experience',
    cost: 120,
    icon: 'music',
    emoji: '🎵'
  },
  {
    id: 'spa',
    name: 'Spa Day',
    description: 'Relaxation and self-care',
    cost: 80,
    icon: 'heart',
    emoji: '💆'
  },
  {
    id: 'custom',
    name: 'Surprise Treat',
    description: 'Something special for you',
    cost: 25,
    icon: 'sparkles',
    emoji: '✨'
  },
];

export const LeisureRewards = ({ gold, leisureHistory, onSpendGold }: LeisureRewardsProps) => {
  const { toast } = useToast();

  const handlePurchase = (activity: LeisureActivity) => {
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
      title: `${activity.emoji} ${activity.name} unlocked!`,
      description: "Enjoy your well-earned reward!",
    });
  };

  const totalSpent = leisureHistory.reduce((sum, h) => sum + h.cost, 0);

  return (
    <div className="space-y-6">
      <Card className="glass-card border-leisure/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-leisure" />
                Leisure & Rewards
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Spend your hard-earned gold on things that make you happy
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
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LEISURE_ACTIVITIES.map((activity) => {
              const Icon = iconMap[activity.icon];
              const canAfford = gold >= activity.cost;

              return (
                <Card 
                  key={activity.id} 
                  className={`border-2 transition-all duration-300 ${
                    canAfford 
                      ? 'border-leisure/40 hover:border-leisure hover:glow-leisure' 
                      : 'border-border/30 opacity-75'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${
                          canAfford ? 'bg-leisure/10' : 'bg-muted/30'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            canAfford ? 'text-leisure' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {activity.emoji} {activity.name}
                          </CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {activity.description}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={() => handlePurchase(activity)}
                      disabled={!canAfford}
                      className="w-full"
                      variant={canAfford ? "default" : "outline"}
                    >
                      <Coins className="w-4 h-4 mr-2" />
                      {activity.cost} Gold
                    </Button>
                    {!canAfford && (
                      <p className="text-xs text-center text-muted-foreground">
                        Need {activity.cost - gold} more gold
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
            <CardTitle className="text-xl">Recent Rewards</CardTitle>
            <CardDescription>Your latest treats and experiences</CardDescription>
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
