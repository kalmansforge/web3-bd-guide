
import { EvaluationTemplate } from "@/types/templates";

// Storage key for templates
export const TEMPLATES_KEY = 'web3_templates';

// Basic empty template to start with
export const BASIC_TEMPLATE: EvaluationTemplate = {
  id: "basic-template",
  name: "Basic Template",
  description: "A starter template with minimal structure. You can customize this or import your own templates.",
  author: "You",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isBuiltIn: false,
  categories: []
};

// Initial template storage state
export const initialStorage = {
  templates: [BASIC_TEMPLATE],
  activeTemplateId: BASIC_TEMPLATE.id
};
