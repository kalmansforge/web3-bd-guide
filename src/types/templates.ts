import { Metric } from "./metrics";

export interface MetricCategory {
  id: string;
  name: string;
  description: string;
  metrics: Metric[];
}

export interface EvaluationTemplate {
  id: string;
  name: string;
  description: string;
  author: string;
  "aiui-author"?: string; // AI model used to create the template
  createdAt: string;
  updatedAt: string;
  isBuiltIn: boolean;
  isLocked?: boolean;  // Added isLocked property
  categories: MetricCategory[];
}

export interface TemplateStorage {
  templates: EvaluationTemplate[];
  activeTemplateId: string;
}
