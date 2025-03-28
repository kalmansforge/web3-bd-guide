
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MetricCategory, MetricEvaluation, ProjectEvaluation } from "@/types/metrics";
import MetricCard from "@/components/ui/MetricCard";

interface MetricEvaluationPanelProps {
  activeCategory: string;
  setActiveCategory: (categoryId: string) => void;
  metricsData: MetricCategory[];
  currentProject: ProjectEvaluation;
  handleUpdateMetric: (categoryId: string, metricId: string, evaluation: MetricEvaluation) => void;
}

const MetricEvaluationPanel: React.FC<MetricEvaluationPanelProps> = ({
  activeCategory,
  setActiveCategory,
  metricsData,
  currentProject,
  handleUpdateMetric
}) => {
  const handlePrevCategory = () => {
    const currentIndex = metricsData.findIndex(c => c.id === activeCategory);
    if (currentIndex > 0) {
      setActiveCategory(metricsData[currentIndex - 1].id);
    }
  };
  
  const handleNextCategory = () => {
    const currentIndex = metricsData.findIndex(c => c.id === activeCategory);
    if (currentIndex < metricsData.length - 1) {
      setActiveCategory(metricsData[currentIndex + 1].id);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">{
            metricsData.find(c => c.id === activeCategory)?.name
          }</h2>
          <p className="text-sm text-muted-foreground">{
            metricsData.find(c => c.id === activeCategory)?.description
          }</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrevCategory}
            disabled={metricsData[0].id === activeCategory}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextCategory}
            disabled={metricsData[metricsData.length - 1].id === activeCategory}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-4 w-full flex overflow-x-auto no-scrollbar">
          {metricsData.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex-shrink-0">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {metricsData.map((category) => (
          <TabsContent key={category.id} value={category.id} className="animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2">
              {category.metrics.map((metric) => {
                const metricKey = `${category.id}_${metric.id}`;
                const evaluation = currentProject.metrics[metricKey];
                
                // Merge evaluation data with metric for display
                const metricWithEvaluation = {
                  ...metric,
                  tier: evaluation?.tier || null,
                  notes: evaluation?.notes || "",
                  value: evaluation?.value || "",
                };
                
                return (
                  <MetricCard
                    key={metric.id}
                    metric={metricWithEvaluation}
                    category={category.id}
                    onUpdate={handleUpdateMetric}
                  />
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default MetricEvaluationPanel;
