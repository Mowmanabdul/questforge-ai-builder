import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import { TrendingUp, Award, Coins, Zap, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";

interface ImprovedAnalyticsProps {
  player: any;
}

export const ImprovedAnalytics = ({ player }: ImprovedAnalyticsProps) => {
  // Category breakdown for pie chart
  const categoryData = Object.entries(
    (player.questHistory || []).reduce((acc: any, q: any) => {
      acc[q.category] = (acc[q.category] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => (b.value as number) - (a.value as number))
    .slice(0, 6);

  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--gold))',
    'hsl(var(--accent))',
    'hsl(var(--leisure))',
    'hsl(var(--insight))',
    'hsl(var(--muted))',
  ];

  // Gold flow data
  const goldEarned = (player.goldTransactions || [])
    .filter((t: any) => t.amount > 0)
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const goldSpent = Math.abs(
    (player.goldTransactions || [])
      .filter((t: any) => t.amount < 0)
      .reduce((sum: number, t: any) => sum + t.amount, 0)
  );

  const goldFlowData = [
    { name: 'Earned', value: goldEarned, fill: 'hsl(var(--gold))' },
    { name: 'Spent', value: goldSpent, fill: 'hsl(var(--leisure))' },
    { name: 'Current', value: player.gold, fill: 'hsl(var(--primary))' },
  ];

  // XP progress over last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayQuests = (player.questHistory || []).filter((q: any) => {
      const qDate = new Date(q.completedAt);
      return qDate.toDateString() === date.toDateString();
    });
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      xp: dayQuests.reduce((sum: number, q: any) => sum + q.xpEarned, 0),
      quests: dayQuests.length,
      gold: dayQuests.reduce((sum: number, q: any) => sum + q.goldEarned, 0),
    };
  });

  // Last 30 days trend
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dayQuests = (player.questHistory || []).filter((q: any) => {
      const qDate = new Date(q.completedAt);
      return qDate.toDateString() === date.toDateString();
    });
    return {
      date: date.getDate(),
      quests: dayQuests.length,
    };
  });

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="glass-card border-primary/30">
          <CardContent className="pt-4 sm:pt-6 text-center">
            <Award className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-primary" />
            <div className="text-xl sm:text-2xl font-bold">{player.level}</div>
            <div className="text-xs text-muted-foreground">Level</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-accent/30">
          <CardContent className="pt-4 sm:pt-6 text-center">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-accent" />
            <div className="text-xl sm:text-2xl font-bold">{player.xp}</div>
            <div className="text-xs text-muted-foreground">Total XP</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-gold/30">
          <CardContent className="pt-4 sm:pt-6 text-center">
            <Coins className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gold" />
            <div className="text-xl sm:text-2xl font-bold">{player.gold}</div>
            <div className="text-xs text-muted-foreground">Gold</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-leisure/30">
          <CardContent className="pt-4 sm:pt-6 text-center">
            <Zap className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-leisure" />
            <div className="text-xl sm:text-2xl font-bold">{player.streak}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Analytics */}
      <Card className="glass-card">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl">Analytics</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Track your progress</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="quests" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <PieChartIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Quests</span>
              </TabsTrigger>
              <TabsTrigger value="economy" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Economy</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                    30-Day Activity
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Your consistency</CardDescription>
                </CardHeader>
                <CardContent className="px-2 sm:px-6">
                  {last30Days.some(d => d.quests > 0) ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={last30Days}>
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))"
                          style={{ fontSize: '10px' }}
                          interval="preserveStartEnd"
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          style={{ fontSize: '10px' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="quests" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          name="Quests"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground text-xs sm:text-sm">
                      Complete quests to see trend
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                    7-Day Activity
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">This week</CardDescription>
                </CardHeader>
                <CardContent className="px-2 sm:px-6">
                  {last7Days.some(d => d.xp > 0) ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={last7Days}>
                        <XAxis 
                          dataKey="day" 
                          stroke="hsl(var(--muted-foreground))"
                          style={{ fontSize: '10px' }}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          style={{ fontSize: '10px' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }} 
                        />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Bar dataKey="xp" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="XP" />
                        <Bar dataKey="quests" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} name="Quests" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground text-xs sm:text-sm">
                      Complete quests this week
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quests Tab */}
            <TabsContent value="quests">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Quest Distribution
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">By category</CardDescription>
                </CardHeader>
                <CardContent className="px-2 sm:px-6">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="value"
                          style={{ fontSize: '11px' }}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-muted-foreground text-xs sm:text-sm">
                      Complete quests to see distribution
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Economy Tab */}
            <TabsContent value="economy" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                    Gold Flow
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Wealth management</CardDescription>
                </CardHeader>
                <CardContent className="px-2 sm:px-6">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={goldFlowData} barSize={60}>
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '11px', fontWeight: 500 }}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '10px' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '12px'
                        }}
                        formatter={(value: number) => [value, 'Gold']}
                      />
                      <Bar 
                        dataKey="value" 
                        radius={[8, 8, 0, 0]} 
                        label={{ position: 'top', fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 'bold' }}
                      >
                        {goldFlowData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <Card className="glass-card border-gold/30">
                  <CardContent className="pt-4 sm:pt-6 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gold">{goldEarned}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Earned</div>
                  </CardContent>
                </Card>
                <Card className="glass-card border-leisure/30">
                  <CardContent className="pt-4 sm:pt-6 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-leisure">{goldSpent}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Spent</div>
                  </CardContent>
                </Card>
                <Card className="glass-card border-primary/30">
                  <CardContent className="pt-4 sm:pt-6 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-primary">{player.gold}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Balance</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};