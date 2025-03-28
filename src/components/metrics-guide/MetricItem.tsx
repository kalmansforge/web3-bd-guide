
import React from "react";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <Card key={id} className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="mt-1">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Importance</h3>
          <p className="text-sm text-muted-foreground">{importance}</p>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Threshold Classifications</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {tierNames.slice(0, 2).map((tier, index) => (
              <div key={tier.internalName} className="space-y-2">
                <div className="flex items-center">
                  <Badge 
                    variant="outline" 
                    className={index === 0 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 mr-2"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 mr-2"
                    }
                  >
                    {tier.internalName}
                  </Badge>
                  <span className="text-sm font-medium">{tier.displayName}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getTierValue(id, tier.internalName)}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {tools && tools.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Recommended Tools & Resources</h3>
            <div className="space-y-2">
              {tools.map(tool => (
                <div key={tool} className="flex items-center">
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground mr-2 flex-shrink-0" />
                  <span className="text-sm">{tool}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricItem;
