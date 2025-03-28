
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { exportAllData } from "@/utils/storage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ClearLocalDataCardProps {
  onDataCleared: () => void;
}

const ClearLocalDataCard: React.FC<ClearLocalDataCardProps> = ({ onDataCleared }) => {
  const [hasExported, setHasExported] = useState(false);
  
  const handleExportBeforeDelete = () => {
    const success = exportAllData();
    if (success) {
      toast.success("Data exported", {
        description: "Your data has been exported as a JSON file"
      });
      setHasExported(true);
    } else {
      toast.error("Export failed", {
        description: "There was a problem exporting your data"
      });
    }
  };
  
  const handleClearAllData = () => {
    try {
      localStorage.clear();
      toast.success("Data cleared", {
        description: "All local data has been cleared successfully"
      });
      onDataCleared();
    } catch (error) {
      toast.error("Failed to clear data", {
        description: "There was an error clearing your local data"
      });
    }
  };
  
  return (
    <Card className="border-red-200 dark:border-red-900">
      <CardHeader className="bg-red-50 dark:bg-red-900/20">
        <CardTitle className="text-red-600 dark:text-red-400 flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>
          Actions in this section can result in permanent data loss
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="flex-grow space-y-1">
              <h4 className="font-medium">Clear All Local Data</h4>
              <p className="text-sm text-muted-foreground">
                This will permanently remove all your evaluations, threshold configurations, and application settings from your browser.
                This action cannot be undone.
              </p>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all local data?</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-4">
                    <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p>
                        This will permanently delete <strong>ALL</strong> your project evaluations, threshold configurations, and settings. 
                        This action cannot be undone.
                      </p>
                    </div>
                    
                    <p>Would you like to export your data before clearing it?</p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col space-y-2 sm:space-y-0">
                  <div className="flex w-full flex-col sm:flex-row sm:justify-between gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto"
                      onClick={handleExportBeforeDelete}
                      disabled={hasExported}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {hasExported ? "Exported" : "Export First"}
                    </Button>
                    <AlertDialogCancel 
                      onClick={() => setHasExported(false)}
                      className="mt-0"
                    >
                      Cancel
                    </AlertDialogCancel>
                  </div>
                  <AlertDialogAction 
                    onClick={handleClearAllData} 
                    disabled={!hasExported}
                    className={`
                      w-full 
                      ${!hasExported 
                        ? "bg-red-300 cursor-not-allowed" 
                        : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                      }
                    `}
                  >
                    {hasExported ? "Clear All Data" : "Export First to Clear"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClearLocalDataCard;
