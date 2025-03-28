
// Update imports for thresholds.ts
import { ThresholdConfig } from "@/types/metrics";
import { saveToStorage, getFromStorage, THRESHOLDS_KEY } from "./core";

/**
 * Save thresholds to local storage
 */
export const saveThresholdsToStorage = (thresholds: ThresholdConfig[]): boolean => {
  return saveToStorage(THRESHOLDS_KEY, thresholds);
};

/**
 * Get thresholds from local storage
 */
export const getThresholdsFromStorage = (): ThresholdConfig[] => {
  return getFromStorage<ThresholdConfig[]>(THRESHOLDS_KEY, []);
};
