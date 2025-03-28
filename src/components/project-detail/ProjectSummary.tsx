
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TierType } from "@/types/metrics";
import { getTierDisplayName, getAllTierNames } from "@/utils/localStorageUtils";

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
              {overallTier === 'T0' 
                ? `${tierNames.t0} tier project with high potential` 
                : overallTier === 'T1'
                ? `${tierNames.t1} tier project with moderate potential`
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
                .filter(key => metrics[key].tier === 'T0')
                .length;
              
              const t1Count = categoryEvaluations
                .filter(key => metrics[key].tier === 'T1')
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
                        <span className="text-muted-foreground">{tierNames.t0} Metrics</span>
                        <span>{t0Count} of {completedCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{tierNames.t1} Metrics</span>
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
