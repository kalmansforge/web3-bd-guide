import { EvaluationTemplate } from "@/types/templates";
import { getTemplatesFromStorage, saveTemplatesToStorage } from "./core";

// Use dynamic imports to load all templates
// This uses Vite's import.meta.glob which is a build-time feature that creates
// dynamic imports for all matching files
const templateModules = import.meta.glob('@/templates/*.json', { eager: true });

// Helper to add isBuiltIn flag to imported templates
const addBuiltInFlag = (template: any): EvaluationTemplate => ({
  ...template,
  isBuiltIn: true
});

// Extract all templates from the dynamic imports
export const preloadedTemplates: EvaluationTemplate[] = Object.values(templateModules).map(
  (module: any) => addBuiltInFlag(module.default || module)
);

/**
 * Initialize preloaded templates from the filesystem
 */
export const initializePreloadedTemplates = (): void => {
  try {
    // Get current storage
    const storage = getTemplatesFromStorage();
    const existingIds = storage.templates.map(t => t.id);
    
    // Log the number of templates found
    console.log(`Found ${preloadedTemplates.length} templates in the templates directory`);
    
    // Mark preloaded templates as built-in and ensure they have unique IDs
    const templatesWithMetadata = preloadedTemplates.map(template => ({
      ...template,
      isBuiltIn: true,
      // Ensure ID is prefixed to avoid collisions
      id: template.id.startsWith('preloaded-') ? template.id : `preloaded-${template.id}`
    }));
    
    // Filter out templates that already exist by ID
    const newTemplates = templatesWithMetadata.filter(
      template => !existingIds.includes(template.id)
    );
    
    if (newTemplates.length > 0) {
      // Add new templates to storage
      const updatedStorage = {
        ...storage,
        templates: [...storage.templates, ...newTemplates]
      };
      
      saveTemplatesToStorage(updatedStorage);
      console.log(`Added ${newTemplates.length} preloaded templates`);
    }
  } catch (error) {
    console.error("Failed to initialize preloaded templates:", error);
  }
}; 