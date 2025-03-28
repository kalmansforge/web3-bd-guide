
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { metricsData } from "@/data/metricsData";
import { saveThresholdsToStorage, getThresholdsFromStorage } from "@/utils/localStorageUtils";

export type ThresholdConfig = {
  id: string;
  metricId: string;
  categoryId: string;
  t0Threshold: string;
  t1Threshold: string;
  updatedAt: string;
};

type ThresholdContextType = {
  thresholds: ThresholdConfig[];
  loading: boolean;
  updateThreshold: (metricId: string, categoryId: string, t0Threshold: string, t1Threshold: string) => Promise<void>;
  saveChanges: () => Promise<void>;
  resetChanges: () => void;
  unsavedChanges: boolean;
  refreshData: () => void;
};

const ThresholdContext = createContext<ThresholdContextType | undefined>(undefined);

export const useThresholds = () => {
  const context = useContext(ThresholdContext);
  if (!context) {
    throw new Error("useThresholds must be used within a ThresholdProvider");
  }
  return context;
};

export const ThresholdProvider = ({ children }: { children: ReactNode }) => {
  const [thresholds, setThresholds] = useState<ThresholdConfig[]>([]);
  const [originalThresholds, setOriginalThresholds] = useState<ThresholdConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Load thresholds from local storage or initialize with defaults
  const loadThresholds = async () => {
    setLoading(true);
    try {
      // Check if there are threshold configurations in local storage
      const storedThresholds = getThresholdsFromStorage();

      if (storedThresholds && storedThresholds.length > 0) {
        // Use stored thresholds
        setThresholds(storedThresholds);
        setOriginalThresholds(JSON.parse(JSON.stringify(storedThresholds)));
      } else {
        // If no configurations exist, initialize with defaults from metricsData
        const defaultThresholds: ThresholdConfig[] = [];
        
        metricsData.forEach(category => {
          category.metrics.forEach(metric => {
            defaultThresholds.push({
              id: `${category.id}-${metric.id}`,
              metricId: metric.id,
              categoryId: category.id,
              t0Threshold: metric.thresholds.T0,
              t1Threshold: metric.thresholds.T1,
              updatedAt: new Date().toISOString()
            });
          });
        });
        
        setThresholds(defaultThresholds);
        setOriginalThresholds(JSON.parse(JSON.stringify(defaultThresholds)));
        
        // Save the default thresholds to local storage
        saveThresholdsToStorage(defaultThresholds);
      }
    } catch (error) {
      console.error("Error loading thresholds:", error);
      toast({
        title: "Error loading threshold configurations",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Refresh data (used after import)
  const refreshData = () => {
    loadThresholds();
  };

  useEffect(() => {
    loadThresholds();
  }, []);

  // Update a specific threshold
  const updateThreshold = async (
    metricId: string, 
    categoryId: string, 
    t0Threshold: string, 
    t1Threshold: string
  ) => {
    const updatedThresholds = thresholds.map(threshold => {
      if (threshold.metricId === metricId && threshold.categoryId === categoryId) {
        return {
          ...threshold,
          t0Threshold,
          t1Threshold,
          updatedAt: new Date().toISOString()
        };
      }
      return threshold;
    });
    
    setThresholds(updatedThresholds);
    setUnsavedChanges(true);
  };

  // Save all changes to local storage
  const saveChanges = async () => {
    try {
      const success = saveThresholdsToStorage(thresholds);
      
      if (success) {
        setOriginalThresholds(JSON.parse(JSON.stringify(thresholds)));
        setUnsavedChanges(false);
        
        toast({
          title: "Threshold configurations saved",
          description: "Your changes have been saved successfully",
        });
      } else {
        throw new Error("Failed to save to local storage");
      }
    } catch (error) {
      console.error("Error saving thresholds:", error);
      toast({
        title: "Error saving threshold configurations",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  // Reset changes to last saved state
  const resetChanges = () => {
    setThresholds(JSON.parse(JSON.stringify(originalThresholds)));
    setUnsavedChanges(false);
    
    toast({
      title: "Changes discarded",
      description: "Threshold configurations have been reset to their previous state",
    });
  };

  return (
    <ThresholdContext.Provider
      value={{
        thresholds,
        loading,
        updateThreshold,
        saveChanges,
        resetChanges,
        unsavedChanges,
        refreshData
      }}
    >
      {children}
    </ThresholdContext.Provider>
  );
};
