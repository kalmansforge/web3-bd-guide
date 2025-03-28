
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TierType } from "@/types/metrics";
import { getTierDisplayName, getAllTierNames } from "@/utils/storage";

interface ProjectSummaryProps {
  name: string;
  overallTier: TierType;
  completedMetrics: number;
  totalMetrics: number;
  metricsData: any[];
  metrics: Record<string, any>;
}

const ProjectSummary = ({ 
  name, 
  overallTier, 
  completedMetrics, 
  totalMetrics, 
  metricsData,
  metrics 
}: ProjectSummaryProps) => {
  const tierNames = getAllTierNames();
  
  // Find tier display names by their internal names
  const findTierDisplayName = (internalName: string): string => {
    const tier = tierNames.find(t => t.internalName === internalName);
    return tier ? tier.displayName : internalName;
  };
  
  // Get the first tier (formerly T0)
  const firstTierName = tierNames.length > 0 ? tierNames[0].internalName : 'T0';
  const firstTierDisplay = tierNames.length > 0 ? tierNames[0].displayName : 'T0';
  
  // Get the second tier (formerly T1)
  const secondTierName = tierNames.length > 1 ? tierNames[1].internalName : 'T1';
  const secondTierDisplay = tierNames.length > 1 ? tierNames[1].displayName : 'T1';
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">Evaluation Summary</CardTitle>
        <CardDescription>
          Overall assessment of {name} based on the Web3 BD metrics framework
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium mb-2">Classification</h3>
            <p className="text-3xl font-bold">
              {overallTier ? getTierDisplayName(overallTier) : 'Unclassified'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {overallTier === firstTierName
                ? `${firstTierDisplay} tier project with high potential` 
                : overallTier === secondTierName
                ? `${secondTierDisplay} tier project with moderate potential`
                : 'Not enough data to classify'
              }
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Evaluation Coverage</h3>
            <p className="text-3xl font-bold">{Math.round((completedMetrics / totalMetrics) * 100)}%</p>
            <p className="text-sm text-muted-foreground mt-1">
              {completedMetrics} of {totalMetrics} metrics evaluated
            </p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div>
          <h3 className="text-lg font-medium mb-3">Category Breakdown</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metricsData.map(category => {
              const categoryMetrics = category.metrics.length;
              const categoryEvaluations = Object.keys(metrics)
                .filter(key => key.startsWith(`${category.id}_`));
              const completedCount = categoryEvaluations.length;
              
              const t0Count = categoryEvaluations
                .filter(key => metrics[key].tier === firstTierName)
                .length;
              
              const t1Count = categoryEvaluations
                .filter(key => metrics[key].tier === secondTierName)
                .length;
              
              const percentComplete = (completedCount / categoryMetrics) * 100;
              
              return (
                <Card key={category.id} className="overflow-hidden">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Completion</span>
                        <span>{Math.round(percentComplete)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{firstTierDisplay} Metrics</span>
                        <span>{t0Count} of {completedCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{secondTierDisplay} Metrics</span>
                        <span>{t1Count} of {completedCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectSummary;
