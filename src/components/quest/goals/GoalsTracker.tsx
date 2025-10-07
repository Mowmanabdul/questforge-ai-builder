import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Plus, CheckCircle2, Trophy } from "lucide-react";
import { useState } from "react";
import { Goal } from "@/hooks/useGameState";
import { useToast } from "@/hooks/use-toast";

interface GoalsTrackerProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'current' | 'createdAt' | 'completedAt'>) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const GoalsTracker = ({ goals, onAddGoal, onDeleteGoal }: GoalsTrackerProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target: '100',
    type: 'quests' as Goal['type'],
    category: '',
  });

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.target) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    onAddGoal({
      name: formData.name,
      description: formData.description,
      target: parseInt(formData.target),
      type: formData.type,
      category: formData.type === 'category_quests' ? formData.category : undefined,
    });

    setFormData({ name: '', description: '', target: '100', type: 'quests', category: '' });
    setIsDialogOpen(false);
    toast({ title: "Goal created successfully!" });
  };

  const activeGoals = goals.filter(g => !g.completedAt);
  const completedGoals = goals.filter(g => g.completedAt);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="glass-card border-accent/30">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Target className="w-6 h-6 text-accent" />
                Goals
              </CardTitle>
              <CardDescription className="mt-2">
                Set and track your long-term objectives
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  New Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create a New Goal</DialogTitle>
                  <DialogDescription>
                    Set a long-term objective to work towards
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goalName">Goal Name</Label>
                    <Input
                      id="goalName"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Complete 100 Work Quests"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="What motivates this goal?"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goalType">Goal Type</Label>
                    <Select value={formData.type} onValueChange={(value: Goal['type']) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quests">Total Quests</SelectItem>
                        <SelectItem value="category_quests">Category Quests</SelectItem>
                        <SelectItem value="xp">Total XP</SelectItem>
                        <SelectItem value="gold">Total Gold</SelectItem>
                        <SelectItem value="streak">Streak Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.type === 'category_quests' && (
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Work, Fitness"
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="target">Target</Label>
                    <Input
                      id="target"
                      type="number"
                      value={formData.target}
                      onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                      placeholder="100"
                      min="1"
                    />
                  </div>
                  <Button onClick={handleSubmit} className="w-full">
                    Create Goal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGoals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <Card key={goal.id} className="glass-card border-accent/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                        {goal.description && (
                          <CardDescription className="text-xs mt-1">
                            {goal.description}
                          </CardDescription>
                        )}
                      </div>
                      <Badge variant="outline" className="text-accent border-accent/50">
                        {goal.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">
                          {goal.current}/{goal.target}
                        </span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <p className="text-xs text-center text-muted-foreground">
                        {Math.round(progress)}% Complete
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => onDeleteGoal(goal.id)}
                    >
                      Remove Goal
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold" />
              Completed Goals ({completedGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-gold/30"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold" />
                    <div>
                      <p className="font-medium">{goal.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Completed {goal.completedAt && new Date(goal.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-gold border-gold/50">
                    {goal.target} / {goal.target}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeGoals.length === 0 && completedGoals.length === 0 && (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first goal to stay motivated and track long-term progress!
            </p>
            <Button onClick={() => setIsDialogOpen(true)} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
