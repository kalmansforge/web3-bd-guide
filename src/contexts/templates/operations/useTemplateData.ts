import { useState } from "react";
import { toast } from "sonner";
import { EvaluationTemplate } from "@/types/templates";
import { getTemplatesFromStorage } from "@/utils/storage/templates";
import { initializePreloadedTemplates } from "@/utils/storage/templates/preloaded";

export function useTemplateData() {
  const [templates, setTemplates] = useState<EvaluationTemplate[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<EvaluationTemplate | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    try {
      setLoading(true);
      
      // Initialize preloaded templates if they don't already exist
      initializePreloadedTemplates();
      
      // Get templates from storage (including any newly added preloaded templates)
      const { templates, activeTemplateId } = getTemplatesFromStorage();
      setTemplates(templates);
      
      const active = templates.find(t => t.id === activeTemplateId) || templates[0];
      setActiveTemplate(active);
    } catch (error: any) {
      toast.error("Failed to load templates", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    templates,
    activeTemplate,
    loading,
    refreshData
  };
}
