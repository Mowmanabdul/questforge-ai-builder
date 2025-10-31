import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Brain, Dumbbell, BookOpen, Users, Briefcase, DollarSign, Palette } from "lucide-react";
import { Quest } from "@/hooks/useGameState";

interface QuickActionsProps {
  onAddQuest: (quest: Omit<Quest, 'id' | 'completed' | 'createdAt'>) => void;
}

const QUICK_ACTIONS = [
  { 
    category: "Work", 
    icon: Briefcase, 
    color: "text-blue-500", 
    bgColor: "bg-blue-500/10 hover:bg-blue-500/20",
    borderColor: "border-blue-500/30",
    tasks: [
      { name: "Email Inbox Zero", xp: 50, description: "Clear and organize your email inbox" },
      { name: "Update Documentation", xp: 50, description: "Document recent project changes" },
      { name: "Team Meeting", xp: 30, description: "Attend and participate in team sync" },
    ]
  },
  { 
    category: "Health", 
    icon: Dumbbell, 
    color: "text-green-500",
    bgColor: "bg-green-500/10 hover:bg-green-500/20",
    borderColor: "border-green-500/30",
    tasks: [
      { name: "30-Min Workout", xp: 50, description: "Complete a full workout session" },
      { name: "Drink 8 Glasses of Water", xp: 30, description: "Stay hydrated throughout the day" },
      { name: "Meal Prep", xp: 50, description: "Prepare healthy meals for the week" },
    ]
  },
  { 
    category: "Learning", 
    icon: BookOpen, 
    color: "text-purple-500",
    bgColor: "bg-purple-500/10 hover:bg-purple-500/20",
    borderColor: "border-purple-500/30",
    tasks: [
      { name: "Read for 30 Minutes", xp: 30, description: "Reading session from book or articles" },
      { name: "Complete Online Course Module", xp: 80, description: "Finish a course section" },
      { name: "Practice New Skill", xp: 50, description: "Dedicated practice time" },
    ]
  },
  { 
    category: "Social", 
    icon: Users, 
    color: "text-pink-500",
    bgColor: "bg-pink-500/10 hover:bg-pink-500/20",
    borderColor: "border-pink-500/30",
    tasks: [
      { name: "Call a Friend", xp: 30, description: "Catch up with someone you care about" },
      { name: "Family Time", xp: 50, description: "Quality time with family" },
      { name: "Networking Event", xp: 50, description: "Attend or organize social gathering" },
    ]
  },
];

export const QuickActions = ({ onAddQuest }: QuickActionsProps) => {
  const handleQuickAdd = (category: string, task: typeof QUICK_ACTIONS[0]['tasks'][0]) => {
    onAddQuest({
      name: task.name,
      description: task.description,
      category,
      xp: task.xp,
      priority: 'medium',
    });
  };

  return (
    <Card className="glass-card border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent/10">
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-lg">Quick Quest Templates</CardTitle>
            <CardDescription>Add common quests with one click</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {QUICK_ACTIONS.map((action) => (
          <div key={action.category} className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <action.icon className={`w-4 h-4 ${action.color}`} />
              <h3 className="font-semibold text-sm">{action.category}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {action.tasks.map((task, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className={`${action.bgColor} ${action.borderColor} border justify-start h-auto py-2 px-3 transition-all hover:scale-105`}
                  onClick={() => handleQuickAdd(action.category, task)}
                >
                  <div className="text-left w-full">
                    <div className="font-medium text-xs">{task.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                        {task.xp} XP
                      </Badge>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
