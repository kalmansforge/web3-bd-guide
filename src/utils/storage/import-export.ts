
import { getAppearanceFromStorage, saveAppearanceToStorage } from "./appearance";
import { getEvaluationsFromStorage, saveEvaluationsToStorage } from "./evaluations";
import { getThresholdsFromStorage, saveThresholdsToStorage } from "./thresholds";

/**
 * Export all data to a downloadable JSON file
 */
export const exportAllData = (): boolean => {
  try {
    const evaluations = getEvaluationsFromStorage();
    const thresholds = getThresholdsFromStorage();
    const appearance = getAppearanceFromStorage();
    
    const exportData = {
      evaluations,
      thresholds,
      appearance,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileName = `web3_evaluation_data_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    return true;
  } catch (error) {
    console.error('Error exporting data:', error);
    return false;
  }
};

/**
 * Import data from a JSON string
 * Can handle both complete exports and single evaluation exports
 */
export const importData = (jsonData: string): { success: boolean; type: 'complete' | 'evaluation' | 'unknown' } => {
  try {
    const parsedData = JSON.parse(jsonData);
    
    // Check if this is a complete export
    if (parsedData.evaluations && Array.isArray(parsedData.evaluations)) {
      
      // Handle single evaluation export
      if (parsedData.type === 'single-evaluation') {
        // Get current evaluations
        const currentEvaluations = getEvaluationsFromStorage();
        
        // Check for duplicate IDs and rename if necessary
        const importedEvaluations = parsedData.evaluations.map(eval => {
          // Create new ID to avoid conflicts
          const newId = crypto.randomUUID();
          return {
            ...eval,
            id: newId,
            name: eval.name + ' (Imported)',
            date: new Date().toISOString()
          };
        });
        
        // Merge with current evaluations
        const mergedEvaluations = [...currentEvaluations, ...importedEvaluations];
        saveEvaluationsToStorage(mergedEvaluations);
        
        return { success: true, type: 'evaluation' };
      }
      
      // Complete export with thresholds
      if (parsedData.thresholds && Array.isArray(parsedData.thresholds)) {
        saveEvaluationsToStorage(parsedData.evaluations);
        saveThresholdsToStorage(parsedData.thresholds);
        
        // Import appearance settings if available
        if (parsedData.appearance) {
          saveAppearanceToStorage(parsedData.appearance);
        }
        
        return { success: true, type: 'complete' };
      }
    }
    
    throw new Error('Invalid data format');
  } catch (error) {
    console.error('Error importing data:', error);
    return { success: false, type: 'unknown' };
  }
};
