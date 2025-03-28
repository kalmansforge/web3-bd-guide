
import React from "react";
import { Badge } from "@/components/ui/badge";
import { getTierDisplayName } from "@/utils/storage";
import { cn } from "@/lib/utils";

interface MetricThresholdsProps {
  thresholds: Record<string, string>;
  tierNames: Array<{ internalName: string; displayName: string; }>;
}

const MetricThresholds: React.FC<MetricThresholdsProps> = ({ thresholds, tierNames }) => {
  if (!thresholds) return null;
  
  // Helper function to determine badge color based on tier index
  const getTierBadgeColor = (tierKey: string) => {
    const tierIndex = tierNames.findIndex(t => t.internalName === tierKey);
    
    switch (tierIndex) {
      case 0:
        return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case 1:
        return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };
  
  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium">Classification Thresholds:</p>
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(thresholds).map(([tierKey, description]) => (
          <div key={tierKey} className="flex items-start gap-2">
            <Badge 
              variant="outline" 
              className={cn(getTierBadgeColor(tierKey))}
            >
              {getTierDisplayName(tierKey)}
            </Badge>
            <span className="text-muted-foreground">{description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricThresholds;
