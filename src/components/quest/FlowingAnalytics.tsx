import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Award, Target, Flame, Star, Calendar, Clock, Zap, Trophy, Activity, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FlowingAnalyticsProps {
  player: any;
}

export const FlowingAnalytics = ({ player }: FlowingAnalyticsProps) => {
  // Prepare data
  const categoryData = Object.entries(
    (player.questHistory || []).reduce((acc: any, q: any) => {
      acc[q.category] = (acc[q.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--gold))', 'hsl(var(--accent))', 'hsl(var(--leisure))', 'hsl(var(--insight))'];

  // Weekly activity data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayQuests = (player.questHistory || []).filter((q: any) => {
      const qDate = new Date(q.completedAt);
      return qDate.toDateString() === date.toDateString();
    });
    return {
      day: date.toLocaleDateString('en', { weekday: 'short' }),
      quests: dayQuests.length,
      xp: dayQuests.reduce((sum: number, q: any) => sum + q.xp, 0)
    };
  });

  // Enhanced metrics calculation
  const totalQuests = (player.questHistory || []).length;
  const totalXP = (player.questHistory || []).reduce((sum: number, q: any) => sum + q.xp, 0);
  const currentStreak = player.streak || 0;
  const avgQuestsPerDay = totalQuests > 0 ? (totalQuests / Math.max(1, (player.accountAge || 1))).toFixed(1) : 0;
  
  // Performance trends
  const thisWeekQuests = (player.questHistory || []).filter((q: any) => {
    const qDate = new Date(q.completedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return qDate >= weekAgo;
  }).length;
  
  const lastWeekQuests = (player.questHistory || []).filter((q: any) => {
    const qDate = new Date(q.completedAt);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return qDate >= twoWeeksAgo && qDate < weekAgo;
  }).length;
  
  const weeklyTrend = thisWeekQuests - lastWeekQuests;
  const weeklyTrendPercentage = lastWeekQuests > 0 ? ((weeklyTrend / lastWeekQuests) * 100).toFixed(1) : 0;

  const enhancedStats = [
    {
      label: "Quests Completed",
      value: totalQuests,
      subValue: `${avgQuestsPerDay} avg/day`,
      change: weeklyTrend > 0 ? `+${weeklyTrend} this week` : weeklyTrend < 0 ? `${weeklyTrend} this week` : "No change",
      changeType: weeklyTrend > 0 ? "positive" : weeklyTrend < 0 ? "negative" : "neutral",
      icon: Target,
      color: "bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-600"
    },
    {
      label: "Current Streak", 
      value: `${currentStreak}`,
      subValue: "days active",
      change: currentStreak > 0 ? `${currentStreak > 7 ? '🔥' : '⚡'} Strong!` : "Start today!",
      changeType: currentStreak > 0 ? "positive" : "neutral",
      icon: Flame,
      color: "bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-600"
    },
    {
      label: "Total XP Earned",
      value: totalXP,
      subValue: `${Math.round(totalXP / Math.max(1, totalQuests))} avg/quest`,
      change: totalXP > 1000 ? "🏆 Champion!" : totalXP > 500 ? "💫 Rising Star!" : "🌱 Growing",
      changeType: "positive", 
      icon: Zap,
      color: "bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-600"
    },
    {
      label: "Weekly Progress",
      value: `${thisWeekQuests}`,
      subValue: "quests this week",
      change: weeklyTrendPercentage !== "0" ? `${weeklyTrend > 0 ? '+' : ''}${weeklyTrendPercentage}%` : "Steady",
      changeType: weeklyTrend > 0 ? "positive" : weeklyTrend < 0 ? "negative" : "neutral",
      icon: Activity,
      color: "bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30 text-green-600"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Compact Stats Quadrant - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-4">
        {enhancedStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "relative p-3 rounded-2xl border transition-all duration-300 group cursor-pointer overflow-hidden",
                stat.color
              )}
            >
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <motion.div 
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>
                </div>
                
                <div>
                  <div className="text-xl font-bold mb-0.5">
                    {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
                  </div>
                  <p className="text-xs font-medium opacity-90">{stat.label}</p>
                  <p className="text-[10px] opacity-60 mt-0.5">{stat.subValue}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts section - compact side by side layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity chart - spans 2 columns */}
        <div className="lg:col-span-2 space-y-3">
          <div>
            <h3 className="text-base font-semibold text-foreground">Weekly Activity</h3>
            <p className="text-xs text-muted-foreground">Quest completion pattern</p>
          </div>
          
          <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/20">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={last7Days}>
                <defs>
                  <linearGradient id="colorQuests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="quests" 
                  stroke="hsl(var(--primary))" 
                  fill="url(#colorQuests)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="space-y-3">
          <div>
            <h3 className="text-base font-semibold text-foreground">Focus Areas</h3>
            <p className="text-xs text-muted-foreground">Quest distribution</p>
          </div>
          
          <div className="space-y-2">
            {categoryData.slice(0, 5).map((category, index) => {
              const percentage = ((category.value as number) / categoryData.reduce((sum, c) => sum + (c.value as number), 0)) * 100;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-xs">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold">{category.value as number}</span>
                    <span className="text-xs text-muted-foreground">({percentage.toFixed(0)}%)</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
