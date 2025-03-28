
import { EvaluationTemplate } from "@/types/templates";
import { getTemplatesFromStorage, saveTemplatesToStorage } from "./core";
import { BASIC_TEMPLATE } from "./constants";

/**
 * Get active template
 */
export const getActiveTemplate = (): EvaluationTemplate => {
  const { templates, activeTemplateId } = getTemplatesFromStorage();
  const activeTemplate = templates.find(t => t.id === activeTemplateId);
  return activeTemplate || BASIC_TEMPLATE;
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
