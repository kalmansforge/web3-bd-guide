import { EvaluationTemplate } from "@/types/templates";
import { getTemplatesFromStorage, saveTemplatesToStorage } from "./core";

// Use dynamic imports to load all templates
// This uses Vite's import.meta.glob which is a build-time feature that creates
// dynamic imports for all matching files
const templateModules = import.meta.glob('@/templates/*.json', { eager: true });

// Helper to add isBuiltIn flag to imported templates and ensure thresholds exist
const addBuiltInFlag = (template: any): EvaluationTemplate => {
  // Process each category and ensure metrics have thresholds
  const processedTemplate = {...template};
  
  if (processedTemplate.categories) {
    processedTemplate.categories = processedTemplate.categories.map((category: any) => {
      if (category.metrics) {
        category.metrics = category.metrics.map((metric: any) => {
          // Ensure thresholds object exists with at least T0 and T1
          if (!metric.thresholds) {
            metric.thresholds = {
              T0: "Top tier criteria",
              T1: "Secondary tier criteria"
            };
          } else if (typeof metric.thresholds !== 'object') {
            metric.thresholds = {
              T0: "Top tier criteria",
              T1: "Secondary tier criteria"
            };
          } else {
            // Ensure T0 and T1 exist
            if (!metric.thresholds.T0) {
              metric.thresholds.T0 = "Top tier criteria";
            }
            if (!metric.thresholds.T1) {
              metric.thresholds.T1 = "Secondary tier criteria";
            }
          }
          return metric;
        });
      }
      return category;
    });
  }
  
  return {
    ...processedTemplate,
    isBuiltIn: true
  };
};

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