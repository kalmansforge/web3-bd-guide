
import React from "react";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateHeaderActionsProps {
  onImportClick: () => void;
  onCreateTemplate: () => void;
}

const TemplateHeaderActions: React.FC<TemplateHeaderActionsProps> = ({
  onImportClick,
  onCreateTemplate
}) => {
  return (
    <div className="flex gap-3">
      <Button 
        variant="outline" 
        onClick={onImportClick}
        size="sm"
      >
        <Upload className="mr-2 h-4 w-4" />
        Import Template
      </Button>
      <Button 
        onClick={onCreateTemplate}
        size="sm"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Template
      </Button>
    </div>
  );
};

export default TemplateHeaderActions;
