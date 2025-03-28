
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
  createdAt: string;
  updatedAt: string;
  isBuiltIn: boolean;
  categories: MetricCategory[];
}

export interface TemplateStorage {
  templates: EvaluationTemplate[];
  activeTemplateId: string;
}
