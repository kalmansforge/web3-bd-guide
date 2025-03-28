
import { EvaluationTemplate } from "@/types/templates";
import { saveTemplate } from "./crud";

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

// Import getTemplatesFromStorage at the end to avoid circular dependencies
import { getTemplatesFromStorage } from "./core";
