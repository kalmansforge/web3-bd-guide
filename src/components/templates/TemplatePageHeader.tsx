
import React from "react";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";

interface TemplatePageHeaderProps {
  onCreateTemplate: () => void;
  onImportClick: () => void;
  isImporting: boolean;
}

const TemplatePageHeader = ({ 
  onCreateTemplate, 
  onImportClick, 
  isImporting 
}: TemplatePageHeaderProps) => {
  return (
    <PageHeader
      title="Evaluation Templates"
      description="Manage your evaluation frameworks and templates"
      actions={
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onImportClick}
            size="sm"
            disabled={isImporting}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isImporting ? "Importing..." : "Import Template"}
          </Button>
          <Button 
            onClick={onCreateTemplate}
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>
      }
    />
  );
};

export default TemplatePageHeader;
