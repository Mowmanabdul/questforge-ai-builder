import { Home, Target, Archive, Sparkles, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileBottomNav = ({ activeTab, onTabChange }: MobileBottomNavProps) => {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "quests", icon: Target, label: "Quests" },
    { id: "archive", icon: Archive, label: "Archive" },
    { id: "coach", icon: Sparkles, label: "Coach" },
    { id: "rewards", icon: Gift, label: "Rewards" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/98 backdrop-blur-xl border-t-2 border-border/60 z-50 safe-area-inset-bottom shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
      <nav className="relative flex items-center justify-around px-2 py-3" role="navigation" aria-label="Main navigation">
        {navItems.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant="ghost"
            size="sm"
            onClick={() => onTabChange(id)}
            className={cn(
              "flex flex-col items-center gap-1.5 h-auto py-2 px-3 flex-1 min-w-0 rounded-xl",
              "transition-all duration-300",
              activeTab === id
                ? "text-primary bg-primary/15 shadow-lg scale-105 border-2 border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
            aria-label={label}
            aria-current={activeTab === id ? "page" : undefined}
          >
            <Icon className={cn(
              "w-5 h-5 transition-all duration-300",
              activeTab === id && "scale-110 drop-shadow-lg"
            )} />
            <span className={cn(
              "text-[10px] font-semibold truncate w-full text-center transition-all",
              activeTab === id && "text-primary"
            )}>
              {label}
            </span>
          </Button>
        ))}
      </nav>
    </div>
  );
};
