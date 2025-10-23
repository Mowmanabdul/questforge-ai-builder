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
  Trash2,
  Edit2,
  ArrowUpDown,
  MessageCircle
} from "lucide-react";
import { Quest } from "@/hooks/useGameState";
import { format } from "date-fns";

interface EnhancedQuestListProps {
  quests: Quest[];
  dailyFocus: string;
  onCompleteQuest: (questId: string) => void;
  onRushQuest?: (questId: string) => void;
  onDeleteQuest?: (questId: string) => void;
  onEditQuest?: (questId: string) => void;
  onAskAICoach?: (quest: Quest) => void;
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
  onEditQuest,
  onAskAICoach,
  dailyRushUsed = false,
  chronoLevel = 0,
  selectedQuests = [],
  onSelectQuest,
  onBulkComplete,
}: EnhancedQuestListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("priority");
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

  // Sort quests
  const sortedQuests = [...filteredQuests].sort((a, b) => {
    switch (sortBy) {
      case 'priority': {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority || 'medium'];
        const bPriority = priorityOrder[b.priority || 'medium'];
        return bPriority - aPriority;
      }
      case 'xp':
        return b.xp - a.xp;
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
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
          <div className="flex gap-2 flex-wrap">
            {selectedQuests.length > 0 && onBulkComplete && (
              <Button size="sm" onClick={onBulkComplete} variant="outline" className="whitespace-nowrap">
                <CheckCircle2 className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Complete Selected </span>({selectedQuests.length})
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Filters</span>
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

        {/* Filters & Sort */}
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

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-3 h-3" />
                    Priority
                  </div>
                </SelectItem>
                <SelectItem value="xp">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-3 h-3" />
                    XP Value
                  </div>
                </SelectItem>
                <SelectItem value="date">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-3 h-3" />
                    Date Created
                  </div>
                </SelectItem>
                <SelectItem value="name">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-3 h-3" />
                    Name (A-Z)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {(filterCategory !== "all" || filterPriority !== "all" || sortBy !== "priority") && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setFilterCategory("all");
                  setFilterPriority("all");
                  setSortBy("priority");
                }}
              >
                Reset
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
                className={`glass-card p-3 sm:p-4 rounded-lg card-hover ${
                  quest.category === dailyFocus ? 'border-primary/40 glow-primary' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  {onSelectQuest && (
                    <Checkbox
                      checked={selectedQuests.includes(quest.id)}
                      onCheckedChange={() => onSelectQuest(quest.id)}
                      className="mt-1"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-base sm:text-lg break-words">{quest.name}</h3>
                          {quest.category === dailyFocus && (
                            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 animate-icon-pulse" />
                          )}
                        </div>
                        {quest.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2 break-words line-clamp-2">{quest.description}</p>
                        )}
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs hover-scale-smooth">
                            {quest.category}
                          </Badge>
                          {quest.priority && (
                            <Badge variant="outline" className={`text-xs hover-scale-smooth ${getPriorityColor(quest.priority)}`}>
                              {quest.priority}
                            </Badge>
                          )}
                          {quest.dueDate && (
                            <Badge variant="outline" className="text-xs">
                              📅 {format(new Date(quest.dueDate), 'MMM d')}
                            </Badge>
                          )}
                          <span className="text-xs sm:text-sm text-secondary font-semibold flex items-center gap-1">
                            ⭐ {quest.xp} XP
                            {quest.category === dailyFocus && (
                              <span className="text-primary font-bold">(+25%)</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto sm:flex-shrink-0">
                    {onAskAICoach && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onAskAICoach(quest)}
                        className="flex-shrink-0 hover-scale-smooth h-9 w-9 sm:h-10 sm:w-10"
                        title="Ask AI Coach"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    )}
                    {onEditQuest && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEditQuest(quest.id)}
                        className="flex-shrink-0 hover-scale-smooth h-9 w-9 sm:h-10 sm:w-10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                    {onDeleteQuest && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDeleteQuest(quest.id)}
                        className="text-destructive hover:text-destructive flex-shrink-0 hover-scale-smooth h-9 w-9 sm:h-10 sm:w-10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    {onRushQuest && chronoLevel > 0 && !dailyRushUsed && (
                      <Button
                        size="sm"
                        onClick={() => onRushQuest(quest.id)}
                        variant="outline"
                        className="flex-shrink-0 hover-scale-smooth min-h-9 sm:min-h-10"
                      >
                        <Zap className="w-4 h-4 sm:mr-1.5" />
                        <span className="hidden sm:inline text-xs sm:text-sm">Rush</span>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => onCompleteQuest(quest.id)}
                      className="flex-1 sm:flex-initial hover-scale-smooth min-h-9 sm:min-h-10"
                    >
                      <CheckCircle2 className="w-4 h-4 sm:mr-1.5" />
                      <span className="hidden sm:inline text-xs sm:text-sm">Complete</span>
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
