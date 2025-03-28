
import React from "react";
import { EvaluationTemplate, MetricCategory } from "@/types/templates";
import { Metric } from "@/types/metrics";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CategoryCard from "./CategoryCard";

interface CategoriesPanelProps {
  template: EvaluationTemplate;
  isLocked: boolean;
  handleCategoryChange: (
    categoryIndex: number,
    field: keyof MetricCategory,
    value: string
  ) => void;
  handleAddCategory: () => void;
  handleDeleteCategory: (categoryIndex: number) => void;
  handleAddMetric: (categoryIndex: number) => void;
  handleDeleteMetric: (categoryIndex: number, metricIndex: number) => void;
  handleMetricChange: (
    categoryIndex: number,
    metricIndex: number,
    field: keyof Metric,
    value: any
  ) => void;
  handleThresholdChange: (
    categoryIndex: number,
    metricIndex: number,
    tier: string,
    value: string
  ) => void;
  handleToolsChange: (
    categoryIndex: number,
    metricIndex: number,
    toolsText: string
  ) => void;
}

const CategoriesPanel: React.FC<CategoriesPanelProps> = ({
  template,
  isLocked,
  handleCategoryChange,
  handleAddCategory,
  handleDeleteCategory,
  handleAddMetric,
  handleDeleteMetric,
  handleMetricChange,
  handleThresholdChange,
  handleToolsChange,
}) => {
  return (
    <>
      {isLocked && (
        <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-md mb-4 border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
            This template is locked
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            This is a built-in template that cannot be edited. You can duplicate it to create your own editable version.
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Categories</h3>
        {!isLocked && (
          <Button onClick={handleAddCategory} size="sm" className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Category
          </Button>
        )}
      </div>

      <div className="space-y-6 mt-4">
        {template.categories.map((category, categoryIndex) => (
          <CategoryCard
            key={category.id}
            category={category}
            categoryIndex={categoryIndex}
            isLocked={isLocked}
            handleCategoryChange={handleCategoryChange}
            handleDeleteCategory={handleDeleteCategory}
            handleAddMetric={handleAddMetric}
            handleDeleteMetric={handleDeleteMetric}
            handleMetricChange={handleMetricChange}
            handleThresholdChange={handleThresholdChange}
            handleToolsChange={handleToolsChange}
          />
        ))}

        {template.categories.length === 0 && (
          <div className="text-center py-12 border border-dashed rounded-md">
            <p className="text-muted-foreground mb-4">No categories defined yet</p>
            <Button
              onClick={handleAddCategory}
              className="flex items-center gap-1"
              disabled={isLocked}
            >
              <PlusCircle className="h-4 w-4" />
              Add First Category
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoriesPanel;
