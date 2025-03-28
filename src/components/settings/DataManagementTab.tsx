
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Database, HardDrive } from "lucide-react";
import DataImportExport from "@/components/ui/DataImportExport";
import { calculateStorageSize } from "@/utils/localStorageUtils";

interface DataManagementTabProps {
  projects: any[];
  thresholds: any[];
  storageInfo: ReturnType<typeof calculateStorageSize>;
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
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Data Management</h2>
          <p className="text-muted-foreground">Manage your locally stored data and backup settings</p>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Data Summary
          </CardTitle>
          <CardDescription>
            Overview of your locally stored data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Project Evaluations</div>
              <div className="text-2xl font-bold">{projects.length}</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Threshold Configurations</div>
              <div className="text-2xl font-bold">{thresholds.length}</div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
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
        </CardContent>
      </Card>
      
      <DataImportExport onDataImported={onDataImported} />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HardDrive className="h-5 w-5 mr-2" />
            Storage Details
          </CardTitle>
          <CardDescription>
            Detailed breakdown of your local storage usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Evaluations Data</span>
              <span className="text-sm font-medium">
                {Math.round(storageInfo.evaluationsSize / 1024).toFixed(1)} KB
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Thresholds Data</span>
              <span className="text-sm font-medium">
                {Math.round(storageInfo.thresholdsSize / 1024).toFixed(1)} KB
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Appearance Settings</span>
              <span className="text-sm font-medium">
                {Math.round(storageInfo.appearanceSize / 1024).toFixed(1)} KB
              </span>
            </div>
            <Separator className="my-1" />
            <div className="flex justify-between items-center font-medium">
              <span className="text-sm">Total</span>
              <span className="text-sm">
                {storageInfo.totalSizeFormatted}
              </span>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-md text-sm">
            <p className="mb-2 font-medium">About Local Storage</p>
            <p className="text-muted-foreground">
              All your data is stored locally in your browser's storage. This means your data stays private on your device. 
              Make sure to regularly export your data as a backup, as clearing your browser cache or storage will 
              permanently delete all your evaluations and settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataManagementTab;
