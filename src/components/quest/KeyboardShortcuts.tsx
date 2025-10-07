import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface KeyboardShortcutsProps {
  onNewQuest: () => void;
  onToggleSearch?: () => void;
  onExportData?: () => void;
}

export const KeyboardShortcuts = ({ 
  onNewQuest, 
  onToggleSearch,
  onExportData 
}: KeyboardShortcutsProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Cmd/Ctrl + K: New Quest
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onNewQuest();
        toast({
          title: "Keyboard Shortcut",
          description: "Opening new quest form...",
        });
      }

      // Cmd/Ctrl + F: Search
      if ((e.metaKey || e.ctrlKey) && e.key === 'f' && onToggleSearch) {
        e.preventDefault();
        onToggleSearch();
      }

      // Cmd/Ctrl + E: Export Data
      if ((e.metaKey || e.ctrlKey) && e.key === 'e' && onExportData) {
        e.preventDefault();
        onExportData();
        toast({
          title: "Exporting Data",
          description: "Your data will be downloaded shortly...",
        });
      }

      // ? key: Show shortcuts help
      if (e.key === '?' && !e.shiftKey) {
        e.preventDefault();
        toast({
          title: "Keyboard Shortcuts",
          description: (
            <div className="space-y-1 text-xs">
              <p>⌘/Ctrl + K: New Quest</p>
              <p>⌘/Ctrl + F: Search</p>
              <p>⌘/Ctrl + E: Export Data</p>
              <p>?: Show this help</p>
            </div>
          ),
          duration: 5000,
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onNewQuest, onToggleSearch, onExportData, toast]);

  return null; // This component doesn't render anything
};
