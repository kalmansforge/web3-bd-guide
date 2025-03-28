
import { EvaluationTemplate, MetricCategory } from "@/types/templates";

export const useCategoryOperations = (template: EvaluationTemplate | null, isLocked: boolean, setHasUnsavedChanges: (value: boolean) => void) => {
  // Handle category changes
  const handleCategoryChange = (
    categoryIndex: number,
    field: keyof MetricCategory,
    value: string,
    currentTemplate: EvaluationTemplate
  ) => {
    if (!currentTemplate || isLocked) {
      return currentTemplate;
    }

    const updatedCategories = [...currentTemplate.categories];
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      [field]: value,
    };

    setHasUnsavedChanges(true);
    return {
      ...currentTemplate,
      categories: updatedCategories,
    };
  };

  // Add a new category
  const handleAddCategory = (currentTemplate: EvaluationTemplate) => {
    if (!currentTemplate || isLocked) {
      return currentTemplate;
    }

    const newCategory: MetricCategory = {
      id: `category-${Date.now()}`,
      name: "New Category",
      description: "Enter category description",
      metrics: [],
    };

    setHasUnsavedChanges(true);
    return {
      ...currentTemplate,
      categories: [...currentTemplate.categories, newCategory],
    };
  };

  // Delete a category
  const handleDeleteCategory = (categoryIndex: number, currentTemplate: EvaluationTemplate) => {
    if (!currentTemplate || isLocked) {
      return currentTemplate;
    }

    const updatedCategories = [...currentTemplate.categories];
    updatedCategories.splice(categoryIndex, 1);

    setHasUnsavedChanges(true);
    return {
      ...currentTemplate,
      categories: updatedCategories,
    };
  };

  return {
    handleCategoryChange,
    handleAddCategory,
    handleDeleteCategory,
  };
};
