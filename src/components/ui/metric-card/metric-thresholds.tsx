
import React from "react";
import { Badge } from "@/components/ui/badge";
import { getTierDisplayName } from "@/utils/storage";

interface MetricThresholdsProps {
  thresholds: Record<string, string>;
  tierNames: Array<{ internalName: string; displayName: string; }>;
}

const MetricThresholds: React.FC<MetricThresholdsProps> = ({ thresholds, tierNames }) => {
  if (!thresholds) return null;
  
  const firstTierName = tierNames && tierNames.length > 0 ? tierNames[0].internalName : 'T0';
  const secondTierName = tierNames && tierNames.length > 1 ? tierNames[1].internalName : 'T1';
  
  const firstTierDisplay = tierNames && tierNames.length > 0 ? tierNames[0].displayName : 'T0';
  const secondTierDisplay = tierNames && tierNames.length > 1 ? tierNames[1].displayName : 'T1';
  
  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium">Classification Thresholds:</p>
      <div className="grid grid-cols-1 gap-2">
        {firstTierName && thresholds[firstTierName] && (
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
              {firstTierDisplay}
            </Badge>
            <span className="text-muted-foreground">{thresholds[firstTierName]}</span>
          </div>
        )}
        
        {secondTierName && thresholds[secondTierName] && (
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
              {secondTierDisplay}
            </Badge>
            <span className="text-muted-foreground">{thresholds[secondTierName]}</span>
          </div>
        )}
        
        {Object.keys(thresholds).filter(key => key !== firstTierName && key !== secondTierName).map(tierKey => (
          <div key={tierKey} className="flex items-start gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {getTierDisplayName(tierKey)}
            </Badge>
            <span className="text-muted-foreground">{thresholds[tierKey]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricThresholds;
