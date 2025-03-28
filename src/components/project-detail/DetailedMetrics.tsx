
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import MetricCard from "@/components/ui/MetricCard";
import { Metric } from "@/types/metrics";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { getTierDisplayName } from "@/utils/storage";

interface DetailedMetricsProps {
  activeCategory: string;
  onCategoryChange: (value: string) => void;
  metricsData: any[];
  generateMetricsWithEvaluation: (categoryId: string) => Metric[];
}

const DetailedMetrics = ({ 
  activeCategory, 
  onCategoryChange, 
  metricsData,
  generateMetricsWithEvaluation
}: DetailedMetricsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight mb-4">Detailed Metric Evaluation</h2>
      
      <Tabs value={activeCategory} onValueChange={onCategoryChange}>
        {metricsData.map(category => (
          <TabsContent key={category.id} value={category.id} className="animate-fade-in">
            <div className="space-y-2 mb-4">
              <h3 className="text-lg font-medium">{category.name}</h3>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
            
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              {generateMetricsWithEvaluation(category.id).map(metric => (
                <div key={metric.id} className="flex flex-col">
                  <MetricCard
                    metric={metric}
                    category={category.id}
                    readOnly={true}
                  />
                  {metric.tier && (
                    <div className="mt-2 px-3 py-2 bg-muted/50 rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Evaluation:</span>
                        <Badge variant="outline" className="font-medium">
                          {getTierDisplayName(metric.tier)}
                        </Badge>
                      </div>
                      {metric.value && (
                        <p className="text-sm text-muted-foreground mb-1">
                          <span className="font-medium">Value:</span> {metric.value}
                        </p>
                      )}
                      {metric.notes && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Notes:</span> {metric.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default DetailedMetrics;
