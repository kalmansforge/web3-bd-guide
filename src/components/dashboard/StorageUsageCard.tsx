
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Database } from "lucide-react";

interface StorageUsageCardProps {
  storageInfo: {
    totalSizeFormatted: string;
    percentUsed: number;
  };
  onManageStorage: () => void;
}

const StorageUsageCard = ({ storageInfo, onManageStorage }: StorageUsageCardProps) => {
  return (
    <Card className="mb-8 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Database className="h-5 w-5 mr-2 text-muted-foreground" />
            <CardTitle className="text-xl">Local Storage Usage</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={onManageStorage}>
            Manage Storage
          </Button>
        </div>
        <CardDescription>
          Overview of your browser's local storage usage for this application
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium">Total Storage Used</h3>
              <span className="text-sm font-medium text-primary">
                {storageInfo.totalSizeFormatted} ({storageInfo.percentUsed.toFixed(1)}% of 5MB)
              </span>
            </div>
            <Progress 
              value={storageInfo.percentUsed} 
              className={`h-2 ${storageInfo.percentUsed > 80 ? 'bg-destructive/20' : 'bg-muted'}`}
            />
          </div>
          
          {storageInfo.percentUsed > 80 && (
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800 mt-3">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">Storage usage is high. Consider exporting and clearing old evaluations.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageUsageCard;
