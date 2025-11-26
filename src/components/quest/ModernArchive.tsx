import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCcw, Trash2, Search, Filter, Calendar, Award, Target } from "lucide-react";
import { Quest } from "@/hooks/useGameState";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ModernArchiveProps {
  quests: Quest[];
  onRestore: (questId: string) => void;
  onPermanentDelete: (questId: string) => void;
}

const getCategoryIcon = (category: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    "work": <Target className="w-4 h-4" />,
    "health": <Award className="w-4 h-4" />,
    "personal": <Calendar className="w-4 h-4" />,
    "learning": <Search className="w-4 h-4" />,
  };
  return iconMap[category.toLowerCase()] || <Target className="w-4 h-4" />;
};

export const ModernArchive = ({ quests, onRestore, onPermanentDelete }: ModernArchiveProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "name" | "xp">("date");

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(quests.map(q => q.category));
    return Array.from(cats).sort();
  }, [quests]);

  // Filter and sort quests
  const filteredQuests = useMemo(() => {
    let filtered = quests;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q => 
        q.name.toLowerCase().includes(query) ||
        q.description?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(q => q.category === categoryFilter);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0);
        case "name":
          return a.name.localeCompare(b.name);
        case "xp":
          return b.xp - a.xp;
        default:
          return 0;
      }
    });

    return filtered;
  }, [quests, searchQuery, categoryFilter, sortBy]);

  const QuestItem = ({ quest, index }: { quest: Quest; index: number }) => (
    <motion.div
      key={quest.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition-all duration-300",
        "bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-sm",
        "hover:from-card/90 hover:via-card/70 hover:to-card/50",
        "hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1",
        "border-border/30"
      )}
    >
      {/* Priority indicator - left border accent */}
      <div className={cn(
        "absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl",
        quest.priority === "high" && "bg-gradient-to-b from-destructive via-destructive/80 to-destructive/50",
        quest.priority === "medium" && "bg-gradient-to-b from-amber-500 via-amber-500/80 to-amber-500/50",
        quest.priority === "low" && "bg-gradient-to-b from-blue-500 via-blue-500/80 to-blue-500/50"
      )} />
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>
      
      <div className="relative p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {getCategoryIcon(quest.category)}
            <h3 className="font-semibold text-sm sm:text-base truncate">{quest.name}</h3>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-br from-primary/15 via-primary/10 to-accent/15 border border-primary/30 shadow-md shrink-0">
              <span className="text-xs font-bold text-primary">+{quest.xp} XP</span>
            </div>
          </div>
          
          {quest.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {quest.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{quest.completedAt ? format(quest.completedAt, "MMM d, yyyy") : "Unknown"}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {quest.category}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {quest.priority}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRestore(quest.id)}
            className="bg-background hover:bg-primary hover:text-primary-foreground"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Restore
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPermanentDelete(quest.id)}
            className="bg-background hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Compact Filters Section - Content First */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground icon-sm" />
          <Input
            placeholder="Search completed quests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 glass-card border-border/60 focus-visible:border-primary/50 bg-transparent"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48 h-12 glass-card border-border/60 bg-transparent">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-40 h-12 glass-card border-border/60 bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">By Date</SelectItem>
            <SelectItem value="name">By Name</SelectItem>
            <SelectItem value="xp">By XP</SelectItem>
          </SelectContent>
        </Select>

        {/* Quest count */}
        <Badge variant="outline" className="h-12 px-4 text-sm font-semibold">
          {filteredQuests.length} {filteredQuests.length === 1 ? 'quest' : 'quests'}
        </Badge>
      </div>

      {/* Quest List */}
      {filteredQuests.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="text-4xl">🏆</div>
          <div>
            <h3 className="text-lg font-semibold">No completed quests found</h3>
            <p className="text-muted-foreground">
              {searchQuery || categoryFilter !== "all" 
                ? "Try adjusting your filters" 
                : "Complete some quests to see them here"}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredQuests.map((quest, index) => (
              <QuestItem key={quest.id} quest={quest} index={index} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
