
export type TierType = string | null;

export interface MetricCategory {
  id: string;
  name: string;
  description: string;
  metrics: Metric[];
}

export interface Metric {
  id: string;
  name: string;
  description: string;
  importance: string;
  thresholds: Record<string, string>;
  tools: string[];
  value?: number | string;
  tier?: TierType;
  notes?: string;
}

export interface ProjectEvaluation {
  id: string;
  name: string;
  date: string;
  metrics: Record<string, MetricEvaluation>;
  overallScore?: number;
  overallTier?: TierType;
  notes?: string;
  templateId?: string; // Added templateId to track which template was used
}

export interface MetricEvaluation {
  value: number | string;
  tier: TierType;
  notes?: string;
}

export interface ThresholdConfig {
  id: string;
  metricId: string;
  categoryId: string;
  thresholds: Record<string, string>;
  updatedAt: string;
}
