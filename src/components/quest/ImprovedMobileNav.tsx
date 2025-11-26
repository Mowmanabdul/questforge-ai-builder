import React from "react";
import { Home, Target, Archive, Sparkles, Gift, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ImprovedMobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onQuickAdd?: () => void;
}

export const ImprovedMobileNav = ({ activeTab, onTabChange, onQuickAdd }: ImprovedMobileNavProps) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  // Auto-hide on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { id: "home", icon: Home, label: "Home", color: "text-primary" },
    { id: "quests", icon: Target, label: "Quests", color: "text-accent" },
    { id: "archive", icon: Archive, label: "Archive", color: "text-leisure" },
    { id: "rewards", icon: Gift, label: "Rewards", color: "text-gold" },
    { id: "coach", icon: Sparkles, label: "Coach", color: "text-insight" },
  ];

  return (
    <>
      {/* Bottom Navigation */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe"
          >
            {/* Enhanced Backdrop with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80 backdrop-blur-2xl" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            
            {/* Navigation content */}
            <nav className="relative px-6 py-4" role="navigation" aria-label="Main navigation">
              <div className="flex items-center justify-between max-w-lg mx-auto">
                {navItems.map(({ id, icon: Icon, label, color }, index) => {
                  const isActive = activeTab === id;
                  
                  return (
                    <motion.button
                      key={id}
                      onClick={() => onTabChange(id)}
                      className={cn(
                        "flex flex-col items-center gap-2 py-3 px-4 rounded-2xl transition-all duration-300 relative group",
                        "min-w-0 flex-1 max-w-20",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                      aria-label={label}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {/* Active indicator with enhanced styling */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-t from-primary/15 via-primary/10 to-primary/5 border border-primary/40 rounded-2xl shadow-lg shadow-primary/20"
                          transition={{ type: "spring", damping: 25, stiffness: 400 }}
                        />
                      )}
                      
                      {/* Glow effect for active tab */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                      
                      {/* Icon with enhanced animation */}
                      <motion.div
                        animate={{
                          scale: isActive ? 1.2 : 1,
                          y: isActive ? -2 : 0
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="relative z-10"
                      >
                        <Icon className={cn(
                          "icon-lg transition-all duration-300",
                          isActive ? "text-primary drop-shadow-lg" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                      </motion.div>
                      
                      {/* Label with better typography */}
                      <motion.span
                        animate={{
                          opacity: isActive ? 1 : 0.7,
                          y: isActive ? 0 : 2
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className={cn(
                          "text-xs font-bold truncate transition-all duration-300 relative z-10",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      >
                        {label}
                      </motion.span>
                      
                      {/* Notification dot for quests tab */}
                      {id === "quests" && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Floating Action Button with Context Menu */}
      {onQuickAdd && (
        <AnimatePresence>
          {isVisible && activeTab === "quests" && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.2, type: "spring", damping: 20, stiffness: 300 }}
              className="md:hidden fixed bottom-24 right-4 z-40"
            >
              <div className="relative">
                <Button
                  onClick={onQuickAdd}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-2xl hover:shadow-3xl transition-all duration-300 group border-4 border-background/20"
                  aria-label="Add new quest"
                >
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <Plus className="icon-xl text-primary-foreground drop-shadow-sm" />
                  </motion.div>
                </Button>
                
                {/* Floating ring animation */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent animate-pulse" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Gesture indicator */}
      <div className="md:hidden fixed bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-border rounded-full mb-1 opacity-30" />
    </>
  );
};
