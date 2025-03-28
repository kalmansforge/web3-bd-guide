
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
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  // Use category or categoryId (for backward compatibility)
  const effectiveCategory = category || categoryId || "";
  
  // Get tier names from the evaluation if available
  const evalTier = evaluation?.tier || metric?.tier || null;
  const evalTierDisplay = evalTier ? getTierDisplayName(evalTier) : null;

  const handleViewDetail = () => {
    if (onViewDetail) {
      onViewDetail();
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200 overflow-hidden",
      expanded ? "shadow-md" : "shadow-sm",
      isPreview ? "opacity-80" : ""
    )}>
      <CardHeader className={cn("pb-2 sm:pb-4", isMobile ? "px-3 py-3" : "")}>
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className={cn(
              "font-semibold break-words", 
              isMobile ? "text-sm" : "text-base"
            )}>
              {metric.name}
            </CardTitle>
            <CardDescription className={cn(
              "line-clamp-2 break-words", 
              isMobile ? "text-xs" : ""
            )}>
              {metric.description}
            </CardDescription>
          </div>
          
          {!isPreview && !readOnly && (
            <div className="flex flex-col gap-2 flex-shrink-0">
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
          
          {readOnly && evalTier && (
            <div className="flex items-center flex-shrink-0">
              <TierBadge tier={evalTier} tierDisplay={evalTierDisplay} />
            </div>
          )}
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className={cn("pb-3 space-y-4", isMobile ? "px-3" : "")}>
          <MetricBadges category={effectiveCategory} importance={metric.importance} />
          
          <Separator />
          
          <MetricThresholds thresholds={metric.thresholds} tierNames={tierNames} />
          
          <MetricTools tools={metric.tools} />
        </CardContent>
      )}
      
      {(expanded || onViewDetail || onUpdate) && !readOnly && (
        <CardFooter className={cn(
          isMobile ? "px-3 pb-3 pt-0" : "px-6 pb-4 pt-0", 
          isPreview ? "hidden" : ""
        )}>
          {(onViewDetail || onUpdate) && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleViewDetail}
              size={isMobile ? "sm" : "default"}
            >
              {evalTier ? "Edit Evaluation" : "Evaluate Metric"}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default MetricCard;
