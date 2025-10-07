import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface WeeklyInsightsProps {
  player: any;
  quests: any[];
}

export const WeeklyInsights = ({ player, quests }: WeeklyInsightsProps) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateInsights = async () => {
    setLoading(true);
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentQuests = (player.questHistory || [])
        .filter((q: any) => new Date(q.completedAt) >= sevenDaysAgo)
        .slice(0, 20);

      const categoryBreakdown = recentQuests.reduce((acc: any, q: any) => {
        acc[q.category] = (acc[q.category] || 0) + 1;
        return acc;
      }, {});

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-weekly-insights`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            playerData: {
              level: player.level,
              xp: player.xp,
              gold: player.gold,
              streak: player.streak,
              completedQuests: player.completedQuests,
            },
            questData: {
              recentQuests: recentQuests.map((q: any) => ({
                title: q.title,
                category: q.category,
                xp: q.xpEarned,
                gold: q.goldEarned,
                completedAt: q.completedAt,
              })),
              categoryBreakdown,
            },
          }),
        }
      );

      if (response.status === 429) {
        toast({
          title: "Rate limit exceeded",
          description: "Please wait a moment before generating new insights.",
          variant: "destructive",
        });
        return;
      }

      if (response.status === 402) {
        toast({
          title: "AI credits depleted",
          description: "Please add credits in Settings to continue using AI features.",
          variant: "destructive",
        });
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const data = await response.json();
      setInsights(data.insights);
      toast({
        title: "✨ Insights generated!",
        description: "Your personalized weekly report is ready.",
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass-card border-insight/30">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-insight/10">
                <Sparkles className="w-8 h-8 text-insight" />
              </div>
              <div>
                <CardTitle className="text-2xl">AI Performance Coach</CardTitle>
                <CardDescription className="text-base mt-1">
                  Get personalized insights and recommendations
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={generateInsights}
              disabled={loading || player.questHistory?.length === 0}
              size="lg"
              className="gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              {insights ? 'Get New Insights' : 'Generate Insights'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-insight" />
                <div>
                  <p className="text-base font-medium">Analyzing your journey...</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This may take a few moments
                  </p>
                </div>
              </div>
            </div>
          ) : insights ? (
            <div className="space-y-4">
              <div className="p-6 rounded-lg bg-gradient-to-br from-insight/10 to-primary/5 border border-insight/20">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{insights}</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="w-3 h-3" />
                <span>Powered by AI • Free during beta</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-insight/10 mb-4">
                <Sparkles className="w-10 h-10 text-insight" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {player.questHistory?.length === 0 
                  ? "Start Your Journey"
                  : "Ready to Unlock Insights"}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                {player.questHistory?.length === 0 
                  ? "Complete some quests to unlock personalized AI insights about your progress, patterns, and areas for improvement."
                  : "Click the button above to get AI-powered analysis of your weekly performance, personalized recommendations, and actionable tips."}
              </p>
              {player.questHistory?.length > 0 && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 text-xs">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span>Free while using Gemini models (until Oct 13)</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
