
import { EvaluationTemplate } from "@/types/templates";
import { getTemplatesFromStorage, saveTemplatesToStorage } from "./core";

/**
 * Create a new template from scratch
 */
export const createEmptyTemplate = (): EvaluationTemplate => {
  return {
    id: crypto.randomUUID(),
    name: "New Template",
    description: "Enter template description here",
    author: "You",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isBuiltIn: false,
    categories: [
      {
        id: "category1",
        name: "New Category",
        description: "Enter category description here",
        metrics: []
      }
    ]
  };
};

/**
 * Duplicate a template
 */
export const duplicateTemplate = (templateId: string): boolean => {
  const { templates } = getTemplatesFromStorage();
  const template = templates.find(t => t.id === templateId);
  
  if (!template) {
    return false;
  }
  
  const duplicatedTemplate: EvaluationTemplate = {
    ...template,
    id: crypto.randomUUID(),
    name: `${template.name} (Copy)`,
    isBuiltIn: false,
    isLocked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return saveTemplate(duplicatedTemplate);
};

// Import saveTemplate at the end to avoid circular dependencies
import { saveTemplate } from "./update";
