
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectEvaluation } from "@/types/metrics";
import { CategoryThreshold } from "@/contexts/ThresholdContext";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import DataImportExport from "@/components/ui/DataImportExport";
import ClearLocalDataCard from "@/components/settings/ClearLocalDataCard";

interface DataManagementTabProps {
  projects: ProjectEvaluation[];
  thresholds: CategoryThreshold[];
  storageInfo: {
    evaluationsSize: number;
    thresholdsSize: number;
    appearanceSize: number;
    totalSize: number;
    totalSizeFormatted: string;
    percentUsed: number;
  };
  onDataImported: () => void;
}

const DataManagementTab: React.FC<DataManagementTabProps> = ({
  projects,
  thresholds,
  storageInfo,
  onDataImported
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Data Management</h2>
        <p className="text-muted-foreground">Manage your application data and storage</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DataImportExport onDataImported={onDataImported} />
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Storage Statistics</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Local Storage Usage</span>
                  <span className="text-sm text-muted-foreground">{storageInfo.totalSizeFormatted}</span>
                </div>
                <Progress value={storageInfo.percentUsed} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {storageInfo.percentUsed.toFixed(1)}% of available browser storage
                </p>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Saved Projects</span>
                  <Badge variant="outline">{projects.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Threshold Configurations</span>
                  <Badge variant="outline">{thresholds.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Project Data Size</span>
                  <span className="text-sm text-muted-foreground">
                    {(storageInfo.evaluationsSize / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Configuration Data Size</span>
                  <span className="text-sm text-muted-foreground">
                    {(storageInfo.thresholdsSize / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <ClearLocalDataCard onDataCleared={onDataImported} />
      </div>
    </div>
  );
};

export default DataManagementTab;
