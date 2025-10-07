import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Flame, Zap, Coins } from "lucide-react";

interface PersonalRecordsProps {
  records: {
    longestStreak: number;
    mostQuestsInDay: number;
    highestLevel: number;
    totalGoldEarned: number;
  };
}

export const PersonalRecords = ({ records }: PersonalRecordsProps) => {
  // Provide fallback defaults in case records is undefined
  const safeRecords = records || {
    longestStreak: 0,
    mostQuestsInDay: 0,
    highestLevel: 1,
    totalGoldEarned: 0,
  };

  const recordsData = [
    {
      label: "Longest Streak",
      value: `${safeRecords.longestStreak} days`,
      icon: Flame,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/30",
    },
    {
      label: "Most Quests (One Day)",
      value: safeRecords.mostQuestsInDay,
      icon: Zap,
      color: "text-leisure",
      bgColor: "bg-leisure/10",
      borderColor: "border-leisure/30",
    },
    {
      label: "Highest Level",
      value: safeRecords.highestLevel,
      icon: Trophy,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
    },
    {
      label: "Total Gold Earned",
      value: safeRecords.totalGoldEarned,
      icon: Coins,
      color: "text-gold",
      bgColor: "bg-gold/10",
      borderColor: "border-gold/30",
    },
  ];

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Trophy className="w-5 h-5 text-gold" />
          Personal Records
        </CardTitle>
        <CardDescription>Your all-time best achievements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recordsData.map((record, idx) => (
            <div
              key={idx}
              className={`text-center p-4 rounded-lg border-2 ${record.borderColor} ${record.bgColor} transition-all hover:scale-105`}
            >
              <record.icon className={`w-8 h-8 mx-auto mb-2 ${record.color}`} />
              <div className="text-2xl font-bold mb-1">{record.value}</div>
              <div className="text-xs text-muted-foreground">{record.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
