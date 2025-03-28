
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Info, ChevronDown, ChevronUp, Star, Activity, CloudLightning } from "lucide-react";
import { cn } from "@/lib/utils";
import { Metric, MetricEvaluation, TierType } from '@/types/metrics';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getAllTierNames, getTierDisplayName } from '@/utils/storage';

interface MetricCardProps {
  metric: Metric;
  category: string;
  categoryId?: string; // Added for backwards compatibility
  evaluation?: MetricEvaluation;
  onViewDetail?: () => void;
  onUpdate?: (categoryId: string, metricId: string, evaluation: MetricEvaluation) => void;
  isPreview?: boolean;
  readOnly?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  category,
  categoryId,
  evaluation,
  onViewDetail,
  onUpdate,
  isPreview = false,
  readOnly = false
}) => {
  const [expanded, setExpanded] = useState(false);
  const tierNames = getAllTierNames();
  
  // Use category or categoryId (for backward compatibility)
  const effectiveCategory = category || categoryId || "";
  
  // Get tier names from the evaluation if available
  const evalTier = evaluation?.tier || null;
  const evalTierDisplay = evalTier ? getTierDisplayName(evalTier) : null;
  
  // Get importance styling
  const getImportanceColor = (importance: string) => {
    if (importance.includes("High") || importance.includes("Strong")) {
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
    }
    if (importance.includes("Medium") || importance.includes("Moderate")) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };
  
  // Get category styling
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'foundational':
        return "text-blue-600 dark:text-blue-400";
      case 'product':
        return "text-purple-600 dark:text-purple-400";
      case 'financial':
        return "text-green-600 dark:text-green-400";
      case 'strategic':
        return "text-amber-600 dark:text-amber-400";
      case 'ecosystem':
        return "text-rose-600 dark:text-rose-400";
      case 'risk':
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'foundational':
        return <Star className="h-4 w-4" />;
      case 'product':
        return <Activity className="h-4 w-4" />;
      case 'financial':
        return <Star className="h-4 w-4" />;
      case 'strategic':
        return <Star className="h-4 w-4" />;
      case 'ecosystem':
        return <Activity className="h-4 w-4" />;
      case 'risk':
        return <CloudLightning className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  // Render thresholds in an easily readable format
  const renderThresholds = () => {
    if (!metric.thresholds) return null;
    
    const firstTierName = tierNames && tierNames.length > 0 ? tierNames[0].internalName : 'T0';
    const secondTierName = tierNames && tierNames.length > 1 ? tierNames[1].internalName : 'T1';
    
    const firstTierDisplay = tierNames && tierNames.length > 0 ? tierNames[0].displayName : 'T0';
    const secondTierDisplay = tierNames && tierNames.length > 1 ? tierNames[1].displayName : 'T1';
    
    return (
      <div className="space-y-2 text-sm">
        <p className="font-medium">Classification Thresholds:</p>
        <div className="grid grid-cols-1 gap-2">
          {firstTierName && metric.thresholds[firstTierName] && (
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                {firstTierDisplay}
              </Badge>
              <span className="text-muted-foreground">{metric.thresholds[firstTierName]}</span>
            </div>
          )}
          
          {secondTierName && metric.thresholds[secondTierName] && (
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                {secondTierDisplay}
              </Badge>
              <span className="text-muted-foreground">{metric.thresholds[secondTierName]}</span>
            </div>
          )}
          
          {Object.keys(metric.thresholds).filter(key => key !== firstTierName && key !== secondTierName).map(tierKey => (
            <div key={tierKey} className="flex items-start gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {getTierDisplayName(tierKey)}
              </Badge>
              <span className="text-muted-foreground">{metric.thresholds[tierKey]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className={cn(
      "transition-all duration-200",
      expanded ? "shadow-md" : "shadow-sm",
      isPreview ? "opacity-80" : ""
    )}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">{metric.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {metric.description}
            </CardDescription>
          </div>
          
          {!isPreview && !readOnly && (
            <div className="flex flex-col gap-2">
              {evalTier && (
                <Badge className={cn(
                  evalTier === "T0" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                  evalTier === "T1" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" :
                  "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                )}>
                  {evalTierDisplay}
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-7 w-7"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="pb-3 space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <div className={cn("flex items-center gap-1", getCategoryColor(effectiveCategory))}>
              {getCategoryIcon(effectiveCategory)}
              <span className="capitalize">{effectiveCategory}</span>
            </div>
            
            <Separator orientation="vertical" className="h-4" />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="secondary"
                    className={getImportanceColor(metric.importance)}
                  >
                    {metric.importance.includes("Strong") ? "High" : 
                     metric.importance.includes("Moderate") ? "Medium" : "Standard"} Importance
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">{metric.importance}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Separator />
          
          {renderThresholds()}
          
          {metric.tools && metric.tools.length > 0 && (
            <div className="space-y-2 text-sm">
              <p className="font-medium">Suggested Tools:</p>
              <div className="flex flex-wrap gap-1">
                {metric.tools.slice(0, 3).map((tool, i) => (
                  <Badge key={i} variant="outline" className="bg-slate-50 dark:bg-slate-900">
                    {tool}
                  </Badge>
                ))}
                {metric.tools.length > 3 && (
                  <Badge variant="outline" className="bg-slate-50 dark:bg-slate-900">
                    +{metric.tools.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
      
      {(expanded || onViewDetail) && (
        <CardFooter className={cn("px-6 pb-4 pt-0", isPreview ? "hidden" : "")}>
          {onViewDetail && (
            <Button
              variant="outline"
              className="w-full"
              onClick={onViewDetail}
              size="sm"
            >
              {expanded ? "Edit Evaluation" : "View Details"}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default MetricCard;
