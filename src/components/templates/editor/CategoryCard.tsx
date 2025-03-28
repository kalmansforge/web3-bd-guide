
import React from "react";
import { MetricCategory } from "@/types/templates";
import { Metric } from "@/types/metrics";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash } from "lucide-react";
import MetricForm from "./MetricForm";

interface CategoryCardProps {
  category: MetricCategory;
  categoryIndex: number;
  isLocked: boolean;
  handleCategoryChange: (
    categoryIndex: number,
    field: keyof MetricCategory,
    value: string
  ) => void;
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

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  categoryIndex,
  isLocked,
  handleCategoryChange,
  handleDeleteCategory,
  handleAddMetric,
  handleDeleteMetric,
  handleMetricChange,
  handleThresholdChange,
  handleToolsChange,
}) => {
  return (
    <Card key={category.id} className="overflow-hidden">
      <CardHeader className="bg-muted/40">
        <div className="flex items-start justify-between">
          <div className="space-y-1 w-full">
            <Input
              value={category.name}
              onChange={(e) =>
                handleCategoryChange(categoryIndex, "name", e.target.value)
              }
              placeholder="Category Name"
              readOnly={isLocked}
              className={`font-medium text-lg bg-transparent border-transparent focus:bg-background ${isLocked ? "bg-muted cursor-not-allowed" : ""}`}
            />
            <Textarea
              value={category.description}
              onChange={(e) =>
                handleCategoryChange(categoryIndex, "description", e.target.value)
              }
              placeholder="Category Description"
              readOnly={isLocked}
              className={`bg-transparent border-transparent resize-none focus:bg-background text-muted-foreground ${isLocked ? "bg-muted cursor-not-allowed" : ""}`}
            />
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => handleDeleteCategory(categoryIndex)}
              disabled={isLocked}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">Metrics</h4>
            <Badge variant="outline">{category.metrics.length}</Badge>
          </div>
          <Button
            onClick={() => handleAddMetric(categoryIndex)}
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
            disabled={isLocked}
          >
            <PlusCircle className="h-3 w-3" />
            Add Metric
          </Button>
        </div>

        <div className="space-y-6">
          {category.metrics.map((metric, metricIndex) => (
            <MetricForm
              key={metric.id}
              metric={metric}
              categoryIndex={categoryIndex}
              metricIndex={metricIndex}
              isLocked={isLocked}
              handleMetricChange={handleMetricChange}
              handleThresholdChange={handleThresholdChange}
              handleToolsChange={handleToolsChange}
              handleDeleteMetric={handleDeleteMetric}
            />
          ))}

          {category.metrics.length === 0 && (
            <div className="text-center py-8 border border-dashed rounded-md">
              <p className="text-muted-foreground mb-4">No metrics in this category</p>
              <Button
                onClick={() => handleAddMetric(categoryIndex)}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
                disabled={isLocked}
              >
                <PlusCircle className="h-3 w-3" />
                Add First Metric
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
