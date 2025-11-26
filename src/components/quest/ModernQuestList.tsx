import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  Flame, 
  Zap, 
  Search, 
  Calendar,
  Edit2,
  Trash2,
  MessageCircle,
  Clock,
  Filter,
  ArrowUpDown,
  Settings,
  Bell,
  Star,
  Grid3X3,
  List,
  Plus,
  Target,
  Trophy,
  ChevronDown,
  X,
  SortAsc,
  FilterX
} from "lucide-react";
import { Quest } from "@/hooks/useGameState";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ModernQuestListProps {
  quests: Quest[];
  dailyFocus: string;
  onCompleteQuest: (id: string) => void;
  onEditQuest?: (id: string) => void;
  onDeleteQuest?: (id: string) => void;
  onAskAI?: (quest: Quest) => void;
  selectedQuests?: string[];
  onSelectQuest?: (id: string) => void;
  onSettingsClick?: () => void;
}

const QuestItem = ({ 
  quest, 
  dailyFocus, 
  onComplete, 
  onEdit, 
  onDelete, 
  onAskAI,
  isSelected,
  onSelect,
  viewMode = 'list'
}: any) => {
  const isFocused = quest.category === dailyFocus;
  const [isHovered, setIsHovered] = useState(false);
  
  const getDueDateInfo = () => {
    if (!quest.dueDate) return null;
    const date = new Date(quest.dueDate);
    
    if (isPast(date) && !isToday(date)) {
      return { status: 'overdue', label: 'Overdue', color: 'text-destructive' };
    }
    if (isToday(date)) {
      return { status: 'today', label: 'Today', color: 'text-primary' };
    }
    if (isTomorrow(date)) {
      return { status: 'tomorrow', label: 'Tomorrow', color: 'text-accent' };
    }
    return { status: 'future', label: format(date, 'MMM d'), color: 'text-muted-foreground' };
  };
  
  const dueDateInfo = getDueDateInfo();
  const subtasks = quest.subtasks || [];
  const completedSubtasks = subtasks.filter((st: any) => st.completed).length;
  const hasSubtasks = subtasks.length > 0;
  const subtaskProgress = hasSubtasks ? (completedSubtasks / subtasks.length) * 100 : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        "group relative rounded-2xl border transition-all duration-300",
        "bg-gradient-to-br from-background/80 via-background/90 to-background/80 backdrop-blur-sm",
        "hover:shadow-xl hover:shadow-primary/10 hover:bg-background/95",
        "border-border/50 hover:border-primary/40",
        // Layout adjustments
        viewMode === 'grid' 
          ? "flex flex-col p-6 h-full" 
          : "flex items-center gap-4 p-6",
        // Focus styling
        isFocused && "border-primary/50 bg-gradient-to-br from-primary/8 via-primary/4 to-accent/8 shadow-lg shadow-primary/15",
        // Priority indicators
        quest.priority === 'high' && "border-l-4 border-l-red-400/70 shadow-red-100/20",
        quest.priority === 'medium' && "border-l-4 border-l-amber-400/70 shadow-amber-100/20", 
        quest.priority === 'low' && "border-l-4 border-l-blue-400/70 shadow-blue-100/20",
        // Selection styling
        isSelected && "border-primary/60 bg-primary/10 shadow-lg shadow-primary/20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: viewMode === 'grid' ? 1.02 : 1.01, y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Selection checkbox */}
      {onSelect && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        />
      )}
      
      {/* Quest content */}
      <div className={cn("flex-1 min-w-0", viewMode === 'grid' ? "space-y-3" : "space-y-2")}>
        <div className={cn("flex gap-3", viewMode === 'grid' ? "flex-col" : "items-center flex-wrap")}>
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className={cn(
              "font-bold text-foreground bg-gradient-to-r from-foreground via-primary/80 to-foreground bg-clip-text tracking-tight leading-tight",
              viewMode === 'grid' ? "text-lg line-clamp-2" : "text-xl line-clamp-1"
            )}>
              {quest.name}
            </h3>
            
            {isFocused && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 via-accent/15 to-primary/20 text-primary text-sm font-semibold border border-primary/40 shadow-lg backdrop-blur-sm"
              >
                <Flame className="w-3 h-3 animate-pulse" />
                <span className="hidden sm:inline">Daily Focus</span>
              </motion.div>
            )}
          </div>
          
          <div className={cn("flex gap-2", viewMode === 'grid' ? "flex-wrap justify-start" : "flex-wrap")}>
            <Badge variant="outline" className="text-xs font-medium bg-gradient-to-r from-muted/40 to-muted/20 border-primary/30 text-muted-foreground hover:text-foreground transition-colors backdrop-blur-sm">
              {quest.category}
            </Badge>
            
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/25 backdrop-blur-sm">
              <Star className="w-3 h-3 text-primary fill-primary/30" />
              <span className="text-xs font-semibold text-primary">{quest.xp} XP</span>
              {isFocused && (
                <span className="text-xs font-medium text-accent bg-accent/25 px-1.5 py-0.5 rounded-full border border-accent/40">
                  +25%
                </span>
              )}
            </div>
            
            {quest.priority && (
              <Badge className={cn(
                "text-xs font-semibold capitalize px-2 py-0.5",
                quest.priority === 'high' && "bg-gradient-to-r from-red-100 to-red-50 border-red-300 text-red-700",
                quest.priority === 'medium' && "bg-gradient-to-r from-amber-100 to-amber-50 border-amber-300 text-amber-700",
                quest.priority === 'low' && "bg-gradient-to-r from-blue-100 to-blue-50 border-blue-300 text-blue-700"
              )}>
                {quest.priority}
              </Badge>
            )}
          </div>
        </div>
        
        {quest.description && (
          <p className={cn(
            "text-muted-foreground/90 leading-relaxed font-normal",
            viewMode === 'grid' ? "text-sm line-clamp-3" : "text-sm line-clamp-2"
          )}>
            {quest.description}
          </p>
        )}
        
        {/* Meta information */}
        <div className={cn("flex gap-3 text-xs", viewMode === 'grid' ? "flex-wrap" : "items-center")}>
          {dueDateInfo && (
            <div className={cn("flex items-center gap-1 px-2 py-1 rounded-md bg-muted/30", dueDateInfo.color)}>
              <Calendar className="w-3 h-3" />
              <span className="font-medium">{dueDateInfo.label}</span>
            </div>
          )}
          
          {hasSubtasks && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted/30 text-muted-foreground">
              <CheckCircle2 className="w-3 h-3" />
              <span className="font-medium">{completedSubtasks}/{subtasks.length} tasks</span>
            </div>
          )}
        </div>
        
        {/* Subtask progress */}
        {hasSubtasks && (
          <div className="space-y-1">
            <Progress value={subtaskProgress} className="h-1.5" />
          </div>
        )}
      </div>
      
      {/* Actions section */}
      <div className={cn(
        "flex gap-2 transition-all duration-200",
        viewMode === 'grid' ? "flex-col mt-auto pt-3 border-t border-border/30" : "items-center",
        viewMode === 'list' && (isHovered || isSelected ? "opacity-100" : "opacity-0")
      )}>
        {/* Action buttons */}
        <div className={cn("flex gap-1", viewMode === 'grid' ? "justify-center" : "")}>
          {onAskAI && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => onAskAI(quest)}
              className="h-8 px-3 backdrop-blur-sm border border-border/50 hover:border-primary/30"
              title="Ask AI Coach"
            >
              <MessageCircle className="w-3 h-3" />
              {viewMode === 'grid' && <span className="ml-1 text-xs">AI</span>}
            </Button>
          )}
          {onEdit && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => onEdit(quest.id)}
              className="h-8 px-3 backdrop-blur-sm border border-border/50 hover:border-primary/30"
              title="Edit Quest"
            >
              <Edit2 className="w-3 h-3" />
              {viewMode === 'grid' && <span className="ml-1 text-xs">Edit</span>}
            </Button>
          )}
          {onDelete && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => onDelete(quest.id)}
              className="h-8 px-3 text-destructive hover:text-destructive backdrop-blur-sm border border-border/50 hover:border-destructive/30"
              title="Delete Quest"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        {/* Complete button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={viewMode === 'grid' ? "w-full" : ""}
        >
          <Button 
            onClick={() => onComplete(quest.id)}
            className={cn(
              "bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:via-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold",
              viewMode === 'grid' ? "w-full py-3 h-auto" : "px-6 py-2 h-auto"
            )}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Complete Quest
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const ModernQuestList = ({ 
  quests, 
  dailyFocus, 
  onCompleteQuest, 
  onEditQuest, 
  onDeleteQuest, 
  onAskAI,
  selectedQuests = [],
  onSelectQuest,
  onSettingsClick 
}: ModernQuestListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'xp' | 'name'>('priority');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Advanced filtering and sorting
  const filteredQuests = quests
    .filter(quest => {
      // Search filter
      const searchMatch = !searchQuery || 
        quest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quest.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quest.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const categoryMatch = categoryFilter === 'all' || quest.category === categoryFilter;
      
      // Priority filter
      const priorityMatch = priorityFilter === 'all' || quest.priority === priorityFilter;
      
      return searchMatch && categoryMatch && priorityMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
                 (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'xp':
          return b.xp - a.xp;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  // Get unique categories for filter dropdown
  const categories = [...new Set(quests.map(q => q.category))].sort();

  return (
    <div className="space-y-6">
      {/* Flowing Header Section - Matches Home Design */}
      <div className="relative overflow-hidden">
        {/* Background with gradient and animated elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-2xl translate-y-16 -translate-x-16" />
        
        <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-sm" />
                  <div className="relative p-2 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground via-primary/80 to-foreground bg-clip-text tracking-tight">
                    Quest Command Center
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-muted-foreground text-lg font-medium">
                      {filteredQuests.length} active quest{filteredQuests.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-700 shadow-sm">
                        <Trophy className="w-3 h-3 mr-1" />
                        {quests.filter(q => q.priority === 'high').length} High Priority
                      </Badge>
                      <Badge variant="outline" className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 text-amber-700 shadow-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {quests.filter(q => q.dueDate && new Date(q.dueDate) <= new Date(Date.now() + 24*60*60*1000)).length} Due Soon
                      </Badge>
                      <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700 shadow-sm">
                        <Star className="w-3 h-3 mr-1" />
                        {quests.reduce((sum, q) => sum + q.xp, 0)} Total XP
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {dailyFocus && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 backdrop-blur-sm shadow-lg"
                >
                  <Flame className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-sm font-semibold text-primary">
                    Daily Focus: {dailyFocus}
                  </span>
                </motion.div>
              )}
              
              {/* Settings and notification buttons to match home */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative backdrop-blur-sm border border-border/50 hover:border-primary/30">
                  <Bell className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
                </Button>
                {onSettingsClick && (
                  <Button variant="ghost" size="icon" onClick={onSettingsClick} className="backdrop-blur-sm border border-border/50 hover:border-primary/30">
                    <Settings className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Advanced Search & Filter Controls */}
          <div className="space-y-4">
            <div className="flex gap-3 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search quests by name, description, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base bg-background/80 border-2 border-primary/20 focus-visible:border-primary/50 focus-visible:ring-primary/20 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                />
                {searchQuery && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {/* Advanced Filter Menu */}
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`h-12 px-4 bg-background/80 border-2 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${
                      categoryFilter !== 'all' || priorityFilter !== 'all' 
                        ? 'border-primary/50 bg-primary/5' 
                        : 'border-primary/20 hover:border-primary/50'
                    }`}
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                    {(categoryFilter !== 'all' || priorityFilter !== 'all') && (
                      <Badge className="ml-2 bg-primary/20 text-primary">Active</Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 bg-background/95 backdrop-blur-sm border border-primary/20" align="start">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Advanced Filters</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setCategoryFilter('all');
                          setPriorityFilter('all');
                        }}
                        className="text-xs"
                      >
                        <FilterX className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Priority</label>
                      <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All priorities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priorities</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="low">Low Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Sort Menu */}
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="h-12 w-40 bg-background/80 border-2 border-primary/20 hover:border-primary/50 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <SortAsc className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Sort by Priority</SelectItem>
                  <SelectItem value="dueDate">Sort by Due Date</SelectItem>
                  <SelectItem value="xp">Sort by XP Value</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-background/80 border-2 border-primary/20 rounded-xl p-1 shadow-sm">
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="h-10 px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="h-10 px-3"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Active Filters Display */}
            {(categoryFilter !== 'all' || priorityFilter !== 'all' || searchQuery) && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSearchQuery("")}
                      className="h-auto w-auto p-0 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
                {categoryFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {categoryFilter}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setCategoryFilter('all')}
                      className="h-auto w-auto p-0 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
                {priorityFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Priority: {priorityFilter}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPriorityFilter('all')}
                      className="h-auto w-auto p-0 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions & Daily Focus */}
      <div className="space-y-4">
        {/* Quick Action Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20 border border-muted/30">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              className="bg-background/80 hover:bg-primary/10 border-primary/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Quick Add Quest
            </Button>
            {selectedQuests.length > 0 && (
              <>
                <Separator orientation="vertical" className="h-6" />
                <span className="text-sm text-muted-foreground font-medium">
                  {selectedQuests.length} selected
                </span>
                <Button size="sm" variant="outline" className="text-xs">
                  Bulk Complete
                </Button>
                <Button size="sm" variant="outline" className="text-xs text-destructive">
                  Bulk Delete
                </Button>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-background/50">
              {quests.length} Total Quests
            </Badge>
            <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
              {Math.round((quests.filter(q => q.completed).length / Math.max(1, quests.length)) * 100)}% Complete
            </Badge>
          </div>
        </div>

        {/* Daily focus banner */}
        {dailyFocus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-gradient-to-r from-primary/15 via-primary/8 to-accent/15 border border-primary/30 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/30 shadow-inner">
                  <Flame className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <div>
                  <p className="text-lg font-bold text-primary">Today's Focus: {dailyFocus}</p>
                  <p className="text-sm text-muted-foreground">
                    Complete {dailyFocus} quests for +25% XP bonus! 
                    <span className="ml-2 font-semibold text-accent">
                      {quests.filter(q => q.category === dailyFocus && !q.completed).length} remaining
                    </span>
                  </p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-accent/20 to-primary/20 text-primary border-primary/40 px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                Focus Mode
              </Badge>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quest list - adaptive layout */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" 
        : "space-y-3"
      }>
        <AnimatePresence mode="popLayout">
          {filteredQuests.map((quest) => (
            <QuestItem
              key={quest.id}
              quest={quest}
              dailyFocus={dailyFocus}
              onComplete={onCompleteQuest}
              onEdit={onEditQuest}
              onDelete={onDeleteQuest}
              onAskAI={onAskAI}
              isSelected={selectedQuests.includes(quest.id)}
              onSelect={() => onSelectQuest?.(quest.id)}
              viewMode={viewMode}
            />
          ))}
        </AnimatePresence>
        
        {filteredQuests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 space-y-4"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-muted/20 to-muted/10 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-muted-foreground">No quests found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try adjusting your search terms' : 'Ready to add your first quest?'}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
