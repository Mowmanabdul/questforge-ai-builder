import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PlusCircle, Calendar as CalendarIcon, Zap, Target, Sparkles, Plus, X, Clock, AlertTriangle, CheckCircle2, Wand2, Lightbulb } from "lucide-react";
import { format, addDays, isToday, isTomorrow } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ModernAddQuestFormProps {
  onAddQuest: (quest: any) => void;
}

const ENHANCED_CATEGORIES = [
  { name: "Work", icon: "💼", color: "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-600", description: "Professional tasks" },
  { name: "Health", icon: "💚", color: "bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/30 text-green-600", description: "Fitness & wellness" },
  { name: "Learning", icon: "📚", color: "bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-600", description: "Education & skills" },
  { name: "Personal", icon: "🎯", color: "bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-600", description: "Self-improvement" },
  { name: "Social", icon: "👥", color: "bg-gradient-to-r from-pink-500/20 to-pink-600/20 border-pink-500/30 text-pink-600", description: "Relationships" },
  { name: "Creative", icon: "🎨", color: "bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 border-indigo-500/30 text-indigo-600", description: "Art & creativity" },
];

const SMART_XP_SUGGESTIONS = {
  "5min": 25,
  "15min": 50,
  "30min": 75,
  "1hr": 100,
  "2hr": 150,
  "3hr+": 200,
  "daily": 50,
  "weekly": 100,
  "milestone": 250,
};

const PRIORITY_CONFIGS = [
  { value: "low", label: "Low Priority", color: "bg-gray-100 text-gray-700 border-gray-300", icon: "🔵" },
  { value: "medium", label: "Medium Priority", color: "bg-amber-100 text-amber-700 border-amber-300", icon: "🟡" },
  { value: "high", label: "High Priority", color: "bg-red-100 text-red-700 border-red-300", icon: "🔴" },
];

const QUICK_TEMPLATES = [
  { name: "Daily Review", category: "Work", xp: 25, priority: "medium", description: "Review daily goals and progress" },
  { name: "30min Exercise", category: "Health", xp: 75, priority: "high", description: "Physical activity session" },
  { name: "Read for 20min", category: "Learning", xp: 50, priority: "medium", description: "Educational reading time" },
  { name: "Call Family", category: "Social", xp: 50, priority: "low", description: "Connect with family members" },
];

