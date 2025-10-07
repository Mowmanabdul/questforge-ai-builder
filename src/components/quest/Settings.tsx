import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Download, Trash2, FileJson, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

interface SettingsProps {
  onResetData: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
}

export const Settings = ({ onResetData, onExportJSON, onExportCSV }: SettingsProps) => {
  const handleReset = () => {
    onResetData();
    toast.success("All data has been reset");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
