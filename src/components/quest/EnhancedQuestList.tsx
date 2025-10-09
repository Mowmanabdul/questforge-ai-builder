import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CheckCircle2, 
  Flame, 
  Zap, 
  Search, 
  Filter,
  Trash2
} from "lucide-react";
import { Quest } from "@/hooks/useGameState";
import { format } from "date-fns";

interface EnhancedQuestListProps {
  quests: Quest[];
  dailyFocus: string;
  onCompleteQuest: (questId: string) => void;
  onRushQuest?: (questId: string) => void;
  onDeleteQuest?: (questId: string) => void;
  dailyRushUsed?: boolean;
  chronoLevel?: number;
  selectedQuests?: string[];
  onSelectQuest?: (questId: string) => void;
  onBulkComplete?: () => void;
}

export const EnhancedQuestList = ({
  quests,
  dailyFocus,
  onCompleteQuest,
  onRushQuest,
  onDeleteQuest,
  dailyRushUsed = false,
  chronoLevel = 0,
  selectedQuests = [],
  onSelectQuest,
  onBulkComplete,
}: EnhancedQuestListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories
  const categories = Array.from(new Set(quests.map(q => q.category))).sort();

  // Filter quests
  const filteredQuests = quests.filter(quest => {
    const matchesSearch = quest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quest.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || quest.category === filterCategory;
    const matchesPriority = filterPriority === "all" || quest.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Sort quests: priority (high first)
  const sortedQuests = [...filteredQuests].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority || 'medium'];
    const bPriority = priorityOrder[b.priority || 'medium'];
    return bPriority - aPriority;
  });

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'border-destructive text-destructive';
      case 'medium': return 'border-primary text-primary';
      case 'low': return 'border-muted-foreground text-muted-foreground';
      default: return '';
    }
  };


  return (
    <Card className="glass-card p-6">
      <div className="mb-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-xl font-bold">
            Active Quests 
            {filteredQuests.length !== quests.length && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredQuests.length} of {quests.length})
              </span>
            )}
          </h2>
          <div className="flex gap-2">
            {selectedQuests.length > 0 && onBulkComplete && (
              <Button size="sm" onClick={onBulkComplete} variant="outline">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete Selected ({selectedQuests.length})
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search quests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex gap-3 flex-wrap p-4 rounded-lg border border-border bg-muted/30">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">🔴 High</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="low">🟢 Low</SelectItem>
              </SelectContent>
            </Select>

            {(filterCategory !== "all" || filterPriority !== "all") && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setFilterCategory("all");
                  setFilterPriority("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Daily Focus Banner */}
        {dailyFocus && (
          <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/30 rounded-lg">
            <Flame className="w-5 h-5 text-primary pulse-glow" />
            <div>
              <span className="text-sm font-semibold">Today's Focus: {dailyFocus}</span>
              <span className="text-xs text-muted-foreground ml-2">+25% XP Bonus</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {sortedQuests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">
              {searchTerm || filterCategory !== "all" || filterPriority !== "all"
                ? "No quests match your filters"
                : "No active quests"}
            </p>
            <p className="text-sm">
              {searchTerm || filterCategory !== "all" || filterPriority !== "all"
                ? "Try adjusting your search or filters"
                : "Add a quest above to begin your journey!"}
            </p>
          </div>
        ) : (
          sortedQuests.map((quest) => (
              <div
                key={quest.id}
                className={`glass-card p-4 rounded-lg transition-all hover:border-primary/50 ${
                  quest.category === dailyFocus ? 'border-primary/30 glow-primary' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {onSelectQuest && (
                    <Checkbox
                      checked={selectedQuests.includes(quest.id)}
                      onCheckedChange={() => onSelectQuest(quest.id)}
                      className="mt-1"
                    />
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold">{quest.name}</h3>
                          {quest.category === dailyFocus && (
                            <Flame className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {quest.category}
                          </Badge>
                          {quest.priority && (
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(quest.priority)}`}>
                              {quest.priority}
                            </Badge>
                          )}
                          <span className="text-xs text-secondary font-semibold">
                            {quest.xp} XP
                            {quest.category === dailyFocus && (
                              <span className="text-primary ml-1">(+25%)</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {onDeleteQuest && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDeleteQuest(quest.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    {onRushQuest && chronoLevel > 0 && !dailyRushUsed && (
                      <Button
                        size="sm"
                        onClick={() => onRushQuest(quest.id)}
                        variant="outline"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Rush
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => onCompleteQuest(quest.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Complete
                    </Button>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </Card>
  );
};
