import { Card } from "@/components/ui/card";
import { Player } from "@/hooks/useGameState";
import { Trophy, Coins, TrendingUp, Calendar } from "lucide-react";
import { useMemo } from "react";

interface AnalyticsProps {
  player: Player;
}

export const Analytics = ({ player }: AnalyticsProps) => {
  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, { count: number; xp: number; gold: number }> = {};
    
    player.questHistory.forEach(quest => {
      if (!breakdown[quest.category]) {
        breakdown[quest.category] = { count: 0, xp: 0, gold: 0 };
      }
      breakdown[quest.category].count++;
      breakdown[quest.category].xp += quest.xp;
      breakdown[quest.category].gold += quest.gold;
    });

    return Object.entries(breakdown)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 10);
  }, [player.questHistory]);

  const goldStats = useMemo(() => {
    const earned = player.goldTransactions
      .filter(t => t.type === 'earned')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const spent = player.goldTransactions
      .filter(t => t.type === 'spent')
      .reduce((sum, t) => sum + t.amount, 0);

    return { earned, spent, current: player.gold };
  }, [player.goldTransactions, player.gold]);

  const recentActivity = useMemo(() => {
    return [...player.questHistory]
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
      .slice(0, 10);
  }, [player.questHistory]);

  const recentTransactions = useMemo(() => {
    return [...player.goldTransactions]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
  }, [player.goldTransactions]);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 glass-card">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Quests</p>
              <p className="text-2xl font-bold">{player.stats.questsCompleted}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-card">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">Total XP Earned</p>
              <p className="text-2xl font-bold">{player.stats.totalXp.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-card">
          <div className="flex items-center gap-3">
            <Coins className="w-8 h-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Current Gold</p>
              <p className="text-2xl font-bold">{goldStats.current}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card className="p-6 glass-card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Quest Breakdown by Category
          </h3>
          <div className="space-y-3">
            {categoryBreakdown.length > 0 ? (
              categoryBreakdown.map(([category, stats]) => (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{category}</span>
                    <span className="text-muted-foreground">{stats.count} quests</span>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{stats.xp.toLocaleString()} XP</span>
                    <span>{stats.gold} Gold</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                      style={{
                        width: `${(stats.count / player.stats.questsCompleted) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Complete quests to see breakdown
              </p>
            )}
          </div>
        </Card>

        {/* Gold Management */}
        <Card className="p-6 glass-card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Gold Management
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Earned</p>
                <p className="text-lg font-bold text-green-500">{goldStats.earned}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Spent</p>
                <p className="text-lg font-bold text-red-500">{goldStats.spent}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="text-lg font-bold text-accent">{goldStats.current}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Recent Transactions</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map(transaction => (
                    <div
                      key={transaction.id}
                      className="flex justify-between items-center p-2 rounded bg-muted/30 text-sm"
                    >
                      <div className="flex-1">
                        <p className="font-medium truncate">{transaction.source}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`font-bold ${
                          transaction.type === 'earned' ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {transaction.type === 'earned' ? '+' : '-'}
                        {transaction.amount}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4 text-sm">
                    No transactions yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 glass-card lg:col-span-2">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Quest Completions
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
            {recentActivity.length > 0 ? (
              recentActivity.map(quest => (
                <div
                  key={quest.id}
                  className="flex justify-between items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{quest.name}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                      <span className="px-2 py-0.5 rounded bg-primary/20 text-primary">
                        {quest.category}
                      </span>
                      <span>{quest.completedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-secondary font-bold">+{quest.xp} XP</p>
                    <p className="text-accent text-sm">+{quest.gold} Gold</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No quests completed yet. Start your journey!
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
