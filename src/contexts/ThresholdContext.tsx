
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { metricsData } from "@/data/metricsData";
import { 
  saveThresholdsToStorage, 
  getThresholdsFromStorage, 
  getAllTierNames 
} from "@/utils/storage";

export type ThresholdConfig = {
  id: string;
  metricId: string;
  categoryId: string;
  thresholds: Record<string, string>;
  updatedAt: string;
};

type ThresholdContextType = {
  thresholds: ThresholdConfig[];
  loading: boolean;
  updateThreshold: (metricId: string, categoryId: string, thresholds: Record<string, string>) => Promise<void>;
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

  const loadThresholds = async () => {
    setLoading(true);
    try {
      const storedThresholds = getThresholdsFromStorage();

      if (storedThresholds && storedThresholds.length > 0) {
        setThresholds(storedThresholds);
        setOriginalThresholds(JSON.parse(JSON.stringify(storedThresholds)));
      } else {
        const defaultThresholds: ThresholdConfig[] = [];
        
        metricsData.forEach(category => {
          category.metrics.forEach(metric => {
            defaultThresholds.push({
              id: `${category.id}-${metric.id}`,
              metricId: metric.id,
              categoryId: category.id,
              thresholds: metric.thresholds,
              updatedAt: new Date().toISOString()
            });
          });
        });
        
        setThresholds(defaultThresholds);
        setOriginalThresholds(JSON.parse(JSON.stringify(defaultThresholds)));
        
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

  const refreshData = () => {
    loadThresholds();
  };

  useEffect(() => {
    loadThresholds();
  }, []);

  const updateThreshold = async (
    metricId: string, 
    categoryId: string, 
    thresholds: Record<string, string>
  ) => {
    const updatedThresholds = thresholds.map((threshold: ThresholdConfig) => {
      if (threshold.metricId === metricId && threshold.categoryId === categoryId) {
        return {
          ...threshold,
          thresholds,
          updatedAt: new Date().toISOString()
        };
      }
      return threshold;
    });
    
    setThresholds(updatedThresholds);
    setUnsavedChanges(true);
  };

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
