
import { getTemplatesFromStorage } from '../storage/templates/core';

export const getTemplateStorageSize = (): number => {
  try {
    const templates = getTemplatesFromStorage();
    const templatesString = JSON.stringify(templates);
    return new Blob([templatesString]).size;
  } catch (error) {
    console.error('Error calculating template storage size:', error);
    return 0;
  }
};
