
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Metric, TierType } from "@/types/metrics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getAllTierNames, getTierDisplayName, getTierInternalName } from "@/utils/localStorageUtils";

interface MetricCardProps {
  metric: Metric;
  categoryId: string;
  readOnly?: boolean;
  onUpdate?: (
    categoryId: string,
    metricId: string,
    value: { value: string | number; tier: TierType; notes?: string }
  ) => void;
}

const MetricCard = ({ metric, categoryId, readOnly = false, onUpdate }: MetricCardProps) => {
  const tierNames = getAllTierNames();
  
  const handleTierChange = (value: string) => {
    if (readOnly || !onUpdate) return;
    const internalTier = getTierInternalName(value);
    onUpdate(categoryId, metric.id, {
      value: metric.value || "",
      tier: internalTier,
      notes: metric.notes,
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (readOnly || !onUpdate) return;
    onUpdate(categoryId, metric.id, {
      value: metric.value || "",
      tier: metric.tier || null,
      notes: e.target.value,
    });
  };

  const tierColor = {
    T0: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    T1: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    null: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  };

  const displayTierName = metric.tier ? getTierDisplayName(metric.tier) : '';

  return (
    <Card className={cn("transition-all duration-300 overflow-hidden", 
      metric.tier === "T0" && "border-green-200 dark:border-green-900",
      metric.tier === "T1" && "border-yellow-200 dark:border-yellow-900",
      "animate-scale-in"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{metric.name}</CardTitle>
          {metric.tier && (
            <Badge variant="outline" className={cn(tierColor[metric.tier])}>
              {displayTierName}
            </Badge>
          )}
        </div>
        <CardDescription>{metric.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium flex items-center gap-1">
              Importance
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>{metric.importance}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{metric.importance}</p>
        </div>
        
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium">{tierNames.t0} Threshold</div>
              <p className="text-sm rounded-md px-3 py-1.5 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-200">
                {metric.thresholds.T0}
              </p>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">{tierNames.t1} Threshold</div>
              <p className="text-sm rounded-md px-3 py-1.5 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-200">
                {metric.thresholds.T1}
              </p>
            </div>
          </div>
        </div>
        
        {metric.tools && metric.tools.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Recommended Tools</div>
            <div className="flex flex-wrap gap-1.5">
              {metric.tools.slice(0, 3).map((tool) => (
                <Badge key={tool} variant="secondary" className="text-xs">{tool}</Badge>
              ))}
              {metric.tools.length > 3 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs cursor-help">+{metric.tools.length - 3} more</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        {metric.tools.slice(3).map((tool) => (
                          <p key={tool} className="text-xs">{tool}</p>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        )}
        
        {!readOnly && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="text-sm font-medium">Your Evaluation</div>
              <Select value={displayTierName} onValueChange={handleTierChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select tier classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={tierNames.t0}>{tierNames.t0} - Strategic</SelectItem>
                  <SelectItem value={tierNames.t1}>{tierNames.t1} - Secondary</SelectItem>
                </SelectContent>
              </Select>
              <Textarea 
                placeholder="Add your notes about this metric..."
                value={metric.notes || ''}
                onChange={handleNotesChange}
                className="min-h-24"
              />
            </div>
          </>
        )}
      </CardContent>
      {readOnly && metric.notes && (
        <CardFooter className="pt-2 border-t">
          <div className="space-y-1 w-full">
            <p className="text-sm font-medium">Notes</p>
            <p className="text-sm text-muted-foreground">{metric.notes}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default MetricCard;