const XP_PRESETS = [
  { label: "Quick Task", value: 25, description: "5-10 minutes", color: "bg-green-50 border-green-200 text-green-700" },
  { label: "Short Task", value: 50, description: "15-30 minutes", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { label: "Medium Task", value: 100, description: "1 hour", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { label: "Long Task", value: 150, description: "2+ hours", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { label: "Major Goal", value: 250, description: "Significant milestone", color: "bg-red-50 border-red-200 text-red-700" },
];

export const ModernAddQuestForm = ({ onAddQuest }: ModernAddQuestFormProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    xp: 50,
    priority: "medium" as "high" | "medium" | "low",
    dueDate: undefined as Date | undefined,
    timeEstimate: "",
    reminders: false,
  });

  // Auto-focus when expanded
  useEffect(() => {
    if (isExpanded && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isExpanded]);

  // Smart XP calculation based on task complexity
  const calculateSmartXP = (name: string, description: string, timeEstimate: string) => {
    let baseXP = 50;
    
    // Time-based calculation
    if (timeEstimate.includes("5min")) baseXP = 25;
    else if (timeEstimate.includes("15min")) baseXP = 50;
    else if (timeEstimate.includes("30min")) baseXP = 75;
    else if (timeEstimate.includes("1hr")) baseXP = 100;
    else if (timeEstimate.includes("2hr")) baseXP = 150;
    else if (timeEstimate.includes("3hr")) baseXP = 200;
    
    // Complexity indicators
    const complexityWords = ["research", "analyze", "create", "design", "plan", "strategy"];
    const hasComplexity = complexityWords.some(word => 
      name.toLowerCase().includes(word) || description.toLowerCase().includes(word)
    );
    
    if (hasComplexity) baseXP += 25;
    
    return baseXP;
  };

  // Apply template
  const applyTemplate = (template: typeof QUICK_TEMPLATES[0]) => {
    setFormData({
      ...formData,
      name: template.name,
      description: template.description,
      category: template.category,
      xp: template.xp,
      priority: template.priority as "high" | "medium" | "low",
    });
    setShowTemplates(false);
    setIsExpanded(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onAddQuest({
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category || "Personal",
      xp: formData.xp,
      priority: formData.priority,
      dueDate: formData.dueDate,
    });

    // Reset form
    setFormData({
      name: "",
      description: "",
      category: "",
      xp: 50,
      priority: "medium",
      dueDate: undefined,
      timeEstimate: "",
      reminders: false,
    });
    setIsExpanded(false);
  };

  const handleQuickAdd = (name: string, category: string) => {
    onAddQuest({
      name,
      description: "",
      category,
      xp: 50,
      priority: "medium",
      dueDate: undefined,
    });
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Smart Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text">
            Create New Quest
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Turn your goals into actionable quests
          </p>
        </div>
        
        {/* Quick Templates Toggle */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplates(!showTemplates)}
            className="backdrop-blur-sm border-primary/30 hover:border-primary/50"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setAiSuggesting(true);
              setTimeout(() => setAiSuggesting(false), 2000);
            }}
            disabled={aiSuggesting}
            className="backdrop-blur-sm border-primary/30 hover:border-primary/50"
          >
            <Wand2 className={`w-4 h-4 mr-2 ${aiSuggesting ? 'animate-spin' : ''}`} />
            AI Suggest
          </Button>
        </div>
      </div>

      {/* Quick Templates */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {QUICK_TEMPLATES.map((template, idx) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-primary/20 hover:border-primary/40"
                  onClick={() => applyTemplate(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-sm">{template.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{template.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline" className="bg-primary/10">
                          {template.xp} XP
                        </Badge>
                        <span className="text-muted-foreground">{template.category}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Add Bar */}
      {!isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Main add button */}
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary/60 bg-gradient-to-br from-primary/5 to-transparent hover:from-primary/10 transition-all duration-300 group"
          >
            <div className="flex items-center justify-center gap-3 text-primary">
              <div className="p-2 rounded-full bg-primary/20 group-hover:bg-primary/30 group-hover:scale-110 transition-all">
                <Plus className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Add New Quest</p>
                <p className="text-sm opacity-70">What do you want to accomplish?</p>
              </div>
            </div>
          </button>

          {/* Quick category buttons */}
          <div className="flex flex-wrap gap-2">
            {ENHANCED_CATEGORIES.map((category) => (
              <Button
                key={category.name}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdd(`New ${category.name} Quest`, category.name)}
                className={cn("h-8 px-3 text-xs font-medium transition-all hover:scale-105", category.color)}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Expanded form */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-2xl bg-gradient-to-br from-muted/20 to-muted/5 border border-border/50">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/20">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Create New Quest</h3>
                    <p className="text-sm text-muted-foreground">Define your next adventure</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Quest name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Quest Name</label>
                <Input
                  placeholder="What needs to be done?"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="h-12 text-base bg-background/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/50"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Description (Optional)</label>
                <Textarea
                  placeholder="Add more details about this quest..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[80px] bg-background/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
                />
              </div>

              {/* Category and XP row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {ENHANCED_CATEGORIES.map((category) => (
                      <button
                        key={category.name}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: category.name }))}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                          formData.category === category.name
                            ? "ring-2 ring-primary/50 bg-primary/20 text-primary"
                            : "bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span>{category.icon}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">XP Reward</label>
                  <div className="grid grid-cols-2 gap-2">
                    {XP_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, xp: preset.value }))}
                        className={cn(
                          "p-2 rounded-xl text-xs font-medium transition-all text-center",
                          formData.xp === preset.value
                            ? "ring-2 ring-gold/50 bg-gold/20 text-gold"
                            : "bg-muted/30 hover:bg-muted/50 text-muted-foreground"
                        )}
                      >
                        <div className="font-bold text-sm">{preset.value} XP</div>
                        <div className="opacity-70">{preset.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Priority and Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Priority</label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger className="h-11 bg-background/50 border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Low Priority</SelectItem>
                      <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                      <SelectItem value="high">🔴 High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Due Date (Optional)</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-11 w-full justify-start bg-background/50 border-0 font-normal"
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {formData.dueDate ? format(formData.dueDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dueDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Submit button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={!formData.name.trim()}
                  className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 font-semibold"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Create Quest
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsExpanded(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
