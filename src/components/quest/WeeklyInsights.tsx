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
    <Card className="glass-card border-insight/30 glow-primary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-insight/10">
              <Sparkles className="w-6 h-6 text-insight" />
            </div>
            <div>
              <CardTitle className="text-xl">AI Weekly Insights</CardTitle>
              <CardDescription>Your personalized performance coach</CardDescription>
            </div>
          </div>
          <Button
            onClick={generateInsights}
            disabled={loading || player.questHistory?.length === 0}
            variant="outline"
            size="sm"
            className="border-insight/50 hover:bg-insight/10"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            {insights ? 'Refresh' : 'Generate'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-insight" />
              <p className="text-sm text-muted-foreground">Analyzing your journey...</p>
            </div>
          </div>
        ) : insights ? (
          <div className="p-4 rounded-lg bg-muted/30 border border-insight/20">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{insights}</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              {player.questHistory?.length === 0 
                ? "Complete some quests first to get AI-powered insights about your progress!"
                : "Click the button above to get personalized insights about your weekly performance."}
            </p>
            {player.questHistory?.length > 0 && (
              <p className="text-xs text-muted-foreground">
                💡 Free while using Gemini models (until Oct 13)
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
