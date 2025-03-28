
import React from "react";
import { EvaluationTemplate } from "@/types/templates";
import TemplateCard from "./TemplateCard";
import EmptyTemplateState from "./EmptyTemplateState";

interface TemplatesListProps {
  templates: EvaluationTemplate[];
  activeTemplateId: string;
  searchTerm: string;
  onSetActive: (templateId: string) => void;
  onDuplicate: (templateId: string) => void;
  onEdit: (template: EvaluationTemplate) => void;
  onExport: (templateId: string) => void;
  onDelete: (templateId: string) => void;
  onCreateTemplate: () => void;
  onImportClick: () => void;
}

const TemplatesList = ({
  templates,
  activeTemplateId,
  searchTerm,
  onSetActive,
  onDuplicate,
  onEdit,
  onExport,
  onDelete,
  onCreateTemplate,
  onImportClick
}: TemplatesListProps) => {
  if (templates.length === 0) {
    return (
      <EmptyTemplateState 
        searchTerm={searchTerm}
        onCreateTemplate={onCreateTemplate}
        onImportClick={onImportClick}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {templates.map(template => (
        <TemplateCard
          key={template.id}
          template={template}
          isActive={template.id === activeTemplateId}
          onSetActive={onSetActive}
          onDuplicate={onDuplicate}
          onEdit={onEdit}
          onExport={onExport}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TemplatesList;
