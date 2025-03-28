
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useTemplates } from "@/contexts/TemplateContext";
import { useTemplateDetails } from "./useTemplateDetails";
import { useCategoryOperations } from "./useCategoryOperations";
import { useMetricOperations } from "./useMetricOperations";
import { EvaluationTemplate, MetricCategory } from "@/types/templates";
import { Metric } from "@/types/metrics";

export const useTemplateEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { templates, refreshData } = useTemplates();
  const [template, setTemplate] = useState<EvaluationTemplate | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Import the focused hooks
  const {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    handleDuplicateAndEdit,
    handleBackClick,
    handleSaveTemplate,
    handleTemplateChange,
  } = useTemplateDetails(template, isLocked);

  const {
    handleCategoryChange,
    handleAddCategory,
    handleDeleteCategory,
  } = useCategoryOperations(template, isLocked, setHasUnsavedChanges);

  const {
    handleAddMetric,
    handleMetricChange,
    handleThresholdChange,
    handleDeleteMetric,
    handleToolsChange,
  } = useMetricOperations(template, isLocked, setHasUnsavedChanges);

  // Load template data with a small delay to ensure templates are loaded
  useEffect(() => {
    const loadTemplate = async () => {
      setIsLoading(true);
      
      // Refresh data first to ensure we have the latest templates
      await refreshData();
      
      if (id) {
        const foundTemplate = templates.find((t) => t.id === id);
        if (foundTemplate) {
          setTemplate(JSON.parse(JSON.stringify(foundTemplate))); // Deep clone to avoid reference issues
          setIsLocked(foundTemplate.isLocked || false);
        } else {
          toast.error("Template not found", {
            description: "The selected template could not be found"
          });
          navigate("/settings?tab=templates");
        }
      }
      
      setIsLoading(false);
    };
    
    loadTemplate();
  }, [id, templates, navigate, refreshData]);
  
  // Wrapper functions that update the template state
  const templateChangeWrapper = (field: keyof EvaluationTemplate, value: string) => {
    if (template && !isLocked) {
      const updatedTemplate = handleTemplateChange(field, value);
      setTemplate(updatedTemplate);
      setHasUnsavedChanges(true);
    }
  };

  const categoryChangeWrapper = (
    categoryIndex: number,
    field: keyof MetricCategory,
    value: string
  ) => {
    if (template && !isLocked) {
      const updatedTemplate = handleCategoryChange(categoryIndex, field, value, template);
      setTemplate(updatedTemplate);
    }
  };

  const addCategoryWrapper = () => {
    if (template && !isLocked) {
      const updatedTemplate = handleAddCategory(template);
      setTemplate(updatedTemplate);
    }
  };

  const deleteCategoryWrapper = (categoryIndex: number) => {
    if (template && !isLocked) {
      const updatedTemplate = handleDeleteCategory(categoryIndex, template);
      setTemplate(updatedTemplate);
    }
  };

  const addMetricWrapper = (categoryIndex: number) => {
    if (template && !isLocked) {
      const updatedTemplate = handleAddMetric(categoryIndex, template);
      setTemplate(updatedTemplate);
    }
  };

  const metricChangeWrapper = (
    categoryIndex: number,
    metricIndex: number,
    field: keyof Metric,
    value: any
  ) => {
    if (template && !isLocked) {
      const updatedTemplate = handleMetricChange(categoryIndex, metricIndex, field, value, template);
      setTemplate(updatedTemplate);
    }
  };

  const thresholdChangeWrapper = (
    categoryIndex: number,
    metricIndex: number,
    tier: string,
    value: string
  ) => {
    if (template && !isLocked) {
      const updatedTemplate = handleThresholdChange(categoryIndex, metricIndex, tier, value, template);
      setTemplate(updatedTemplate);
    }
  };

  const deleteMetricWrapper = (categoryIndex: number, metricIndex: number) => {
    if (template && !isLocked) {
      const updatedTemplate = handleDeleteMetric(categoryIndex, metricIndex, template);
      setTemplate(updatedTemplate);
    }
  };

  const toolsChangeWrapper = (
    categoryIndex: number,
    metricIndex: number,
    toolsText: string
  ) => {
    if (template && !isLocked) {
      const updatedTemplate = handleToolsChange(categoryIndex, metricIndex, toolsText, template);
      setTemplate(updatedTemplate);
    }
  };

  return {
    template,
    activeTab,
    setActiveTab,
    hasUnsavedChanges,
    isLocked,
    isLoading,
    handleDuplicateAndEdit,
    handleBackClick,
    handleSaveTemplate,
    handleTemplateChange: templateChangeWrapper,
    handleCategoryChange: categoryChangeWrapper,
    handleAddCategory: addCategoryWrapper,
    handleDeleteCategory: deleteCategoryWrapper,
    handleAddMetric: addMetricWrapper,
    handleDeleteMetric: deleteMetricWrapper,
    handleMetricChange: metricChangeWrapper,
    handleThresholdChange: thresholdChangeWrapper,
    handleToolsChange: toolsChangeWrapper,
  };
};
