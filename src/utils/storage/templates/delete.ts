
import { getTemplatesFromStorage, saveTemplatesToStorage } from "./core";

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
