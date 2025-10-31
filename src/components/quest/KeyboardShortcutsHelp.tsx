import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Keyboard, Command } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const SHORTCUTS = [
  { keys: ["Ctrl", "N"], description: "Add new quest", mac: ["⌘", "N"] },
  { keys: ["Ctrl", "E"], description: "Export data", mac: ["⌘", "E"] },
  { keys: ["Ctrl", "K"], description: "Quick search", mac: ["⌘", "K"] },
  { keys: ["Ctrl", "/"], description: "Show shortcuts", mac: ["⌘", "/"] },
  { keys: ["Esc"], description: "Close dialogs", mac: ["Esc"] },
];

export const KeyboardShortcutsHelp = () => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="glass-card border-primary/20 hover:border-primary/40 transition-all"
          title="Keyboard Shortcuts"
        >
          <Keyboard className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2 text-2xl">
            <Keyboard className="w-6 h-6 text-primary" />
            Keyboard Shortcuts
          </SheetTitle>
        </SheetHeader>
        
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Available Shortcuts</CardTitle>
            <CardDescription>Speed up your workflow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {SHORTCUTS.map((shortcut, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-all"
              >
                <span className="text-sm text-foreground">{shortcut.description}</span>
                <div className="flex gap-1">
                  {(isMac ? shortcut.mac : shortcut.keys).map((key, keyIdx) => (
                    <Badge 
                      key={keyIdx} 
                      variant="secondary" 
                      className="font-mono text-xs px-2 py-1 bg-background border border-border"
                    >
                      {key}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start gap-2">
            <Command className="w-4 h-4 text-primary mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Pro Tip</p>
              <p>Press <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-xs font-mono">Ctrl+/</kbd> (or <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-xs font-mono">⌘/</kbd> on Mac) anytime to see this list.</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
