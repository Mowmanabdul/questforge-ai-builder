import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";
import { TrendingUp, TrendingDown, Award, Coins, Zap, Target, Calendar, BarChart3, Activity, Flame } from "lucide-react";
import { useMemo } from "react";

interface EnhancedAnalyticsProps {
  player: any;
}

export const EnhancedAnalytics = ({ player }: EnhancedAnalyticsProps) => {
  // Calculate insights and trends
  const analytics = useMemo(() => {
    const history = player.questHistory || [];
    const transactions = player.goldTransactions || [];
    
    // 30-day activity trend
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dayQuests = history.filter((q: any) => {
        const qDate = new Date(q.completedAt);
        return qDate.toDateString() === date.toDateString();
      });
      return {
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        quests: dayQuests.length,
        xp: dayQuests.reduce((sum: number, q: any) => sum + q.xpEarned, 0),
        gold: dayQuests.reduce((sum: number, q: any) => sum + q.goldEarned, 0),
      };
    });

    // 7-day comparison
    const last7Days = last30Days.slice(-7);
    const prev7Days = last30Days.slice(-14, -7);
    const current7DayTotal = last7Days.reduce((sum, d) => sum + d.quests, 0);
    const prev7DayTotal = prev7Days.reduce((sum, d) => sum + d.quests, 0);
    const weekOverWeekChange = prev7DayTotal > 0 ? ((current7DayTotal - prev7DayTotal) / prev7DayTotal) * 100 : 0;

    // Category performance
    const categoryStats = history.reduce((acc: any, q: any) => {
      if (!acc[q.category]) {
        acc[q.category] = { count: 0, xp: 0, gold: 0, avgXp: 0 };
      }
      acc[q.category].count++;
      acc[q.category].xp += q.xpEarned;
      acc[q.category].gold += q.goldEarned;
      return acc;
    }, {});

    Object.keys(categoryStats).forEach(cat => {
      categoryStats[cat].avgXp = Math.round(categoryStats[cat].xp / categoryStats[cat].count);
    });

    const categoryData = Object.entries(categoryStats)
      .map(([name, stats]: [string, any]) => ({ name, ...stats }))
      .sort((a, b) => b.count - a.count);

    // Gold economics
    const goldEarned = transactions.filter((t: any) => t.amount > 0).reduce((sum: number, t: any) => sum + t.amount, 0);
    const goldSpent = Math.abs(transactions.filter((t: any) => t.amount < 0).reduce((sum: number, t: any) => sum + t.amount, 0));
    const savingsRate = goldEarned > 0 ? ((player.gold / goldEarned) * 100).toFixed(1) : 0;

    // Peak performance
    const questsByDay = history.reduce((acc: any, q: any) => {
      const date = new Date(q.completedAt).toDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    const maxQuestsInDay = Math.max(...Object.values(questsByDay).map((v: any) => v), 0);

    // Average XP per quest
    const avgXpPerQuest = history.length > 0 ? Math.round(history.reduce((sum: number, q: any) => sum + q.xpEarned, 0) / history.length) : 0;

    return {
      last30Days,
      last7Days,
      weekOverWeekChange,
      categoryData,
      goldEarned,
      goldSpent,
      savingsRate,
      maxQuestsInDay,
      avgXpPerQuest,
    };
  }, [player.questHistory, player.goldTransactions, player.gold]);

  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--gold))',
    'hsl(var(--accent))',
    'hsl(var(--leisure))',
    'hsl(var(--insight))',
    'hsl(var(--secondary))',
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Weekly Trend</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{Math.abs(analytics.weekOverWeekChange).toFixed(0)}%</span>
                  {analytics.weekOverWeekChange >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-accent" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-destructive" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">vs last week</p>
              </div>
              <Activity className="w-8 h-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-gold">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Savings Rate</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold bg-gradient-to-r from-gold to-secondary bg-clip-text text-transparent">
                    {analytics.savingsRate}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">of gold earned</p>
              </div>
              <Coins className="w-8 h-8 text-gold/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-accent">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Peak Day</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{analytics.maxQuestsInDay}</span>
                  <Flame className="w-5 h-5 text-accent" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">quests completed</p>
              </div>
              <Target className="w-8 h-8 text-accent/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="economy" className="gap-2">
            <Coins className="w-4 h-4" />
            <span className="hidden sm:inline">Economy</span>
          </TabsTrigger>
        </TabsList>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                30-Day Activity
              </CardTitle>
              <CardDescription>Your productivity over the last month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.last30Days}>
                  <defs>
                    <linearGradient id="colorQuests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area type="monotone" dataKey="quests" stroke="hsl(var(--primary))" fill="url(#colorQuests)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">7-Day Breakdown</CardTitle>
                <CardDescription>Detailed view of this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analytics.last7Days}>
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="quests" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
                <CardDescription>Key statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Avg XP per Quest</span>
                    <span className="font-bold">{analytics.avgXpPerQuest} XP</span>
                  </div>
                  <Progress value={(analytics.avgXpPerQuest / 100) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Total Quests</span>
                    <span className="font-bold">{player.stats.questsCompleted}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Current Streak</span>
                    <span className="font-bold flex items-center gap-1">
                      <Flame className="w-4 h-4 text-accent" />
                      {player.stats.streak} days
                    </span>
                  </div>
                  <Progress value={(player.stats.streak / player.stats.longestStreak) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Category Distribution
                </CardTitle>
                <CardDescription>Where you focus your effort</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.categoryData.slice(0, 6)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analytics.categoryData.slice(0, 6).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Complete quests to see distribution
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Top Categories
                </CardTitle>
                <CardDescription>Your most productive areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.categoryData.slice(0, 5).map((cat: any, idx: number) => (
                    <div key={cat.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center p-0">
                            {idx + 1}
                          </Badge>
                          <span className="font-medium">{cat.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{cat.count} quests</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-primary" />
                          <span>{cat.xp.toLocaleString()} XP</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Coins className="w-3 h-3 text-gold" />
                          <span>{cat.gold} Gold</span>
                        </div>
                      </div>
                      <Progress value={(cat.count / analytics.categoryData[0].count) * 100} className="h-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Economy Tab */}
        <TabsContent value="economy" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Coins className="w-10 h-10 mx-auto mb-2 text-gold" />
                  <div className="text-2xl font-bold bg-gradient-to-r from-gold to-secondary bg-clip-text text-transparent">
                    {analytics.goldEarned}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Total Earned</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Coins className="w-10 h-10 mx-auto mb-2 text-leisure" />
                  <div className="text-2xl font-bold text-leisure">
                    {analytics.goldSpent}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Total Spent</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Coins className="w-10 h-10 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-primary">
                    {player.gold}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Current Balance</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Gold Flow
              </CardTitle>
              <CardDescription>Economic overview</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { name: 'Earned', value: analytics.goldEarned, fill: 'hsl(var(--gold))' },
                  { name: 'Spent', value: analytics.goldSpent, fill: 'hsl(var(--leisure))' },
                  { name: 'Balance', value: player.gold, fill: 'hsl(var(--primary))' },
                ]}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {[
                      { name: 'Earned', value: analytics.goldEarned, fill: 'hsl(var(--gold))' },
                      { name: 'Spent', value: analytics.goldSpent, fill: 'hsl(var(--leisure))' },
                      { name: 'Balance', value: player.gold, fill: 'hsl(var(--primary))' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
