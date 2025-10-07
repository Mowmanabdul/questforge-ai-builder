import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Star, Sparkles, Lock } from "lucide-react";
import { Achievement } from "@/hooks/useGameState";

interface AchievementsGalleryProps {
  achievements: Achievement[];
}

const RARITY_COLORS = {
  common: 'border-muted-foreground/50 text-muted-foreground',
  rare: 'border-blue-500 text-blue-500',
  epic: 'border-purple-500 text-purple-500',
  legendary: 'border-gold text-gold',
};

const CATEGORY_ICONS = {
  quests: Trophy,
  streak: Star,
  xp: Sparkles,
  gold: Award,
  special: Award,
};

export const AchievementsGallery = ({ achievements }: AchievementsGalleryProps) => {
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Stats */}
      <Card className="glass-card border-gold/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Trophy className="w-6 h-6 text-gold" />
                Achievements
              </CardTitle>
              <CardDescription className="mt-2">
                Track your progress and unlock rewards
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gold">
                {unlockedCount}/{totalCount}
              </div>
              <p className="text-xs text-muted-foreground">Unlocked</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={(unlockedCount / totalCount) * 100} className="h-3" />
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const Icon = CATEGORY_ICONS[achievement.category];
          const isUnlocked = !!achievement.unlockedAt;
          const progress = (achievement.progress / achievement.target) * 100;

          return (
            <Card
              key={achievement.id}
              className={`glass-card border-2 transition-all ${
                isUnlocked
                  ? `${RARITY_COLORS[achievement.rarity]} hover:glow-gold`
                  : 'border-muted/30 opacity-60'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${
                    isUnlocked ? 'bg-gold/10' : 'bg-muted/30'
                  }`}>
                    {isUnlocked ? (
                      <Icon className="w-6 h-6 text-gold" />
                    ) : (
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={RARITY_COLORS[achievement.rarity]}
                  >
                    {achievement.rarity}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-3">{achievement.name}</CardTitle>
                <CardDescription className="text-xs">
                  {achievement.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">
                      {achievement.progress}/{achievement.target}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                {isUnlocked && achievement.unlockedAt && (
                  <p className="text-xs text-muted-foreground text-center">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
