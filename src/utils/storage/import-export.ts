
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
 */
export const importData = (jsonData: string): boolean => {
  try {
    const parsedData = JSON.parse(jsonData);
    
    // Validate the imported data structure
    if (!parsedData.evaluations || !parsedData.thresholds || !Array.isArray(parsedData.evaluations) || !Array.isArray(parsedData.thresholds)) {
      throw new Error('Invalid data format');
    }
    
    // Store the imported data
    saveEvaluationsToStorage(parsedData.evaluations);
    saveThresholdsToStorage(parsedData.thresholds);
    
    // Import appearance settings if available
    if (parsedData.appearance) {
      saveAppearanceToStorage(parsedData.appearance);
    }
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
