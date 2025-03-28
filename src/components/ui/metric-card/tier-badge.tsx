
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TierType } from "@/types/metrics";
import { getAllTierNames } from "@/utils/storage";

interface TierBadgeProps {
  tier: TierType;
  tierDisplay: string | null;
}

const TierBadge: React.FC<TierBadgeProps> = ({ tier, tierDisplay }) => {
  if (!tier || !tierDisplay) return null;
  
  const tierNames = getAllTierNames();
  const tierIndex = tierNames.findIndex(t => t.internalName === tier);
  
  const getTierColor = () => {
    // If we have tier information, base the colors on the tier index
    if (tierIndex >= 0) {
      switch (tierIndex) {
        case 0: // First/best tier
          return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        case 1: // Second tier
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        default: // Other tiers
          return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      }
    }
    
    // Legacy fallback
    switch(tier) {
      case "T0": 
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "T1": 
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };
  
  return (
    <Badge className={cn(getTierColor())}>
      {tierDisplay}
    </Badge>
  );
};

export default TierBadge;
