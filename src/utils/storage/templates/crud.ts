
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

/**
 * Delete a template
 */
export const deleteTemplate = (templateId: string): boolean => {
  const templateStorage = getTemplatesFromStorage();
  
  // Find the template
  const templateToDelete = templateStorage.templates.find(t => t.id === templateId);
  
  // Prevent deleting locked templates
  if (templateToDelete && templateToDelete.isLocked) {
    return false;
  }
  
  // Prevent deleting if it's the only template
  if (templateStorage.templates.length <= 1) {
    return false;
  }
  
  // Prevent deleting active template
  if (templateStorage.activeTemplateId === templateId) {
    return false;
  }
  
  // Remove template
  templateStorage.templates = templateStorage.templates.filter(t => t.id !== templateId);
  return saveTemplatesToStorage(templateStorage);
};

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
