
import React from "react";
import { ProjectEvaluation } from "@/types/metrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { exportAllData, formatBytes } from "@/utils/storage";
import ClearLocalDataDialog from "@/components/ui/ClearLocalDataDialog";
import DataImportExport from "@/components/ui/DataImportExport";

interface DataManagementTabProps {
  projects: ProjectEvaluation[];
  storageInfo: { totalSize: number; breakdown: Record<string, number> };
  onDataImported: () => void;
}

const DataManagementTab: React.FC<DataManagementTabProps> = ({
  projects,
  storageInfo,
  onDataImported
}) => {
  const handleExportData = () => {
    exportAllData();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Data Management</h2>
      <p className="text-muted-foreground">
        Manage your local storage data, import and export evaluations
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Local Storage Usage</CardTitle>
            <CardDescription>
              Data stored in your browser's local storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">
                Total storage used: {formatBytes(storageInfo.totalSize)}
              </p>
              <div className="text-sm space-y-1">
                {Object.entries(storageInfo.breakdown).map(([key, size]) => (
                  <div key={key} className="flex justify-between">
                    <span>{key}:</span>
                    <span>{formatBytes(size)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Export & Import</CardTitle>
            <CardDescription>
              Back up your data or import from a previous backup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleExportData} 
              className="w-full flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export All Data
            </Button>
            
            <DataImportExport onDataImported={onDataImported} />
            
            <div className="pt-2">
              <ClearLocalDataDialog 
                itemCount={projects.length}
                onDataCleared={onDataImported} 
                trigger={
                  <Button variant="destructive" className="w-full" size="sm">
                    Clear All Local Data
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataManagementTab;
