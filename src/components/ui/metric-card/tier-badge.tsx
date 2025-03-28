
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TierType } from "@/types/metrics";

interface TierBadgeProps {
  tier: TierType;
  tierDisplay: string | null;
}

const TierBadge: React.FC<TierBadgeProps> = ({ tier, tierDisplay }) => {
  if (!tier || !tierDisplay) return null;
  
  return (
    <Badge className={cn(
      tier === "T0" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
      tier === "T1" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" :
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    )}>
      {tierDisplay}
    </Badge>
  );
};

export default TierBadge;
