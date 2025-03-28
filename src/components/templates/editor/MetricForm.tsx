
import React from "react";
import { Metric } from "@/types/metrics";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trash } from "lucide-react";

interface MetricFormProps {
  metric: Metric;
  categoryIndex: number;
  metricIndex: number;
  isLocked: boolean;
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
  handleDeleteMetric: (categoryIndex: number, metricIndex: number) => void;
}

const MetricForm: React.FC<MetricFormProps> = ({
  metric,
  categoryIndex,
  metricIndex,
  isLocked,
  handleMetricChange,
  handleThresholdChange,
  handleToolsChange,
  handleDeleteMetric,
}) => {
  return (
    <div className="border rounded-md p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-full">
          <Input
            value={metric.name}
            onChange={(e) =>
              handleMetricChange(
                categoryIndex,
                metricIndex,
                "name",
                e.target.value
              )
            }
            placeholder="Metric Name"
            readOnly={isLocked}
            className={`font-medium bg-transparent border-transparent focus:bg-background ${isLocked ? "bg-muted cursor-not-allowed" : ""}`}
          />
          <Textarea
            value={metric.description}
            onChange={(e) =>
              handleMetricChange(
                categoryIndex,
                metricIndex,
                "description",
                e.target.value
              )
            }
            placeholder="Metric Description"
            rows={2}
            readOnly={isLocked}
            className={`bg-transparent border-transparent resize-none focus:bg-background text-muted-foreground ${isLocked ? "bg-muted cursor-not-allowed" : ""}`}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={() => handleDeleteMetric(categoryIndex, metricIndex)}
          disabled={isLocked}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Importance</label>
          <Input
            value={metric.importance}
            onChange={(e) =>
              handleMetricChange(
                categoryIndex,
                metricIndex,
                "importance",
                e.target.value
              )
            }
            placeholder="e.g., High, Medium, Low"
            readOnly={isLocked}
            className={`text-sm ${isLocked ? "bg-muted cursor-not-allowed" : ""}`}
          />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
        <h5 className="text-sm font-medium">Thresholds</h5>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                T0
              </Badge>
              <span>Threshold</span>
            </label>
            <Textarea
              value={metric.thresholds.T0 || ""}
              onChange={(e) =>
                handleThresholdChange(
                  categoryIndex,
                  metricIndex,
                  "T0",
                  e.target.value
                )
              }
              placeholder="Enter T0 threshold criteria"
              readOnly={isLocked}
              className={`min-h-[80px] text-sm ${isLocked ? "bg-muted cursor-not-allowed" : ""}`}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                T1
              </Badge>
              <span>Threshold</span>
            </label>
            <Textarea
              value={metric.thresholds.T1 || ""}
              onChange={(e) =>
                handleThresholdChange(
                  categoryIndex,
                  metricIndex,
                  "T1",
                  e.target.value
                )
              }
              placeholder="Enter T1 threshold criteria"
              readOnly={isLocked}
              className={`min-h-[80px] text-sm ${isLocked ? "bg-muted cursor-not-allowed" : ""}`}
            />
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
        <label className="text-sm font-medium">Tools (one per line)</label>
        <Textarea
          value={metric.tools.join("\n")}
          onChange={(e) =>
            handleToolsChange(
              categoryIndex,
              metricIndex,
              e.target.value
            )
          }
          placeholder="Enter tools, one per line"
          rows={4}
          readOnly={isLocked}
          className={`min-h-[80px] text-sm ${isLocked ? "bg-muted cursor-not-allowed" : ""}`}
        />
      </div>
    </div>
  );
};

export default MetricForm;
