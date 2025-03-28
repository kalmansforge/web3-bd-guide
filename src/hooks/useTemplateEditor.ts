
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useTemplates } from "@/contexts/TemplateContext";
import { EvaluationTemplate, MetricCategory } from "@/types/templates";
import { Metric } from "@/types/metrics";

export const useTemplateEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { templates, updateTemplate, duplicateTemplateById } = useTemplates();
  const [template, setTemplate] = useState<EvaluationTemplate | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Load template data
  useEffect(() => {
    if (id) {
      const foundTemplate = templates.find((t) => t.id === id);
      if (foundTemplate) {
        setTemplate(JSON.parse(JSON.stringify(foundTemplate))); // Deep clone to avoid reference issues
        setIsLocked(foundTemplate.isLocked || false);
      } else {
        toast.error("Template not found");
        navigate("/settings?tab=templates");
      }
    }
  }, [id, templates, navigate]);

  // Handle duplicate and edit flow for locked templates
  const handleDuplicateAndEdit = () => {
    if (template && isLocked) {
      duplicateTemplateById(template.id);
      toast.success("Template duplicated", {
        description: "You can now edit your copy of this template"
      });
      navigate("/settings?tab=templates");
    }
  };

  // Handle back button with unsaved changes warning
  const handleBackClick = () => {
    if (hasUnsavedChanges && !isLocked) {
      // Alert dialog will handle this case
    } else {
      navigate("/settings?tab=templates");
    }
  };

  // Save template changes
  const handleSaveTemplate = () => {
    if (template && !isLocked) {
      updateTemplate({
        ...template,
        updatedAt: new Date().toISOString(),
      });
      setHasUnsavedChanges(false);
      toast.success("Template saved successfully");
    }
  };

  // Handle template detail changes
  const handleTemplateChange = (field: keyof EvaluationTemplate, value: string) => {
    if (template && !isLocked) {
      setTemplate({
        ...template,
        [field]: value,
      });
      setHasUnsavedChanges(true);
    }
  };

  // Handle category changes
  const handleCategoryChange = (
    categoryIndex: number,
    field: keyof MetricCategory,
    value: string
  ) => {
    if (template && !isLocked) {
      const updatedCategories = [...template.categories];
      updatedCategories[categoryIndex] = {
        ...updatedCategories[categoryIndex],
        [field]: value,
      };

      setTemplate({
        ...template,
        categories: updatedCategories,
      });
      setHasUnsavedChanges(true);
    }
  };

  // Add a new category
  const handleAddCategory = () => {
    if (template && !isLocked) {
      const newCategory: MetricCategory = {
        id: `category-${Date.now()}`,
        name: "New Category",
        description: "Enter category description",
        metrics: [],
      };

      setTemplate({
        ...template,
        categories: [...template.categories, newCategory],
      });
      setHasUnsavedChanges(true);
    }
  };

  // Delete a category
  const handleDeleteCategory = (categoryIndex: number) => {
    if (template && !isLocked) {
      const updatedCategories = [...template.categories];
      updatedCategories.splice(categoryIndex, 1);

      setTemplate({
        ...template,
        categories: updatedCategories,
      });
      setHasUnsavedChanges(true);
    }
  };

  // Add a new metric to a category
  const handleAddMetric = (categoryIndex: number) => {
    if (template && !isLocked) {
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

      const updatedCategories = [...template.categories];
      updatedCategories[categoryIndex].metrics.push(newMetric);

      setTemplate({
        ...template,
        categories: updatedCategories,
      });
      setHasUnsavedChanges(true);
    }
  };

  // Handle metric changes
  const handleMetricChange = (
    categoryIndex: number,
    metricIndex: number,
    field: keyof Metric,
    value: any
  ) => {
    if (template && !isLocked) {
      const updatedCategories = [...template.categories];
      const updatedMetric = {
        ...updatedCategories[categoryIndex].metrics[metricIndex],
        [field]: value,
      };
      
      updatedCategories[categoryIndex].metrics[metricIndex] = updatedMetric;

      setTemplate({
        ...template,
        categories: updatedCategories,
      });
      setHasUnsavedChanges(true);
    }
  };

  // Handle threshold changes
  const handleThresholdChange = (
    categoryIndex: number,
    metricIndex: number,
    tier: string,
    value: string
  ) => {
    if (template && !isLocked) {
      const updatedCategories = [...template.categories];
      const updatedMetric = {
        ...updatedCategories[categoryIndex].metrics[metricIndex],
        thresholds: {
          ...updatedCategories[categoryIndex].metrics[metricIndex].thresholds,
          [tier]: value,
        },
      };
      
      updatedCategories[categoryIndex].metrics[metricIndex] = updatedMetric;

      setTemplate({
        ...template,
        categories: updatedCategories,
      });
      setHasUnsavedChanges(true);
    }
  };

  // Delete a metric
  const handleDeleteMetric = (categoryIndex: number, metricIndex: number) => {
    if (template && !isLocked) {
      const updatedCategories = [...template.categories];
      updatedCategories[categoryIndex].metrics.splice(metricIndex, 1);

      setTemplate({
        ...template,
        categories: updatedCategories,
      });
      setHasUnsavedChanges(true);
    }
  };

  // Handle tool item changes
  const handleToolsChange = (
    categoryIndex: number,
    metricIndex: number,
    toolsText: string
  ) => {
    if (template && !isLocked) {
      const tools = toolsText
        .split('\n')
        .map(tool => tool.trim())
        .filter(tool => tool.length > 0);

      const updatedCategories = [...template.categories];
      updatedCategories[categoryIndex].metrics[metricIndex].tools = tools;

      setTemplate({
        ...template,
        categories: updatedCategories,
      });
      setHasUnsavedChanges(true);
    }
  };

  return {
    template,
    activeTab,
    setActiveTab,
    hasUnsavedChanges,
    isLocked,
    handleDuplicateAndEdit,
    handleBackClick,
    handleSaveTemplate,
    handleTemplateChange,
    handleCategoryChange,
    handleAddCategory,
    handleDeleteCategory,
    handleAddMetric,
    handleDeleteMetric,
    handleMetricChange,
    handleThresholdChange,
    handleToolsChange
  };
};
