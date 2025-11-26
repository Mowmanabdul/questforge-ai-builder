import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Flame, Settings, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ModernHeaderProps {
  player: any;
  quests: any[];
  onSettingsClick: () => void;
  activeTab: string;
}

export const ModernHeader = ({ player, quests, onSettingsClick, activeTab }: ModernHeaderProps) => {
  const activeQuests = quests.filter(q => !q.completed).length;
  const nextLevelXP = player.level * 100;
  const xpProgress = (player.xp / nextLevelXP) * 100;
  
  return (
    <header className="relative overflow-hidden">
      {/* Background with gradient and animated elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-2xl translate-y-16 -translate-x-16" />
      
      <div className="relative z-10 px-4 py-5 sm:px-6 lg:px-8">
        {/* Profile section - more compact */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <Avatar className="w-12 h-12 border-2 border-primary/30 shadow-lg">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`} />
              <AvatarFallback className="bg-primary/20 text-primary font-bold text-base">
                {player.name?.[0]?.toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            {player.prestigeLevel > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-gold to-gold/80 rounded-full flex items-center justify-center border-2 border-background">
                <Crown className="w-2.5 h-2.5 text-gold-foreground" />
              </div>
            )}
          </div>
          
          <div className="space-y-1 flex-1">
            <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              {player.name || 'Adventurer'}
            </h1>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary text-xs px-2 py-0">
                Level {player.level}
              </Badge>
              {player.streak > 0 && (
                <div className="flex items-center gap-1 text-sm text-accent">
                  <Flame className="w-3.5 h-3.5" />
                  <span className="font-semibold text-xs">{player.streak} day streak</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* XP Progress bar - more compact */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress to Level {player.level + 1}</span>
            <span className="font-semibold text-primary">{player.xp}/{nextLevelXP} XP</span>
          </div>
          <div className="relative">
            <Progress value={xpProgress} className="h-2 bg-muted/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-sm" />
          </div>
        </div>
      </div>
    </header>
  );
};
