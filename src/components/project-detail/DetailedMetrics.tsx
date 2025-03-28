
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import MetricCard from "@/components/ui/MetricCard";
import { Metric } from "@/types/metrics";
import { useIsMobile } from "@/hooks/use-mobile";

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
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {generateMetricsWithEvaluation(category.id).map(metric => (
                <MetricCard
                  key={metric.id}
                  metric={metric}
                  category={category.id}
                  readOnly={true}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default DetailedMetrics;
