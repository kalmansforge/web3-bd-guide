
import React, { useState } from "react";
import { AlertTriangle, Download } from "lucide-react";
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
import { Button } from "@/components/ui/button";

interface ClearLocalDataDialogProps {
  onDataCleared: () => void;
  trigger?: React.ReactNode;
  itemCount?: number;
}

const ClearLocalDataDialog: React.FC<ClearLocalDataDialogProps> = ({ 
  trigger,
  onDataCleared,
  itemCount
}) => {
  const [hasExported, setHasExported] = useState(false);
  const [open, setOpen] = useState(false);
  
  const handleExportBeforeDelete = () => {
    if (exportAllData()) {
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
  
  const handleClearData = () => {
    try {
      localStorage.clear();
      toast.success("Data cleared", {
        description: "All local storage data has been cleared"
      });
      onDataCleared();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to clear data", {
        description: "There was a problem clearing your data"
      });
    }
  };
  
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when dialog is closed
      setHasExported(false);
    }
  };
  
  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button 
            variant="destructive" 
            className="w-full" 
            size="sm"
          >
            Clear All Local Data
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear all local data?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>
                This will permanently delete ALL your data
                {itemCount ? ` including ${itemCount} project evaluations, ` : ' including '}
                threshold configurations, and appearance settings.
                This action cannot be undone.
              </p>
            </div>
            
            <p>Would you like to export your data before clearing everything?</p>
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
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
          </div>
          <AlertDialogAction 
            onClick={handleClearData} 
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
  );
};

export default ClearLocalDataDialog;
