
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, FileText, Info } from "lucide-react";
import { toast } from "sonner";
import { exportAllData, importData } from "@/utils/storage";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DataImportExportProps {
  onDataImported?: () => void;
}

const DataImportExport: React.FC<DataImportExportProps> = ({ onDataImported }) => {
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const success = exportAllData();
    if (success) {
      toast.success("Export Successful", {
        description: "Your evaluation data and thresholds have been exported successfully."
      });
    } else {
      toast.error("Export Failed", {
        description: "There was an error exporting your data. Please try again."
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
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
        setIsImporting(false);
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
      setIsImporting(false);
    };
    
    reader.readAsText(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>
          Export or import your evaluation data and threshold configurations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground mb-2">
          Your evaluation data and threshold configurations are stored locally in your browser. 
          Export your data to back it up or transfer it to another device.
        </p>
        
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            The import function automatically detects and handles both complete data exports and single project evaluation files.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col space-y-2">
          <Button onClick={handleExport} className="w-full" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export All Data
          </Button>
          <Button onClick={handleImportClick} className="w-full" variant="outline" disabled={isImporting}>
            <Upload className="mr-2 h-4 w-4" />
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
      <CardFooter className="bg-muted/50 p-3 text-xs text-muted-foreground">
        <div className="flex items-start space-x-2">
          <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>
            Data is stored only on your device for privacy. Remember to export your data regularly 
            as clearing browser data will remove all your evaluations and configurations.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DataImportExport;
