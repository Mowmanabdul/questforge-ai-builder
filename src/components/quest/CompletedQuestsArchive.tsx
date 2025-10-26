import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCcw, Trash2, Search, Filter } from "lucide-react";
import { Quest } from "@/hooks/useGameState";
import { format } from "date-fns";

interface CompletedQuestsArchiveProps {
  quests: Quest[];
  onRestore: (questId: string) => void;
  onPermanentDelete: (questId: string) => void;
}

export const CompletedQuestsArchive = ({ quests, onRestore, onPermanentDelete }: CompletedQuestsArchiveProps) => {
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

  return (
    <Card className="glass-card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">
          Completed Quests Archive
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({filteredQuests.length} of {quests.length})
          </span>
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Your quest history - restore quests or permanently delete them
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search quests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-background/50">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(val) => setSortBy(val as "date" | "name" | "xp")}>
            <SelectTrigger className="w-full sm:w-[180px] bg-background/50">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Recent First</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="xp">XP (High-Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-3">
          {filteredQuests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {quests.length === 0 ? (
                <>
                  <p className="text-lg mb-2">No completed quests yet</p>
                  <p className="text-sm">Complete some quests to see them here!</p>
                </>
              ) : (
                <>
                  <p className="text-lg mb-2">No quests match your search</p>
                  <p className="text-sm">Try a different search term or filter</p>
                </>
              )}
            </div>
          ) : (
            filteredQuests.map((quest) => (
              <div
                key={quest.id}
                className="glass-card p-4 rounded-lg border-primary/20 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold truncate">{quest.name}</h3>
                    </div>
                    {quest.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{quest.description}</p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {quest.category}
                      </Badge>
                      {quest.priority && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {quest.priority === 'high' && '🔴'}
                          {quest.priority === 'medium' && '🟡'}
                          {quest.priority === 'low' && '🟢'}
                          {' '}{quest.priority}
                        </Badge>
                      )}
                      <span className="text-xs text-secondary font-semibold">
                        {quest.xp} XP
                      </span>
                      {quest.completedAt && (
                        <span className="text-xs text-muted-foreground">
                          {format(quest.completedAt, 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRestore(quest.id)}
                      className="hover:bg-primary/10"
                    >
                      <RotateCcw className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Restore</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onPermanentDelete(quest.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};