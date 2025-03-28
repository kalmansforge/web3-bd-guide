
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Save, Undo } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useThresholds } from "@/contexts/ThresholdContext";
import { metricsData } from "@/data/metricsData";

const ThresholdConfigTab = () => {
  const { thresholds, loading, updateThreshold, saveChanges, resetChanges, unsavedChanges } = useThresholds();

  const handleThresholdChange = (
    metricId: string,
    categoryId: string,
    tier: "t0" | "t1",
    value: string
  ) => {
    const threshold = thresholds.find(
      t => t.metricId === metricId && t.categoryId === categoryId
    );
    
    if (threshold) {
      updateThreshold(
        metricId,
        categoryId,
        tier === "t0" ? value : threshold.t0Threshold,
        tier === "t1" ? value : threshold.t1Threshold
      );
    }
  };
  
  const getThresholdValue = (metricId: string, categoryId: string, tier: "t0" | "t1") => {
    const threshold = thresholds.find(
      t => t.metricId === metricId && t.categoryId === categoryId
    );
    
    if (threshold) {
      return tier === "t0" ? threshold.t0Threshold : threshold.t1Threshold;
    }
    
    const category = metricsData.find(c => c.id === categoryId);
    const metric = category?.metrics.find(m => m.id === metricId);
    
    if (metric) {
      return tier === "t0" ? metric.thresholds.T0 : metric.thresholds.T1;
    }
    
    return "";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Threshold Configurations</h2>
          <p className="text-muted-foreground">Customize metric thresholds for evaluation criteria</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={resetChanges}
            disabled={!unsavedChanges || loading}
            className="flex items-center gap-2"
          >
            <Undo className="h-4 w-4" />
            Reset
          </Button>
          
          <Button
            onClick={saveChanges}
            disabled={!unsavedChanges || loading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
      
      {unsavedChanges && (
        <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unsaved Changes</AlertTitle>
          <AlertDescription>
            You have unsaved changes to your threshold configurations. Be sure to save them before leaving this page.
          </AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <div className="py-8 text-center text-muted-foreground">
          <p>Loading threshold configurations...</p>
        </div>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={metricsData.map(category => category.id)}
          className="space-y-4"
        >
          {metricsData.map(category => (
            <AccordionItem
              key={category.id}
              value={category.id}
              className="border rounded-lg px-2"
            >
              <AccordionTrigger className="hover:no-underline py-4 px-2">
                <div className="flex items-center text-left">
                  <h3 className="text-lg font-medium">{category.name}</h3>
                  <Badge variant="outline" className="ml-2 bg-primary/10">
                    {category.metrics.length} metrics
                  </Badge>
                </div>
              </AccordionTrigger>
              
              <AccordionContent>
                <div className="space-y-6 py-2">
                  {category.metrics.map(metric => (
                    <Card key={metric.id} className="overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-base">{metric.name}</CardTitle>
                        <CardDescription>{metric.description}</CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`${metric.id}-t0`} className="flex items-center">
                                <Badge variant="outline" className="mr-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                  T0
                                </Badge>
                                <span>Strategic Tier Threshold</span>
                              </Label>
                            </div>
                            
                            <Textarea
                              id={`${metric.id}-t0`}
                              value={getThresholdValue(metric.id, category.id, "t0")}
                              onChange={(e) => handleThresholdChange(metric.id, category.id, "t0", e.target.value)}
                              className="min-h-[80px]"
                              placeholder="Enter threshold criteria for T0 (Strategic) classification"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`${metric.id}-t1`} className="flex items-center">
                                <Badge variant="outline" className="mr-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                  T1
                                </Badge>
                                <span>Secondary Tier Threshold</span>
                              </Label>
                            </div>
                            
                            <Textarea
                              id={`${metric.id}-t1`}
                              value={getThresholdValue(metric.id, category.id, "t1")}
                              onChange={(e) => handleThresholdChange(metric.id, category.id, "t1", e.target.value)}
                              className="min-h-[80px]"
                              placeholder="Enter threshold criteria for T1 (Secondary) classification"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default ThresholdConfigTab;
