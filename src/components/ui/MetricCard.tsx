
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Metric, MetricEvaluation, TierType } from '@/types/metrics';
import { getAllTierNames, getTierDisplayName } from '@/utils/storage';
import MetricThresholds from './metric-card/metric-thresholds';
import MetricTools from './metric-card/metric-tools';
import MetricBadges from './metric-card/metric-badges';
import TierBadge from './metric-card/tier-badge';

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
  const evalTier = evaluation?.tier || metric?.tier || null;
  const evalTierDisplay = evalTier ? getTierDisplayName(evalTier) : null;

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
              <TierBadge tier={evalTier} tierDisplay={evalTierDisplay} />
              
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
          <MetricBadges category={effectiveCategory} importance={metric.importance} />
          
          <Separator />
          
          <MetricThresholds thresholds={metric.thresholds} tierNames={tierNames} />
          
          <MetricTools tools={metric.tools} />
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
