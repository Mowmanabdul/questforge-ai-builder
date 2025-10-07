import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Award, Coins, Zap } from "lucide-react";

interface AnalyticsChartsProps {
  player: any;
}

export const AnalyticsCharts = ({ player }: AnalyticsChartsProps) => {
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
    'hsl(267, 84%, 64%)', // primary
    'hsl(43, 96%, 56%)', // gold
    'hsl(142, 71%, 45%)', // accent
    'hsl(330, 81%, 60%)', // leisure
    'hsl(190, 95%, 56%)', // insight
    'hsl(240, 6%, 60%)', // muted
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
    { name: 'Earned', value: goldEarned, fill: 'hsl(43, 96%, 56%)' },
    { name: 'Spent', value: goldSpent, fill: 'hsl(330, 81%, 60%)' },
    { name: 'Current', value: player.gold, fill: 'hsl(267, 84%, 64%)' },
  ];

  // XP progress over last 7 days (simulated)
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
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Stats Overview Cards */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Quest Distribution
          </CardTitle>
          <CardDescription>Your focus across different categories</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Complete quests to see your distribution
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gold Flow */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-gold" />
            Gold Management
          </CardTitle>
          <CardDescription>Your wealth flow breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          {goldFlowData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={goldFlowData}>
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {goldFlowData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Start completing quests to track gold
            </div>
          )}
        </CardContent>
      </Card>

      {/* Last 7 Days Activity */}
      <Card className="glass-card lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            7-Day Activity
          </CardTitle>
          <CardDescription>Your XP and quest completion over the last week</CardDescription>
        </CardHeader>
        <CardContent>
          {last7Days.some(d => d.xp > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last7Days}>
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="xp" fill="hsl(267, 84%, 64%)" radius={[8, 8, 0, 0]} name="XP Earned" />
                <Bar dataKey="quests" fill="hsl(142, 71%, 45%)" radius={[8, 8, 0, 0]} name="Quests Done" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Complete quests this week to see your activity
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="glass-card lg:col-span-2">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
              <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{player.level}</div>
              <div className="text-xs text-muted-foreground">Level</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/10 border border-accent/20">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-accent" />
              <div className="text-2xl font-bold">{player.xp}</div>
              <div className="text-xs text-muted-foreground">Total XP</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gold/10 border border-gold/20">
              <Coins className="w-8 h-8 mx-auto mb-2 text-gold" />
              <div className="text-2xl font-bold">{player.gold}</div>
              <div className="text-xs text-muted-foreground">Current Gold</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-leisure/10 border border-leisure/20">
              <Zap className="w-8 h-8 mx-auto mb-2 text-leisure" />
              <div className="text-2xl font-bold">{player.streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
