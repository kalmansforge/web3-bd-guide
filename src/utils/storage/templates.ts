import { EvaluationTemplate, TemplateStorage } from "@/types/templates";
import { saveToStorage, getFromStorage } from "./core";
import { metricsData } from "@/data/metricsData";

// Storage key for templates
export const TEMPLATES_KEY = 'web3_templates';

// Default built-in template based on our existing metrics data
export const DEFAULT_TEMPLATE: EvaluationTemplate = {
  id: "default-web3-template",
  name: "Web3 Project Evaluation",
  description: "Shai's foundational framework honed in on comprehensive evaluation for blockchain projects with metrics for foundational strength, product, financials, strategic alignment, ecosystem health, and risk assessment.",
  author: "Shai Perednik",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isBuiltIn: true,
  isLocked: true,
  categories: metricsData
};

// Initial template storage state - We'll modify the initialization logic
const initialStorage: TemplateStorage = {
  templates: [DEFAULT_TEMPLATE],
  activeTemplateId: DEFAULT_TEMPLATE.id
};

/**
 * Save templates to local storage
 */
export const saveTemplatesToStorage = (templates: TemplateStorage): boolean => {
  return saveToStorage(TEMPLATES_KEY, templates);
};

/**
 * Initialize templates if this is the first time or if updates to built-in template occurred
 */
export const initializeTemplates = (): TemplateStorage => {
  // Get existing templates from storage if any
  const existingStorage = getFromStorage<TemplateStorage>(TEMPLATES_KEY, null);
  
  // If no templates exist, create initial setup with a personal copy
  if (!existingStorage) {
    // Create a personal copy of the default template
    const personalTemplate: EvaluationTemplate = {
      ...DEFAULT_TEMPLATE,
      id: crypto.randomUUID(),
      name: "My Web3 Evaluation Template",
      description: "My customized version of Shai's foundational framework",
      author: "You",
      isBuiltIn: false,
      isLocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const initialSetup: TemplateStorage = {
      templates: [DEFAULT_TEMPLATE, personalTemplate],
      activeTemplateId: personalTemplate.id
    };
    
    saveTemplatesToStorage(initialSetup);
    return initialSetup;
  }
  
  // Make sure the built-in template is always present and up-to-date
  const builtInTemplateExists = existingStorage.templates.some(t => t.id === DEFAULT_TEMPLATE.id);
  
  if (!builtInTemplateExists) {
    // Add the built-in template if it doesn't exist
    existingStorage.templates.push(DEFAULT_TEMPLATE);
    saveTemplatesToStorage(existingStorage);
  } else {
    // Update the built-in template to ensure it's current
    const updatedTemplates = existingStorage.templates.map(t => 
      t.id === DEFAULT_TEMPLATE.id ? { ...DEFAULT_TEMPLATE } : t
    );
    
    existingStorage.templates = updatedTemplates;
    saveTemplatesToStorage(existingStorage);
  }
  
  return existingStorage;
};

/**
 * Get templates from local storage
 */
export const getTemplatesFromStorage = (): TemplateStorage => {
  return getFromStorage<TemplateStorage>(TEMPLATES_KEY, null) || initializeTemplates();
};

/**
 * Get active template
 */
export const getActiveTemplate = (): EvaluationTemplate => {
  const { templates, activeTemplateId } = getTemplatesFromStorage();
  const activeTemplate = templates.find(t => t.id === activeTemplateId);
  return activeTemplate || DEFAULT_TEMPLATE;
};

/**
 * Set active template
 */
export const setActiveTemplate = (templateId: string): boolean => {
  const templateStorage = getTemplatesFromStorage();
  
  // Make sure the template exists
  const templateExists = templateStorage.templates.some(t => t.id === templateId);
  if (!templateExists) return false;
  
  // Update active template
  templateStorage.activeTemplateId = templateId;
  return saveTemplatesToStorage(templateStorage);
};

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
 * Import a template
 */
export const importTemplate = (templateJson: string): {success: boolean; template?: EvaluationTemplate} => {
  try {
    const template = JSON.parse(templateJson) as EvaluationTemplate;
    
    // Validate template structure
    if (!template.id || !template.name || !Array.isArray(template.categories)) {
      throw new Error("Invalid template format");
    }
    
    // Generate new ID to avoid collisions
    template.id = crypto.randomUUID();
    template.isBuiltIn = false;
    template.createdAt = new Date().toISOString();
    template.updatedAt = new Date().toISOString();
    
    // Save template
    if (saveTemplate(template)) {
      return { success: true, template };
    } else {
      throw new Error("Failed to save template");
    }
  } catch (error) {
    console.error("Failed to import template:", error);
    return { success: false };
  }
};

/**
 * Export a template
 */
export const exportTemplate = (templateId: string): boolean => {
  try {
    const { templates } = getTemplatesFromStorage();
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      return false;
    }
    
    const dataStr = JSON.stringify(template, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileName = `${template.name.replace(/\s+/g, '_').toLowerCase()}_template_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    return true;
  } catch (error) {
    console.error('Error exporting template:', error);
    return false;
  }
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
