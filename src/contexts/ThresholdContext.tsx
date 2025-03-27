
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

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
  const { user } = useAuth();
  const [thresholds, setThresholds] = useState<ThresholdConfig[]>([]);
  const [originalThresholds, setOriginalThresholds] = useState<ThresholdConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Load thresholds from database or initialize with defaults
  useEffect(() => {
    const fetchThresholds = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Check if user already has threshold configurations
        const { data, error } = await supabase
          .from("threshold_configs")
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;

        if (data && data.length > 0) {
          // Format the data to match our context structure
          const formattedThresholds = data.map(item => ({
            id: item.id,
            metricId: item.metric_id,
            categoryId: item.category_id,
            t0Threshold: item.t0_threshold,
            t1Threshold: item.t1_threshold,
            updatedAt: item.updated_at
          }));
          setThresholds(formattedThresholds);
          setOriginalThresholds(JSON.parse(JSON.stringify(formattedThresholds)));
        } else {
          // If no configurations exist, initialize with defaults from metricsData
          const { data: metricsData } = await import("@/data/metricsData");
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
          
          // Save the default thresholds to the database
          await Promise.all(
            defaultThresholds.map(async threshold => {
              await supabase.from("threshold_configs").insert({
                user_id: user.id,
                metric_id: threshold.metricId,
                category_id: threshold.categoryId,
                t0_threshold: threshold.t0Threshold,
                t1_threshold: threshold.t1Threshold
              });
            })
          );
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

    fetchThresholds();
  }, [user]);

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

  // Save all changes to database
  const saveChanges = async () => {
    if (!user) return;
    
    try {
      await Promise.all(
        thresholds.map(async threshold => {
          // Find the corresponding threshold in the database
          const { data } = await supabase
            .from("threshold_configs")
            .select("id")
            .eq("user_id", user.id)
            .eq("metric_id", threshold.metricId)
            .eq("category_id", threshold.categoryId)
            .single();
          
          if (data) {
            // Update existing record
            await supabase
              .from("threshold_configs")
              .update({
                t0_threshold: threshold.t0Threshold,
                t1_threshold: threshold.t1Threshold,
                updated_at: new Date().toISOString()
              })
              .eq("id", data.id);
          } else {
            // Insert new record
            await supabase
              .from("threshold_configs")
              .insert({
                user_id: user.id,
                metric_id: threshold.metricId,
                category_id: threshold.categoryId,
                t0_threshold: threshold.t0Threshold,
                t1_threshold: threshold.t1Threshold
              });
          }
        })
      );
      
      setOriginalThresholds(JSON.parse(JSON.stringify(thresholds)));
      setUnsavedChanges(false);
      
      toast({
        title: "Threshold configurations saved",
        description: "Your changes have been saved successfully",
      });
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
        unsavedChanges
      }}
    >
      {children}
    </ThresholdContext.Provider>
  );
};
