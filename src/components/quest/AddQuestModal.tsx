import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddQuestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddQuest: (quest: any) => void;
}

const CATEGORIES = [
  { name: "Work", icon: "💼", color: "from-blue-500/20 to-blue-600/20 border-blue-500/30" },
  { name: "Health", icon: "💚", color: "from-green-500/20 to-green-600/20 border-green-500/30" },
  { name: "Learning", icon: "📚", color: "from-purple-500/20 to-purple-600/20 border-purple-500/30" },
  { name: "Personal", icon: "🎯", color: "from-primary/20 to-primary/30 border-primary/30" },
  { name: "Social", icon: "👥", color: "from-pink-500/20 to-pink-600/20 border-pink-500/30" },
  { name: "Creative", icon: "🎨", color: "from-amber-500/20 to-amber-600/20 border-amber-500/30" },
];

const XP_OPTIONS = [25, 50, 75, 100, 150, 200];

export const AddQuestModal = ({ open, onOpenChange, onAddQuest }: AddQuestModalProps) => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    category: string;
    xp: number;
    priority: "low" | "medium" | "high";
    dueDate: string;
  }>({
    name: "",
    description: "",
    category: "",
    xp: 50,
    priority: "medium",
    dueDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category) return;

    onAddQuest({
      ...formData,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: formData.dueDate || undefined,
    });

    // Reset form
    setFormData({
      name: "",
      description: "",
      category: "",
      xp: 50,
      priority: "medium",
      dueDate: "",
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      xp: 50,
      priority: "medium",
      dueDate: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] glass-card border-border/60">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Create New Quest
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Quest Name */}
          <div className="space-y-1">
            <Label htmlFor="quest-name" className="text-sm font-medium">
              Quest Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="quest-name"
              placeholder="What do you want to accomplish?"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="h-9 text-sm glass-card bg-transparent border-border/60 focus-visible:border-primary/50"
              autoFocus
            />
          </div>

          {/* Category Selection - 3 Column Grid */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">
              Category <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-1.5">
              {CATEGORIES.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: category.name }))}
                  className={cn(
                    "relative p-1.5 rounded-lg border transition-all duration-200",
                    "flex flex-col items-center gap-0.5 hover:scale-105",
                    "bg-gradient-to-br backdrop-blur-sm",
                    formData.category === category.name
                      ? `${category.color} border-opacity-100 shadow-md scale-105`
                      : "from-card/50 to-card/30 border-border/30 hover:border-border/50"
                  )}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-[10px] font-medium leading-tight">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority & Due Date Row */}
          <div className="grid grid-cols-2 gap-2">
            {/* Priority */}
            <div className="space-y-1">
              <Label className="text-sm font-medium">Priority</Label>
              <div className="grid grid-cols-3 gap-1">
                {(['low', 'medium', 'high'] as const).map((priority) => {
                  const isSelected = formData.priority === priority;
                  const selectedStyles = 
                    priority === 'high' ? "bg-destructive/20 border-destructive/50 text-destructive" :
                    priority === 'medium' ? "bg-amber-500/20 border-amber-500/50 text-amber-600" :
                    "bg-blue-500/20 border-blue-500/50 text-blue-600";
                  
                  return (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priority }))}
                      className={cn(
                        "py-1.5 px-1 rounded-lg border transition-all duration-200 text-[10px] font-medium capitalize",
                        isSelected ? selectedStyles : "bg-card/50 border-border/30 hover:border-border/50"
                      )}
                    >
                      {priority}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1">
              <Label htmlFor="quest-due-date" className="text-sm font-medium">
                Due Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <Input
                  id="quest-due-date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="pl-8 h-8 text-xs glass-card bg-transparent border-border/60 focus-visible:border-primary/50"
                />
              </div>
            </div>
          </div>

          {/* XP Selection - Compact */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">XP Reward</Label>
            <div className="grid grid-cols-6 gap-1.5">
              {XP_OPTIONS.map((xp) => (
                <button
                  key={xp}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, xp }))}
                  className={cn(
                    "py-1.5 rounded-lg border transition-all duration-300 text-xs font-semibold",
                    formData.xp === xp
                      ? "bg-primary/20 border-primary/50 text-primary shadow-md scale-105"
                      : "bg-card/50 border-border/30 hover:border-border/50 hover:scale-105"
                  )}
                >
                  {xp}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1 h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.name.trim() || !formData.category}
              className="flex-1 h-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl"
            >
              Create Quest
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
