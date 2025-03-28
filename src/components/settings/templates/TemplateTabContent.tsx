
import React from "react";
import { EvaluationTemplate } from "@/types/templates";
import TemplatesList from "@/components/templates/list/TemplatesList";
import EmptyTemplatesList from "@/components/templates/list/EmptyTemplatesList";

interface TemplateTabContentProps {
  filteredTemplates: EvaluationTemplate[];
  searchTerm: string;
  activeTemplateId: string;
  onCreateTemplate: () => void;
  onImportClick: () => void;
  onSetActive: (templateId: string) => void;
  onDuplicate: (templateId: string) => void;
  onEdit: (templateId: string, isLocked: boolean) => void;
  onExport: (templateId: string) => void;
  onDelete: (templateId: string) => void;
}

const TemplateTabContent: React.FC<TemplateTabContentProps> = ({
  filteredTemplates,
  searchTerm,
  activeTemplateId,
  onCreateTemplate,
  onImportClick,
  onSetActive,
  onDuplicate,
  onEdit,
  onExport,
  onDelete
}) => {
  return (
    <>
      {filteredTemplates.length > 0 ? (
        <TemplatesList
          templates={filteredTemplates}
          activeTemplateId={activeTemplateId}
          onSetActive={onSetActive}
          onDuplicate={onDuplicate}
          onEdit={onEdit}
          onExport={onExport}
          onDelete={onDelete}
        />
      ) : (
        <EmptyTemplatesList
          searchTerm={searchTerm}
          onCreateTemplate={onCreateTemplate}
          onImportClick={onImportClick}
        />
      )}
    </>
  );
};

export default TemplateTabContent;
