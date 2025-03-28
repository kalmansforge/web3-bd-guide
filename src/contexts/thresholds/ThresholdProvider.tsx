
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { metricsData } from "@/data/metricsData";
import { 
  saveThresholdsToStorage, 
  getThresholdsFromStorage 
} from "@/utils/storage";
import { useTemplates } from "@/contexts/templates";
import { ThresholdConfig } from "@/types/metrics";
import { ThresholdContextType } from "./types";

export const ThresholdContext = createContext<ThresholdContextType | undefined>(undefined);

export const ThresholdProvider = ({ children }: { children: ReactNode }) => {
  const [thresholds, setThresholds] = useState<ThresholdConfig[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get the templates context
  const { activeTemplate, templates } = useTemplates();

  const loadThresholds = async () => {
    setLoading(true);
    try {
      const storedThresholds = getThresholdsFromStorage();

      if (storedThresholds && storedThresholds.length > 0) {
        setThresholds(storedThresholds);
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

  const isActiveTemplateLocked = (): boolean => {
    return activeTemplate?.isLocked || false;
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
    }
  };

  return (
    <ThresholdContext.Provider
      value={{
        thresholds,
        loading,
        refreshData,
        applyTemplateThresholds,
        isActiveTemplateLocked
      }}
    >
      {children}
    </ThresholdContext.Provider>
  );
};
