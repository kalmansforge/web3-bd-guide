
export type TierType = 'T0' | 'T1' | null;

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
  thresholds: {
    T0: string;
    T1: string;
  };
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
}

export interface MetricEvaluation {
  value: number | string;
  tier: TierType;
  notes?: string;
}
