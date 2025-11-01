import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Sparkles, Zap, Trophy } from "lucide-react";

interface EmptyStateGuideProps {
  onGetStarted: () => void;
}

export const EmptyStateGuide = ({ onGetStarted }: EmptyStateGuideProps) => {
  return (
    <Card className="glass-card border-primary/30 glow-primary overflow-hidden animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-leisure/5 animate-pulse" />
      <CardContent className="pt-12 pb-12 text-center relative">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Hero Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 animate-float">
              <Target className="w-16 h-16 text-primary" />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Welcome, Hero!
            </h2>
            <p className="text-lg text-muted-foreground">
              Your quest log is empty. Time to begin your journey! 🎯
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-all">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm mb-1">Gamify Tasks</h3>
              <p className="text-xs text-muted-foreground">
                Turn your daily tasks into exciting quests
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-accent/30 transition-all">
              <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="font-semibold text-sm mb-1">Earn Rewards</h3>
              <p className="text-xs text-muted-foreground">
                Gain XP, gold, and unlock achievements
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-secondary/30 transition-all">
              <Trophy className="w-8 h-8 text-secondary mx-auto mb-2" />
              <h3 className="font-semibold text-sm mb-1">Level Up</h3>
              <p className="text-xs text-muted-foreground">
                Track progress and celebrate milestones
              </p>
            </div>
          </div>

          {/* CTA */}
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="px-8 py-6 text-lg font-semibold animate-pulse hover:scale-105 transition-transform"
          >
            <Target className="w-5 h-5 mr-2" />
            Create Your First Quest
          </Button>

          {/* Quick Tips */}
          <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20 text-left">
            <p className="text-xs font-semibold text-foreground mb-2">💡 Quick Tips:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Set priorities: Higher priority quests give more XP</li>
              <li>• Complete quests daily to maintain your streak</li>
              <li>• Ask the AI Coach for personalized suggestions</li>
              <li>• Check the rewards section for motivation boosts</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
