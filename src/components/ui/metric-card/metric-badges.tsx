
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getCategoryColor, getCategoryIcon, getImportanceColor } from "./category-utils";

interface MetricBadgesProps {
  category: string;
  importance: string;
}

const MetricBadges: React.FC<MetricBadgesProps> = ({ category, importance }) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={cn("flex items-center gap-1", getCategoryColor(category))}>
        {getCategoryIcon(category)}
        <span className="capitalize">{category}</span>
      </div>
      
      <Separator orientation="vertical" className="h-4" />
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="secondary"
              className={getImportanceColor(importance)}
            >
              {importance.includes("Strong") ? "High" : 
               importance.includes("Moderate") ? "Medium" : "Standard"} Importance
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-sm">{importance}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default MetricBadges;
