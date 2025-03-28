
import { ThresholdConfig } from "@/types/metrics";

export type ThresholdContextType = {
  thresholds: ThresholdConfig[];
  loading: boolean;
  updateThreshold: (metricId: string, categoryId: string, thresholds: Record<string, string>) => Promise<void>;
  saveChanges: () => Promise<void>;
  resetChanges: () => void;
  unsavedChanges: boolean;
  refreshData: () => void;
  applyTemplateThresholds: (templateId?: string) => void;
  isActiveTemplateLocked: () => boolean;  // Added this function
};
