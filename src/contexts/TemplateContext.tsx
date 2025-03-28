
import React, { createContext, useContext, useState, useEffect } from "react";
import { EvaluationTemplate } from "@/types/templates";
import { toast } from "sonner";
import {
  getTemplatesFromStorage,
  getActiveTemplate,
  saveTemplate,
  deleteTemplate,
  setActiveTemplate as setActiveTemplateInStorage,
  importTemplate,
  exportTemplate,
  duplicateTemplate,
  createEmptyTemplate
} from "@/utils/storage/templates";

interface TemplateContextType {
  templates: EvaluationTemplate[];
  activeTemplate: EvaluationTemplate;
  setActiveTemplateId: (id: string) => void;
  addTemplate: (template: EvaluationTemplate) => void;
  updateTemplate: (template: EvaluationTemplate) => void;
  removeTemplate: (id: string) => boolean;
  duplicateTemplateById: (id: string) => boolean;
  importTemplateFromJson: (json: string) => {success: boolean; template?: EvaluationTemplate};
  exportTemplateById: (id: string) => boolean;
  createTemplate: () => EvaluationTemplate;
  loading: boolean;
  refreshData: () => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export const useTemplates = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error("useTemplates must be used within a TemplateProvider");
  }
  return context;
};

export const TemplateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useState<EvaluationTemplate[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<EvaluationTemplate | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshData = () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    refreshData();
  }, []);

  const setActiveTemplateId = (id: string) => {
    try {
      setLoading(true);
      
      const success = setActiveTemplateInStorage(id);
      if (success) {
        const template = templates.find(t => t.id === id);
        if (template) {
          setActiveTemplate(template);
          toast.success("Template activated", {
            description: `Now using "${template.name}" template`
          });
          return true;
        }
      }
      
      toast.error("Failed to set active template");
      return false;
    } catch (error: any) {
      toast.error("Error setting active template", {
        description: error.message
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addTemplate = (template: EvaluationTemplate) => {
    try {
      setLoading(true);
      
      if (saveTemplate(template)) {
        refreshData();
        toast.success("Template added", {
          description: `"${template.name}" has been added to your templates`
        });
      } else {
        toast.error("Failed to add template");
      }
    } catch (error: any) {
      toast.error("Error adding template", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = (template: EvaluationTemplate) => {
    try {
      setLoading(true);
      
      if (saveTemplate(template)) {
        refreshData();
        toast.success("Template updated", {
          description: `"${template.name}" has been updated`
        });
      } else {
        toast.error("Failed to update template");
      }
    } catch (error: any) {
      toast.error("Error updating template", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const removeTemplate = (id: string): boolean => {
    try {
      setLoading(true);
      
      if (deleteTemplate(id)) {
        refreshData();
        toast.success("Template deleted", {
          description: "The template has been removed"
        });
        return true;
      } else {
        toast.error("Cannot delete template", {
          description: "You cannot delete the active template or the last remaining template"
        });
        return false;
      }
    } catch (error: any) {
      toast.error("Error deleting template", {
        description: error.message
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const duplicateTemplateById = (id: string): boolean => {
    try {
      setLoading(true);
      
      if (duplicateTemplate(id)) {
        refreshData();
        toast.success("Template duplicated", {
          description: "A copy of the template has been created"
        });
        return true;
      } else {
        toast.error("Failed to duplicate template");
        return false;
      }
    } catch (error: any) {
      toast.error("Error duplicating template", {
        description: error.message
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const importTemplateFromJson = (json: string) => {
    try {
      setLoading(true);
      
      const result = importTemplate(json);
      
      if (result.success && result.template) {
        refreshData();
        toast.success("Template imported", {
          description: `"${result.template.name}" has been imported`
        });
      } else {
        toast.error("Failed to import template", {
          description: "The template format is invalid or the import failed"
        });
      }
      
      return result;
    } catch (error: any) {
      toast.error("Error importing template", {
        description: error.message
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const exportTemplateById = (id: string): boolean => {
    try {
      setLoading(true);
      
      if (exportTemplate(id)) {
        toast.success("Template exported", {
          description: "The template has been exported to a JSON file"
        });
        return true;
      } else {
        toast.error("Failed to export template");
        return false;
      }
    } catch (error: any) {
      toast.error("Error exporting template", {
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

  return (
    <TemplateContext.Provider
      value={{
        templates,
        activeTemplate: activeTemplate!,
        setActiveTemplateId,
        addTemplate,
        updateTemplate,
        removeTemplate,
        duplicateTemplateById,
        importTemplateFromJson,
        exportTemplateById,
        createTemplate,
        loading,
        refreshData
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};
