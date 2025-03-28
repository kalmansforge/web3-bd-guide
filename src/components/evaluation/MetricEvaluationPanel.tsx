
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MetricCategory, MetricEvaluation, ProjectEvaluation } from "@/types/metrics";
import MetricCard from "@/components/ui/MetricCard";
import MetricEvaluationForm from "./MetricEvaluationForm";

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
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  
  // Guard clause to ensure we have valid metricsData
  if (!metricsData || metricsData.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>No metrics data available. Please select a valid template.</p>
      </div>
    );
  }

  // Ensure activeCategory is valid
  const effectiveActiveCategory = activeCategory && metricsData.some(c => c.id === activeCategory) 
    ? activeCategory 
    : metricsData[0]?.id || "";
  
  const handlePrevCategory = () => {
    const currentIndex = metricsData.findIndex(c => c.id === effectiveActiveCategory);
    if (currentIndex > 0) {
      setActiveCategory(metricsData[currentIndex - 1].id);
    }
  };
  
  const handleNextCategory = () => {
    const currentIndex = metricsData.findIndex(c => c.id === effectiveActiveCategory);
    if (currentIndex < metricsData.length - 1) {
      setActiveCategory(metricsData[currentIndex + 1].id);
    }
  };
  
  const handleOpenMetricForm = (metricId: string) => {
    setSelectedMetric(metricId);
  };
  
  const handleCloseMetricForm = () => {
    setSelectedMetric(null);
  };

  // Find the current category safely
  const currentCategory = metricsData.find(c => c.id === effectiveActiveCategory);
  const selectedMetricData = currentCategory?.metrics.find(m => m.id === selectedMetric);

  // If we don't have a valid category, display a message
  if (!currentCategory) {
    return (
      <div className="p-6 text-center">
        <p>Invalid category selected. Please select a valid category.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">{currentCategory.name}</h2>
          <p className="text-sm text-muted-foreground">{currentCategory.description}</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrevCategory}
            disabled={metricsData[0]?.id === effectiveActiveCategory}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextCategory}
            disabled={metricsData[metricsData.length - 1]?.id === effectiveActiveCategory}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      
      <Tabs value={effectiveActiveCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-4 w-full flex overflow-x-auto no-scrollbar">
          {metricsData.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex-shrink-0">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {metricsData.map((category) => (
          <TabsContent key={category.id} value={category.id} className="animate-fade-in">
            {selectedMetric && selectedMetricData && category.id === effectiveActiveCategory ? (
              <MetricEvaluationForm
                metric={selectedMetricData}
                categoryId={category.id}
                evaluation={currentProject.metrics[`${category.id}_${selectedMetric}`]}
                onSave={(categoryId, metricId, evaluation) => {
                  handleUpdateMetric(categoryId, metricId, evaluation);
                  handleCloseMetricForm();
                }}
                onCancel={handleCloseMetricForm}
              />
            ) : (
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
                      evaluation={evaluation}
                      onUpdate={handleUpdateMetric}
                      onViewDetail={() => handleOpenMetricForm(metric.id)}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default MetricEvaluationPanel;
