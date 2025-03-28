
import { useState, useEffect, useCallback } from "react";
import { EvaluationTemplate } from "@/types/templates";
import { useTemplateData } from "./operations/useTemplateData";
import { useActiveTemplate } from "./operations/useActiveTemplate";
import { useTemplateBasicOperations } from "./operations/useTemplateBasicOperations";
import { useTemplateDuplication } from "./operations/useTemplateDuplication";
import { useTemplateRemoval } from "./operations/useTemplateRemoval";
import { useTemplateImportExport } from "./operations/useTemplateImportExport";

export function useTemplateOperations() {
  const templateData = useTemplateData();
  const activeTemplateOps = useActiveTemplate();
  const basicOps = useTemplateBasicOperations();
  const duplicationOps = useTemplateDuplication();
  const removalOps = useTemplateRemoval();
  const importExportOps = useTemplateImportExport();
  
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<EvaluationTemplate[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<EvaluationTemplate | null>(null);
  
  // Sync state between hooks
  useEffect(() => {
    setTemplates(templateData.templates);
  }, [templateData.templates]);
  
  useEffect(() => {
    setActiveTemplate(templateData.activeTemplate);
  }, [templateData.activeTemplate]);
  
  // Combined loading state
  useEffect(() => {
    const isLoading = 
      templateData.loading || 
      activeTemplateOps.loading || 
      basicOps.loading || 
      duplicationOps.loading || 
      removalOps.loading || 
      importExportOps.loading;
    
    setLoading(isLoading);
  }, [
    templateData.loading,
    activeTemplateOps.loading,
    basicOps.loading,
    duplicationOps.loading,
    removalOps.loading,
    importExportOps.loading
  ]);
  
  // Wrapped refresh function that returns a promise
  const refreshData = useCallback(async () => {
    return new Promise<void>((resolve) => {
      templateData.refreshData();
      // Use a small timeout to ensure the data is refreshed before resolving
      setTimeout(() => {
        resolve();
      }, 100);
    });
  }, [templateData]);

  // Combine all the hooks into a single API
  return {
    templates,
    activeTemplate,
    setActiveTemplateId: (id: string) => {
      const success = activeTemplateOps.setActiveTemplateId(id);
      if (success) {
        refreshData();
      }
      return success;
    },
    addTemplate: (template: EvaluationTemplate) => {
      const success = basicOps.addTemplate(template);
      if (success) {
        refreshData();
      }
    },
    updateTemplate: (template: EvaluationTemplate) => {
      const success = basicOps.updateTemplate(template);
      if (success) {
        refreshData();
      }
    },
    removeTemplate: (id: string) => {
      const success = removalOps.removeTemplate(id);
      if (success) {
        refreshData();
      }
      return success;
    },
    duplicateTemplateById: (id: string) => {
      const success = duplicationOps.duplicateTemplateById(id);
      if (success) {
        refreshData();
      }
      return success;
    },
    importTemplateFromJson: async (json: string) => {
      const result = await importExportOps.importTemplateFromJson(json);
      if (result.success) {
        // Wait for the refresh to complete before returning
        await refreshData();
      }
      return result;
    },
    exportTemplateById: importExportOps.exportTemplateById,
    createTemplate: () => {
      const newTemplate = basicOps.createTemplate();
      refreshData();
      return newTemplate;
    },
    loading,
    refreshData
  };
}
