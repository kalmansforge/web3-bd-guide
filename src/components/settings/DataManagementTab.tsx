import React from "react";
import { ProjectEvaluation } from "@/types/metrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, Database, FileText, InfoIcon, AlertTriangle } from "lucide-react";
import { exportAllData, formatBytes } from "@/utils/storage";
import ClearLocalDataDialog from "@/components/ui/ClearLocalDataDialog";
import DataImportExport from "@/components/ui/DataImportExport";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { getTemplateStorageSize } from "@/utils/storage/core";

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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Data Management</h2>
        <p className="text-muted-foreground mb-6">
          Manage your local storage data, import and export evaluations
        </p>
      </div>

      {/* Storage Usage Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Storage Usage
            </CardTitle>
            <CardDescription>
              Data stored in your browser's local storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between font-medium text-base">
                <span>Total storage used:</span>
                <span className="text-primary">{formatBytes(storageInfo.totalSize)}</span>
              </div>
              <Separator className="my-2" />
              <div className="text-sm space-y-2">
                {Object.entries({
                  ...storageInfo.breakdown,
                  'Templates': getTemplateStorageSize() // New function to get template storage size
                }).map(([key, size]) => (
                  <div key={key} className="flex justify-between items-center py-1">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-mono">{formatBytes(size)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Import/Export Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Backup & Restore
            </CardTitle>
            <CardDescription>
              Export your data or import from a previous backup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert className="bg-muted/50 border-primary/20">
              <InfoIcon className="h-4 w-4 text-primary" />
              <AlertDescription>
                Your data is stored locally in your browser. Create backups regularly to prevent data loss.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={handleExportData} 
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                Export All Data
              </Button>
              
              <Button
                onClick={() => document.getElementById('import-data-input')?.click()}
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Upload className="h-4 w-4" />
                Import Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Import/Export Component */}
      <div className="hidden">
        <DataImportExport onDataImported={onDataImported} />
      </div>

      {/* Danger Zone Section */}
      <div className="mt-8">
        <h3 className="text-lg font-medium flex items-center gap-2 mb-4 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </h3>
        <Card className="border-destructive/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Clear All Local Data</CardTitle>
            <CardDescription>
              Permanently delete all your project evaluations and configuration data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This action cannot be undone. All your data will be permanently deleted.
              </AlertDescription>
            </Alert>
            <ClearLocalDataDialog 
              itemCount={projects.length}
              onDataCleared={onDataImported}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataManagementTab;
