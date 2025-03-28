
import React from "react";
import TemplateHeaderActions from "./TemplateHeaderActions";

interface TemplateHeaderProps {
  onImportClick: () => void;
  onCreateTemplate: () => void;
}

const TemplateHeader: React.FC<TemplateHeaderProps> = ({
  onImportClick,
  onCreateTemplate
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-lg font-semibold">Evaluation Templates</h2>
        <p className="text-sm text-muted-foreground">
          Manage your evaluation frameworks and templates
        </p>
      </div>
      <TemplateHeaderActions 
        onImportClick={onImportClick} 
        onCreateTemplate={onCreateTemplate} 
      />
    </div>
  );
};

export default TemplateHeader;
