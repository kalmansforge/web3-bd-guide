
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTemplates } from "@/contexts/TemplateContext";
import { EvaluationTemplate } from "@/types/templates";

export const useTemplateDetails = (template: EvaluationTemplate | null, isLocked: boolean) => {
  const navigate = useNavigate();
  const { updateTemplate, duplicateTemplateById } = useTemplates();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Handle duplicate and edit flow for locked templates
  const handleDuplicateAndEdit = () => {
    if (template && isLocked) {
      duplicateTemplateById(template.id);
      toast.success("Template duplicated", {
        description: "You can now edit your copy of this template"
      });
      navigate("/settings?tab=templates");
    }
  };

  // Handle back button with unsaved changes warning
  const handleBackClick = () => {
    navigate("/settings?tab=templates");
  };

  // Save template changes
  const handleSaveTemplate = () => {
    if (template && !isLocked) {
      updateTemplate({
        ...template,
        updatedAt: new Date().toISOString(),
      });
      setHasUnsavedChanges(false);
      toast.success("Template saved successfully");
    }
  };

  // Handle template detail changes
  const handleTemplateChange = (field: keyof EvaluationTemplate, value: string) => {
    if (template && !isLocked) {
      return {
        ...template,
        [field]: value,
      };
    }
    return template;
  };

  return {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    handleDuplicateAndEdit,
    handleBackClick,
    handleSaveTemplate,
    handleTemplateChange,
  };
};
