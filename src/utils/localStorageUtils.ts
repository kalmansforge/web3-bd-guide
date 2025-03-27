
/**
 * Utility functions for working with local storage
 * Used to store evaluation data and threshold configurations locally
 * instead of in the database
 */

import { ProjectEvaluation } from "@/types/metrics";
import { ThresholdConfig } from "@/contexts/ThresholdContext";

const EVALUATIONS_KEY = 'web3_evaluations';
const THRESHOLDS_KEY = 'web3_thresholds';

// Evaluation Storage
export const saveEvaluationsToStorage = (evaluations: ProjectEvaluation[]) => {
  try {
    localStorage.setItem(EVALUATIONS_KEY, JSON.stringify(evaluations));
    return true;
  } catch (error) {
    console.error('Error saving evaluations to local storage:', error);
    return false;
  }
};

export const getEvaluationsFromStorage = (): ProjectEvaluation[] => {
  try {
    const storedData = localStorage.getItem(EVALUATIONS_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Error reading evaluations from local storage:', error);
    return [];
  }
};

// Threshold Configuration Storage
export const saveThresholdsToStorage = (thresholds: ThresholdConfig[]) => {
  try {
    localStorage.setItem(THRESHOLDS_KEY, JSON.stringify(thresholds));
    return true;
  } catch (error) {
    console.error('Error saving thresholds to local storage:', error);
    return false;
  }
};

export const getThresholdsFromStorage = (): ThresholdConfig[] => {
  try {
    const storedData = localStorage.getItem(THRESHOLDS_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Error reading thresholds from local storage:', error);
    return [];
  }
};

// Data Export/Import
export const exportAllData = () => {
  try {
    const evaluations = getEvaluationsFromStorage();
    const thresholds = getThresholdsFromStorage();
    
    const exportData = {
      evaluations,
      thresholds,
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
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
