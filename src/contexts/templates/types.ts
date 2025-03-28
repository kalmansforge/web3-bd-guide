
import { EvaluationTemplate } from "@/types/templates";

export interface TemplateContextType {
  templates: EvaluationTemplate[];
  activeTemplate: EvaluationTemplate;
  setActiveTemplateId: (id: string) => void;
  addTemplate: (template: EvaluationTemplate) => void;
  updateTemplate: (template: EvaluationTemplate) => void;
  removeTemplate: (id: string) => boolean;
  duplicateTemplateById: (id: string) => boolean;
  importTemplateFromJson: (json: string) => {success: boolean; template?: EvaluationTemplate};
  exportTemplateById: (id: string) => boolean;
  createTemplate: () => EvaluationTemplate;
  loading: boolean;
  refreshData: () => void;
}
