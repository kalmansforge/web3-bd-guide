
import { EvaluationTemplate } from "@/types/templates";
import { getTemplatesFromStorage, saveTemplatesToStorage } from "./core";

/**
 * Add or update a template
 */
export const saveTemplate = (template: EvaluationTemplate): boolean => {
  const templateStorage = getTemplatesFromStorage();
  
  // Check if template exists
  const existingIndex = templateStorage.templates.findIndex(t => t.id === template.id);
  
  // Prevent modifying locked templates
  const existingTemplate = existingIndex >= 0 ? templateStorage.templates[existingIndex] : null;
  if (existingTemplate && existingTemplate.isLocked) {
    return false;
  }
  
  if (existingIndex >= 0) {
    // Update existing template
    templateStorage.templates[existingIndex] = {
      ...template,
      updatedAt: new Date().toISOString()
    };
  } else {
    // Add new template with generated ID if none provided
    const newTemplate = {
      ...template,
      id: template.id || crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    templateStorage.templates.push(newTemplate);
  }
  
  return saveTemplatesToStorage(templateStorage);
};
