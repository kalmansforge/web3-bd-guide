/**
 * Core utility functions for working with local storage
 */

// Storage keys
export const TEMPLATES_KEY = 'web3_templates';

import { TemplateStorage } from "@/types/templates";
import { saveToStorage, getFromStorage } from "../core";
import { BASIC_TEMPLATE, initialStorage } from "./constants";
import { initializePreloadedTemplates } from "./preloaded";

/**
 * Save templates to local storage
 */
export const saveTemplatesToStorage = (templates: TemplateStorage): boolean => {
  return saveToStorage(TEMPLATES_KEY, templates);
};

/**
 * Initialize templates if this is the first time
 */
export const initializeTemplates = (): TemplateStorage => {
  // Get existing templates from storage if any
  const existingStorage = getFromStorage<TemplateStorage>(TEMPLATES_KEY, null);
  
  // If no templates exist, create initial setup with basic template
  if (!existingStorage) {
    saveTemplatesToStorage(initialStorage);
    // After setting up initial storage, load preloaded templates
    initializePreloadedTemplates();
    return getFromStorage<TemplateStorage>(TEMPLATES_KEY, initialStorage);
  }
  
  return existingStorage;
};

/**
 * Get templates from local storage
 */
export const getTemplatesFromStorage = (): TemplateStorage => {
  return getFromStorage<TemplateStorage>(TEMPLATES_KEY, null) || initializeTemplates();
};
