
import { useState } from "react";
import { toast } from "sonner";
import { EvaluationTemplate } from "@/types/templates";
import {
  saveTemplate,
  createEmptyTemplate
} from "@/utils/storage/templates";

export function useTemplateBasicOperations() {
  const [templates, setTemplates] = useState<EvaluationTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  const addTemplate = (template: EvaluationTemplate) => {
    try {
      setLoading(true);
      
      if (saveTemplate(template)) {
        toast.success("Template added", {
          description: `"${template.name}" has been added to your templates`
        });
        return true;
      } else {
        toast.error("Failed to add template");
        return false;
      }
    } catch (error: any) {
      toast.error("Error adding template", {
        description: error.message
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = (template: EvaluationTemplate) => {
    try {
      setLoading(true);
      
      if (saveTemplate(template)) {
        toast.success("Template updated", {
          description: `"${template.name}" has been updated`
        });
        return true;
      } else {
        toast.error("Failed to update template");
        return false;
      }
    } catch (error: any) {
      toast.error("Error updating template", {
        description: error.message
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = (): EvaluationTemplate => {
    const newTemplate = createEmptyTemplate();
    addTemplate(newTemplate);
    return newTemplate;
  };

  return {
    templates,
    setTemplates,
    addTemplate,
    updateTemplate,
    createTemplate,
    loading
  };
}
