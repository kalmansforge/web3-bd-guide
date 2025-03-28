
import { EvaluationTemplate } from "@/types/templates";
import { Metric } from "@/types/metrics";

export const useMetricOperations = (template: EvaluationTemplate | null, isLocked: boolean, setHasUnsavedChanges: (value: boolean) => void) => {
  // Add a new metric to a category
  const handleAddMetric = (categoryIndex: number, currentTemplate: EvaluationTemplate) => {
    if (!currentTemplate || isLocked) {
      return currentTemplate;
    }

    const newMetric: Metric = {
      id: `metric-${Date.now()}`,
      name: "New Metric",
      description: "Enter metric description",
      importance: "Medium",
      thresholds: {
        T0: "Enter T0 threshold criteria",
        T1: "Enter T1 threshold criteria",
      },
      tools: [],
    };

    const updatedCategories = [...currentTemplate.categories];
    updatedCategories[categoryIndex].metrics.push(newMetric);

    setHasUnsavedChanges(true);
    return {
      ...currentTemplate,
      categories: updatedCategories,
    };
  };

  // Handle metric changes
  const handleMetricChange = (
    categoryIndex: number,
    metricIndex: number,
    field: keyof Metric,
    value: any,
    currentTemplate: EvaluationTemplate
  ) => {
    if (!currentTemplate || isLocked) {
      return currentTemplate;
    }

    const updatedCategories = [...currentTemplate.categories];
    const updatedMetric = {
      ...updatedCategories[categoryIndex].metrics[metricIndex],
      [field]: value,
    };
    
    updatedCategories[categoryIndex].metrics[metricIndex] = updatedMetric;

    setHasUnsavedChanges(true);
    return {
      ...currentTemplate,
      categories: updatedCategories,
    };
  };

  // Handle threshold changes
  const handleThresholdChange = (
    categoryIndex: number,
    metricIndex: number,
    tier: string,
    value: string,
    currentTemplate: EvaluationTemplate
  ) => {
    if (!currentTemplate || isLocked) {
      return currentTemplate;
    }

    const updatedCategories = [...currentTemplate.categories];
    const updatedMetric = {
      ...updatedCategories[categoryIndex].metrics[metricIndex],
      thresholds: {
        ...updatedCategories[categoryIndex].metrics[metricIndex].thresholds,
        [tier]: value,
      },
    };
    
    updatedCategories[categoryIndex].metrics[metricIndex] = updatedMetric;

    setHasUnsavedChanges(true);
    return {
      ...currentTemplate,
      categories: updatedCategories,
    };
  };

  // Delete a metric
  const handleDeleteMetric = (categoryIndex: number, metricIndex: number, currentTemplate: EvaluationTemplate) => {
    if (!currentTemplate || isLocked) {
      return currentTemplate;
    }

    const updatedCategories = [...currentTemplate.categories];
    updatedCategories[categoryIndex].metrics.splice(metricIndex, 1);

    setHasUnsavedChanges(true);
    return {
      ...currentTemplate,
      categories: updatedCategories,
    };
  };

  // Handle tool item changes
  const handleToolsChange = (
    categoryIndex: number,
    metricIndex: number,
    toolsText: string,
    currentTemplate: EvaluationTemplate
  ) => {
    if (!currentTemplate || isLocked) {
      return currentTemplate;
    }

    const tools = toolsText
      .split('\n')
      .map(tool => tool.trim())
      .filter(tool => tool.length > 0);

    const updatedCategories = [...currentTemplate.categories];
    updatedCategories[categoryIndex].metrics[metricIndex].tools = tools;

    setHasUnsavedChanges(true);
    return {
      ...currentTemplate,
      categories: updatedCategories,
    };
  };

  return {
    handleAddMetric,
    handleMetricChange,
    handleThresholdChange,
    handleDeleteMetric,
    handleToolsChange,
  };
};
