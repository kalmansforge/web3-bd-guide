/**
 * Utility functions for working with local storage
 * Used to store evaluation data and threshold configurations locally
 * instead of in the database
 */

import { ProjectEvaluation } from "@/types/metrics";
import { ThresholdConfig } from "@/contexts/ThresholdContext";

const EVALUATIONS_KEY = 'web3_evaluations';
const THRESHOLDS_KEY = 'web3_thresholds';
const APPEARANCE_KEY = 'web3_appearance';

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

export const exportSingleEvaluation = (evaluationId: string) => {
  try {
    const evaluations = getEvaluationsFromStorage();
    const evaluation = evaluations.find(e => e.id === evaluationId);
    
    if (!evaluation) {
      return false;
    }
    
    const exportData = {
      evaluations: [evaluation],
      exportDate: new Date().toISOString(),
      version: '1.0',
      type: 'single-evaluation'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileName = `${evaluation.name.replace(/\s+/g, '_').toLowerCase()}_evaluation_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    return true;
  } catch (error) {
    console.error('Error exporting single evaluation:', error);
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

// Storage Size Calculation
export const calculateStorageSize = (): { 
  evaluationsSize: number; 
  thresholdsSize: number;
  appearanceSize: number;
  totalSize: number;
  totalSizeFormatted: string;
  percentUsed: number;
} => {
  try {
    const evaluations = localStorage.getItem(EVALUATIONS_KEY) || '';
    const thresholds = localStorage.getItem(THRESHOLDS_KEY) || '';
    const appearance = localStorage.getItem(APPEARANCE_KEY) || '';
    
    const evaluationsSize = new Blob([evaluations]).size;
    const thresholdsSize = new Blob([thresholds]).size;
    const appearanceSize = new Blob([appearance]).size;
    const totalSize = evaluationsSize + thresholdsSize + appearanceSize;
    
    // Format total size for display
    let totalSizeFormatted = '';
    if (totalSize < 1024) {
      totalSizeFormatted = `${totalSize} B`;
    } else if (totalSize < 1024 * 1024) {
      totalSizeFormatted = `${(totalSize / 1024).toFixed(1)} KB`;
    } else {
      totalSizeFormatted = `${(totalSize / (1024 * 1024)).toFixed(1)} MB`;
    }
    
    // Calculate percentage of typical browser local storage (assuming 5MB)
    const percentUsed = (totalSize / (5 * 1024 * 1024)) * 100;
    
    return {
      evaluationsSize,
      thresholdsSize,
      appearanceSize,
      totalSize,
      totalSizeFormatted,
      percentUsed: Math.min(percentUsed, 100) // Cap at 100%
    };
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return {
      evaluationsSize: 0,
      thresholdsSize: 0,
      appearanceSize: 0,
      totalSize: 0,
      totalSizeFormatted: '0 B',
      percentUsed: 0
    };
  }
};

// Appearance Settings
export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  colorScheme: 'default' | 'purple' | 'blue' | 'green';
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  animation: boolean;
  updatedAt: string;
}

export const defaultAppearanceSettings: AppearanceSettings = {
  theme: 'system',
  colorScheme: 'default',
  fontSize: 'medium',
  borderRadius: 'medium',
  animation: true,
  updatedAt: new Date().toISOString()
};

export const saveAppearanceToStorage = (settings: AppearanceSettings) => {
  try {
    localStorage.setItem(APPEARANCE_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving appearance settings to local storage:', error);
    return false;
  }
};

export const getAppearanceFromStorage = (): AppearanceSettings => {
  try {
    const storedData = localStorage.getItem(APPEARANCE_KEY);
    return storedData ? JSON.parse(storedData) : defaultAppearanceSettings;
  } catch (error) {
    console.error('Error reading appearance settings from local storage:', error);
    return defaultAppearanceSettings;
  }
};
