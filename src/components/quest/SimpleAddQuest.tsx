import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Sparkles, 
  Target, 
  Calendar,
  Star,
  Lightbulb,
  Wand2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SimpleAddQuestProps {
  onAddQuest: (quest: any) => void;
}

const CATEGORIES = [
  { name: "Work", icon: "💼" },
  { name: "Health", icon: "💚" },
  { name: "Learning", icon: "📚" },
  { name: "Personal", icon: "🎯" },
  { name: "Social", icon: "👥" },
  { name: "Creative", icon: "🎨" },
];

const TEMPLATES = [
  { name: "Daily Review", category: "Work", xp: 25 },
  { name: "30min Exercise", category: "Health", xp: 75 },
  { name: "Read for 20min", category: "Learning", xp: 50 },
  { name: "Call Family", category: "Social", xp: 50 },
];

export const SimpleAddQuest = ({ onAddQuest }: SimpleAddQuestProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    xp: 50,
    priority: "medium" as const,
  });

  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onAddQuest({
      ...formData,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    });

    // Reset form
    setFormData({
      name: "",
      description: "",
      category: "",
      xp: 50,
      priority: "medium",
    });
    setIsExpanded(false);
  };

  const handleTemplateSelect = (template: typeof TEMPLATES[0]) => {
    setFormData({
      ...formData,
      name: template.name,
      category: template.category,
      xp: template.xp,
    });
    setShowTemplates(false);
    nameInputRef.current?.focus();
  };

  const handleQuickAdd = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="space-y-4" data-form-section="add-quest">
      {/* Clean Header Section */}
      <div className="space-y-4">
        {/* Main Action */}
        <div className="text-center space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Create New Quest</h2>
            <p className="text-muted-foreground">Turn your goals into actionable quests</p>
          </div>
          
          <Button
            onClick={handleQuickAdd}
            variant="outline"
            size="default"
            className="glass-card border-border/40 hover:border-primary/40 bg-card/50 hover:bg-card/70"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Quest
          </Button>
        </div>
      </div>

      {/* Expanded Form */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-4 card-default border border-border/50 shadow-lg">
              {/* Quest Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Quest Name *</label>
                <Input
                  ref={nameInputRef}
                  id="questName"
                  placeholder="What do you want to accomplish?"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="h-12 text-base glass-card bg-transparent border-border/60 focus-visible:border-primary/50"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Description (Optional)</label>
                <Textarea
                  placeholder="Add details about your quest..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[80px] glass-card bg-transparent border-border/60 focus-visible:border-primary/50 resize-none"
                />
              </div>

              {/* Category Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">Category *</label>
                <div className="grid grid-cols-3 gap-3">
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category.name}
                      type="button"
                      variant={formData.category === category.name ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, category: category.name }))}
                      className={cn(
                        "h-16 px-3 flex flex-col items-center justify-center gap-2",
                        formData.category === category.name 
                          ? "bg-primary text-primary-foreground border-primary shadow-lg" 
                          : "hover:bg-primary/5 hover:border-primary/30 border-border/60"
                      )}
                    >
                      <span className="text-2xl">{category.icon}</span>
                      <span className="text-xs font-semibold">{category.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* XP Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">XP Reward</label>
                <div className="grid grid-cols-5 gap-2">
                  {[25, 50, 100, 150, 250].map((xp) => (
                    <Button
                      key={xp}
                      type="button"
                      variant={formData.xp === xp ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, xp }))}
                      className={cn(
                        "h-14 flex flex-col items-center justify-center gap-1",
                        formData.xp === xp 
                          ? "bg-primary border-primary shadow-lg" 
                          : "border-border/60 hover:bg-primary/5 hover:border-primary/30"
                      )}
                    >
                      <Star className={cn(
                        "icon-sm",
                        formData.xp === xp ? "text-primary-foreground" : "text-primary"
                      )} />
                      <span className="text-xs font-bold">{xp}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-6 border-t border-border/30">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsExpanded(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.name.trim() || !formData.category}
                  variant="gradient"
                  size="lg"
                  className="flex-[2]"
                >
                  <Target className="icon-sm mr-2" />
                  Create Quest
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
