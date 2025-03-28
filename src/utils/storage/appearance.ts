
import { saveToStorage, getFromStorage, APPEARANCE_KEY } from "./core";

/**
 * Interface for tier name configuration
 */
export interface TierName {
  id: string;
  displayName: string;
  internalName: string;
  color?: string;
}

/**
 * Interface for application appearance settings
 */
export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  colorScheme: 'default' | 'purple' | 'blue' | 'green';
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  animation: boolean;
  tierNames: TierName[];
  updatedAt: string;
}

/**
 * Default appearance settings
 */
export const defaultAppearanceSettings: AppearanceSettings = {
  theme: 'system',
  colorScheme: 'default',
  fontSize: 'medium',
  borderRadius: 'medium',
  animation: true,
  tierNames: [
    { id: 't0', displayName: 'T0', internalName: 'T0', color: 'green' },
    { id: 't1', displayName: 'T1', internalName: 'T1', color: 'yellow' }
  ],
  updatedAt: new Date().toISOString()
};

/**
 * Save appearance settings to local storage
 */
export const saveAppearanceToStorage = (settings: AppearanceSettings): boolean => {
  return saveToStorage(APPEARANCE_KEY, settings);
};

/**
 * Get appearance settings from local storage
 */
export const getAppearanceFromStorage = (): AppearanceSettings => {
  return getFromStorage<AppearanceSettings>(APPEARANCE_KEY, defaultAppearanceSettings);
};

/**
 * Tier name utility functions
 */
export const getTierDisplayName = (tier: string | null): string => {
  if (!tier) return '';
  
  const settings = getAppearanceFromStorage();
  const tierName = settings.tierNames.find(t => t.internalName === tier);
  return tierName ? tierName.displayName : tier;
};

export const getTierInternalName = (displayName: string): string | null => {
  const settings = getAppearanceFromStorage();
  const tierName = settings.tierNames.find(t => t.displayName === displayName);
  return tierName ? tierName.internalName : null;
};

export const getAllTierNames = (): TierName[] => {
  const settings = getAppearanceFromStorage();
  return settings.tierNames;
};
