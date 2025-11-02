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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 safe-area-inset-bottom">
      <nav className="flex items-center justify-around px-2 py-2" role="navigation" aria-label="Main navigation">
        {navItems.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant="ghost"
            size="sm"
            onClick={() => onTabChange(id)}
            className={cn(
              "flex flex-col items-center gap-1 h-auto py-2 px-3 flex-1 min-w-0",
              "transition-all duration-200",
              activeTab === id
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label={label}
            aria-current={activeTab === id ? "page" : undefined}
          >
            <Icon className={cn(
              "w-5 h-5 transition-transform",
              activeTab === id && "scale-110"
            )} />
            <span className="text-[10px] font-medium truncate w-full text-center">
              {label}
            </span>
          </Button>
        ))}
      </nav>
    </div>
  );
};
