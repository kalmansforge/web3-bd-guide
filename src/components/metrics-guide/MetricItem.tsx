import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface MetricItemProps {
  id: string;
  name: string;
  description: string;
  importance: string;
  tools?: string[];
  getTierValue: (metricId: string, tier: string) => string;
  tierNames: Array<{ internalName: string; displayName: string }>;
}

const MetricItem: React.FC<MetricItemProps> = ({
  id,
  name,
  description,
  importance,
  tools = [],
  getTierValue,
  tierNames
}) => {
  const isMobile = useIsMobile();
  
  // Ensure we have tier names or use defaults
  const safelyDisplayedTiers = tierNames && tierNames.length > 0 
    ? tierNames.slice(0, 2) 
    : [
        { internalName: 'T0', displayName: 'Tier 0' },
        { internalName: 'T1', displayName: 'Tier 1' }
      ];
  
  return (
    <Card key={id} className="overflow-hidden">
      <CardHeader className={`pb-4 ${isMobile ? 'px-3 py-3' : ''}`}>
        <CardTitle className="text-base sm:text-xl break-words">{name}</CardTitle>
        <CardDescription className="mt-1 text-xs sm:text-sm break-words">{description}</CardDescription>
      </CardHeader>
      <CardContent className={`space-y-4 sm:space-y-6 ${isMobile ? 'px-3 pb-3' : ''}`}>
        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-medium">Importance</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{importance}</p>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xs sm:text-sm font-medium">Threshold Classifications</h3>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            {safelyDisplayedTiers.map((tier, index) => (
              <div key={tier.internalName} className="space-y-2">
                <div className="flex items-center">
                  <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mr-2 ${
                    index === 0 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}>
                    {tier.internalName}
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{tier.displayName}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">
                  {getTierValue(id, tier.internalName)}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-medium">Recommended Tools</h3>
          {tools.length > 0 ? (
            <ul className="text-xs sm:text-sm text-muted-foreground">
              {tools.map((tool, index) => (
                <li key={index} className="mb-1">• {tool}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground">No tools specified</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricItem;
