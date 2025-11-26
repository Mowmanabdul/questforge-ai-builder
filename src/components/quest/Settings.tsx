import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Download, Trash2, FileJson, FileSpreadsheet, Palette, Check } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { themes, getStoredTheme, applyTheme, type ThemeColor } from "@/utils/themeConfig";
import { cn } from "@/lib/utils";

interface SettingsProps {
  onResetData: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
}

export const Settings = ({ onResetData, onExportJSON, onExportCSV }: SettingsProps) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeColor>(getStoredTheme());

  const handleReset = () => {
    onResetData();
    toast.success("All data has been reset");
  };

  const handleThemeChange = (themeValue: ThemeColor) => {
    const theme = themes.find(t => t.value === themeValue);
    if (theme) {
      applyTheme(theme);
      setSelectedTheme(themeValue);
      toast.success(`Theme changed to ${theme.name}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Theme Selection Card */}
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme
          </CardTitle>
          <CardDescription>Choose your preferred color theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => handleThemeChange(theme.value)}
                className={cn(
                  "relative p-4 rounded-xl border-2 transition-all duration-300 text-left group",
                  "hover:scale-[1.02] hover:shadow-lg",
                  selectedTheme === theme.value
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border/40 bg-card/50 hover:border-primary/50"
                )}
              >
                {/* Selected Check */}
                {selectedTheme === theme.value && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}

                {/* Theme Preview */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-1">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-background shadow-sm"
                      style={{ backgroundColor: theme.preview.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-background shadow-sm"
                      style={{ backgroundColor: theme.preview.secondary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-background shadow-sm"
                      style={{ backgroundColor: theme.preview.accent }}
                    />
                  </div>
                </div>

                {/* Theme Info */}
                <div>
                  <h3 className="font-semibold text-sm mb-1">{theme.name}</h3>
                  <p className="text-xs text-muted-foreground">{theme.description}</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Data Card */}
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Data
          </CardTitle>
          <CardDescription>Download your quest data and progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={onExportJSON}
            variant="outline" 
            className="w-full justify-start"
          >
            <FileJson className="w-4 h-4 mr-2" />
            Export as JSON
          </Button>
          <Button 
            onClick={onExportCSV}
            variant="outline" 
            className="w-full justify-start"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export as CSV
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions - proceed with caution</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Reset All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Quests and progress</li>
                    <li>Experience and level</li>
                    <li>Gold and rewards</li>
                    <li>Achievements and goals</li>
                    <li>All statistics and records</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, reset everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};
