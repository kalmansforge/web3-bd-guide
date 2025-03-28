
import { ThresholdConfig } from "@/types/metrics";

export type ThresholdContextType = {
  thresholds: ThresholdConfig[];
  loading: boolean;
  refreshData: () => void;
  applyTemplateThresholds: (templateId?: string) => void;
  isActiveTemplateLocked: () => boolean;
};
