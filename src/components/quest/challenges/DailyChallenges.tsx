import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Flame, Coins, Zap, CheckCircle2, Trophy } from "lucide-react";
import { DailyChallenge } from "@/hooks/useGameState";

interface DailyChallengesProps {
  challenges: DailyChallenge[];
  onClaim: (challengeId: string) => void;
}

export const DailyChallenges = ({ challenges, onClaim }: DailyChallengesProps) => {
  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);

  return (
    <Card className="glass-card border-leisure/30 glow-leisure">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Flame className="w-6 h-6 text-leisure animate-pulse" />
          Daily Challenges
        </CardTitle>
        <CardDescription>
          Complete special challenges for bonus rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeChallenges.length === 0 && completedChallenges.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No challenges available today. Check back tomorrow!</p>
          </div>
        ) : (
          <>
            {/* Active Challenges */}
            {activeChallenges.map((challenge) => (
              <Card
                key={challenge.id}
                className="border-2 border-leisure/40 hover:border-leisure transition-all"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{challenge.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {challenge.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-leisure border-leisure/50">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Progress placeholder - would need to be calculated based on actual progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">0/{challenge.requirement.count}</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-primary border-primary/50 text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        +{challenge.reward.xp} XP
                      </Badge>
                      <Badge variant="outline" className="text-gold border-gold/50 text-xs">
                        <Coins className="w-3 h-3 mr-1" />
                        +{challenge.reward.gold} Gold
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Completed Challenges */}
            {completedChallenges.map((challenge) => (
              <Card
                key={challenge.id}
                className="border-2 border-gold/40 bg-gold/5"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-gold" />
                        {challenge.name}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {challenge.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-gold border-gold/50">
                      Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-primary border-primary/50 text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        +{challenge.reward.xp} XP
                      </Badge>
                      <Badge variant="outline" className="text-gold border-gold/50 text-xs">
                        <Coins className="w-3 h-3 mr-1" />
                        +{challenge.reward.gold} Gold
                      </Badge>
                    </div>
                    <Button size="sm" onClick={() => onClaim(challenge.id)}>
                      Claim Reward
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};
