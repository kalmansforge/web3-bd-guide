import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { metricsData } from "@/data/metricsData";
import { 
  saveThresholdsToStorage, 
  getThresholdsFromStorage, 
  getAllTierNames 
} from "@/utils/storage";
import { useTemplates } from "@/contexts/TemplateContext";

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
  applyTemplateThresholds: (templateId?: string) => void;
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
  
  // Get the templates context
  const { activeTemplate, templates } = useTemplates();

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
    updatedThresholds: Record<string, string>
  ) => {
    const updatedThresholdsList = thresholds.map((threshold) => {
      if (threshold.metricId === metricId && threshold.categoryId === categoryId) {
        return {
          ...threshold,
          thresholds: updatedThresholds,
          updatedAt: new Date().toISOString()
        };
      }
      return threshold;
    });
    
    setThresholds(updatedThresholdsList);
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

  const applyTemplateThresholds = (templateId?: string) => {
    try {
      setLoading(true);
      
      // If no template ID is provided, use the active template
      const template = templateId 
        ? templates.find(t => t.id === templateId) 
        : activeTemplate;
      
      if (!template) {
        throw new Error("Template not found");
      }
      
      // Create updated thresholds based on the template
      const updatedThresholds: ThresholdConfig[] = [];
      
      template.categories.forEach(category => {
        category.metrics.forEach(metric => {
          updatedThresholds.push({
            id: `${category.id}-${metric.id}`,
            metricId: metric.id,
            categoryId: category.id,
            thresholds: metric.thresholds,
            updatedAt: new Date().toISOString()
          });
        });
      });
      
      // Set and save the updated thresholds
      setThresholds(updatedThresholds);
      setOriginalThresholds(JSON.parse(JSON.stringify(updatedThresholds)));
      saveThresholdsToStorage(updatedThresholds);
      
      toast({
        title: "Thresholds updated",
        description: `Threshold configurations have been updated based on the "${template.name}" template`,
      });
    } catch (error) {
      console.error("Error applying template thresholds:", error);
      toast({
        title: "Error updating thresholds",
        description: "Failed to apply template thresholds",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setUnsavedChanges(false);
    }
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
        refreshData,
        applyTemplateThresholds
      }}
    >
      {children}
    </ThresholdContext.Provider>
  );
};
