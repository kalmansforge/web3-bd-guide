
import React, { useRef } from "react";
import { ProjectEvaluation } from "@/types/metrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, Database, FileText, InfoIcon, AlertTriangle } from "lucide-react";
import { exportAllData, importData } from "@/utils/storage";
import { formatBytes } from "@/utils/storage/core";
import ClearLocalDataDialog from "@/components/ui/ClearLocalDataDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  getEvaluationsFromStorage, 
  getThresholdsFromStorage, 
  getAppearanceFromStorage,
  getTemplatesFromStorage 
} from "@/utils/storage";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportData = () => {
    exportAllData();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const fileContent = event.target?.result as string;
        const result = importData(fileContent);
        
        if (result.success) {
          if (result.type === 'complete') {
            toast.success("Import Successful", {
              description: "Your complete data (evaluations, thresholds, and settings) has been imported successfully."
            });
          } else if (result.type === 'evaluation') {
            toast.success("Evaluation Import Successful", {
              description: "The project evaluation has been imported and added to your existing projects."
            });
          } else if (result.type === 'template') {
            toast.success("Template Import Successful", {
              description: "The template has been imported successfully."
            });
          }
          
          if (onDataImported) {
            onDataImported();
          }
        } else {
          toast.error("Import Failed", {
            description: "The file contains invalid data. Please check the file and try again."
          });
        }
      } catch (error) {
        toast.error("Import Failed", {
          description: "There was an error importing your data. Please try again."
        });
      } finally {
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    
    reader.onerror = () => {
      toast.error("Import Failed", {
        description: "There was an error reading the file. Please try again."
      });
    };
    
    reader.readAsText(file);
  };

  // Get counts for each data type
  const evaluationsCount = getEvaluationsFromStorage().length;
  const thresholdsCount = getThresholdsFromStorage().length;
  const appearanceCount = 1; // Appearance is a single object
  const templatesCount = getTemplatesFromStorage().templates.length;
  
  // Calculate percentage of 5MB used
  const maxStorage = 5 * 1024 * 1024; // 5MB in bytes
  const percentUsed = (storageInfo.totalSize / maxStorage) * 100;

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
            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between font-medium text-base">
                  <span>Total storage used:</span>
                  <span className="text-primary">{formatBytes(storageInfo.totalSize)} of 5MB</span>
                </div>
                <Progress value={percentUsed} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {percentUsed.toFixed(1)}% of available local storage
                </p>
              </div>
              <Separator className="my-2" />
              <div className="text-sm space-y-2">
                {Object.entries(storageInfo.breakdown).map(([key, size]) => {
                  let count = 0;
                  
                  if (key === 'Evaluations') count = evaluationsCount;
                  else if (key === 'Thresholds') count = thresholdsCount;
                  else if (key === 'Appearance') count = appearanceCount;
                  else if (key === 'Templates') count = templatesCount;
                  
                  return (
                    <div key={key} className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-mono">
                        {formatBytes(size)}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({count} {count === 1 ? 'item' : 'items'})
                        </span>
                      </span>
                    </div>
                  );
                })}
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
                onClick={handleImportClick}
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Upload className="h-4 w-4" />
                Import Data
              </Button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
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
