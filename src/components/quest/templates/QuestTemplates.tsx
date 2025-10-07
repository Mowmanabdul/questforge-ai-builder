import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Dumbbell, BookOpen, Coffee, Briefcase, Heart, Zap } from "lucide-react";
import { Quest } from "@/hooks/useGameState";
import { useToast } from "@/hooks/use-toast";

interface QuestTemplatesProps {
  onUseTemplate: (quest: Omit<Quest, 'id' | 'completed' | 'createdAt'>) => void;
}

const TEMPLATES: Array<Omit<Quest, 'id' | 'completed' | 'createdAt'>> = [
  // Work/Productivity
  { name: 'Deep Work Session', category: 'Work', xp: 100, priority: 'high' },
  { name: 'Clear Email Inbox', category: 'Work', xp: 50, priority: 'medium' },
  { name: 'Team Meeting', category: 'Work', xp: 60, priority: 'medium' },
  { name: 'Code Review', category: 'Work', xp: 80, priority: 'high' },
  
  // Fitness/Health
  { name: 'Morning Workout', category: 'Fitness', xp: 100, priority: 'high', recurring: { frequency: 'daily' } },
  { name: '30-Minute Run', category: 'Fitness', xp: 80, priority: 'medium' },
  { name: 'Yoga Session', category: 'Fitness', xp: 70, priority: 'medium' },
  { name: 'Drink 8 Glasses of Water', category: 'Health', xp: 40, priority: 'low', recurring: { frequency: 'daily' } },
  
  // Learning
  { name: 'Read 30 Pages', category: 'Learning', xp: 80, priority: 'high', recurring: { frequency: 'daily' } },
  { name: 'Online Course Lesson', category: 'Learning', xp: 100, priority: 'high' },
  { name: 'Practice New Skill', category: 'Learning', xp: 90, priority: 'medium' },
  { name: 'Watch Educational Video', category: 'Learning', xp: 50, priority: 'low' },
  
  // Personal/Mindfulness
  { name: 'Morning Meditation', category: 'Mindfulness', xp: 60, priority: 'high', recurring: { frequency: 'daily' } },
  { name: 'Journal Entry', category: 'Personal', xp: 50, priority: 'medium', recurring: { frequency: 'daily' } },
  { name: 'Gratitude Practice', category: 'Mindfulness', xp: 40, priority: 'low' },
  { name: 'Evening Reflection', category: 'Personal', xp: 50, priority: 'low' },
  
  // Social
  { name: 'Call Family/Friend', category: 'Social', xp: 60, priority: 'medium' },
  { name: 'Send Thank You Message', category: 'Social', xp: 30, priority: 'low' },
  { name: 'Social Activity', category: 'Social', xp: 80, priority: 'medium' },
  
  // Household
  { name: 'Clean Workspace', category: 'Household', xp: 40, priority: 'low' },
  { name: 'Meal Prep', category: 'Household', xp: 70, priority: 'medium' },
  { name: 'Organize Digital Files', category: 'Household', xp: 50, priority: 'low' },
];

const CATEGORY_ICONS: Record<string, any> = {
  Work: Briefcase,
  Fitness: Dumbbell,
  Health: Heart,
  Learning: BookOpen,
  Mindfulness: Sparkles,
  Personal: Heart,
  Social: Coffee,
  Household: Zap,
};

const CATEGORY_COLORS: Record<string, string> = {
  Work: 'border-primary/50 hover:border-primary',
  Fitness: 'border-accent/50 hover:border-accent',
  Health: 'border-leisure/50 hover:border-leisure',
  Learning: 'border-insight/50 hover:border-insight',
  Mindfulness: 'border-primary/50 hover:border-primary',
  Personal: 'border-gold/50 hover:border-gold',
  Social: 'border-leisure/50 hover:border-leisure',
  Household: 'border-accent/50 hover:border-accent',
};

export const QuestTemplates = ({ onUseTemplate }: QuestTemplatesProps) => {
  const { toast } = useToast();

  const handleUseTemplate = (template: Omit<Quest, 'id' | 'completed' | 'createdAt'>) => {
    onUseTemplate(template);
    toast({
      title: "Template added!",
      description: `"${template.name}" has been added to your active quests.`,
    });
  };

  // Group templates by category
  const groupedTemplates = TEMPLATES.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, typeof TEMPLATES>);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass-card border-primary/30">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Quest Templates
          </CardTitle>
          <CardDescription>
            Quick-start your journey with pre-built quests
          </CardDescription>
        </CardHeader>
      </Card>

      {Object.entries(groupedTemplates).map(([category, templates]) => {
        const Icon = CATEGORY_ICONS[category] || Sparkles;
        const colorClass = CATEGORY_COLORS[category] || 'border-primary/50';

        return (
          <Card key={category} className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon className="w-5 h-5" />
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates.map((template, idx) => (
                  <Card
                    key={idx}
                    className={`border-2 transition-all ${colorClass}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm flex-1">
                          {template.name}
                        </CardTitle>
                        {template.priority && (
                          <Badge
                            variant="outline"
                            className={
                              template.priority === 'high'
                                ? 'border-destructive text-destructive'
                                : template.priority === 'medium'
                                ? 'border-primary text-primary'
                                : 'border-muted-foreground text-muted-foreground'
                            }
                          >
                            {template.priority}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">XP Reward</span>
                        <span className="font-semibold text-primary">{template.xp} XP</span>
                      </div>
                      {template.recurring && (
                        <Badge variant="outline" className="text-xs">
                          Repeats {template.recurring.frequency}
                        </Badge>
                      )}
                      <Button
                        onClick={() => handleUseTemplate(template)}
                        className="w-full"
                        size="sm"
                      >
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
