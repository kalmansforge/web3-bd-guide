import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { exportAllData, importData } from "@/utils/storage";

interface DataImportExportProps {
  onDataImported?: () => void;
}

const DataImportExport: React.FC<DataImportExportProps> = ({ onDataImported }) => {
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const success = exportAllData();
    if (success) {
      toast({
        title: "Export Successful",
        description: "Your evaluation data and thresholds have been exported successfully."
      });
    } else {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive"
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
        const success = importData(fileContent);
        
        if (success) {
          toast({
            title: "Import Successful",
            description: "Your evaluation data and thresholds have been imported successfully."
          });
          
          if (onDataImported) {
            onDataImported();
          }
        } else {
          toast({
            title: "Import Failed",
            description: "The file contains invalid data. Please check the file and try again.",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "There was an error importing your data. Please try again.",
          variant: "destructive"
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
      toast({
        title: "Import Failed",
        description: "There was an error reading the file. Please try again.",
        variant: "destructive"
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
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground mb-4">
          Your evaluation data and threshold configurations are stored locally in your browser. 
          Export your data to back it up or transfer it to another device.
        </p>
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
