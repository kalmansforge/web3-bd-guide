
import React, { useState, useMemo } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import MetricCard from "@/components/ui/MetricCard";
import { Metric } from "@/types/metrics";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { getTierDisplayName } from "@/utils/storage";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MetricsSearch from "@/components/metrics-guide/MetricsSearch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Filter } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [evaluationFilter, setEvaluationFilter] = useState<string>("all");
  
  // Generate metrics for the active category
  const currentMetrics = useMemo(() => 
    generateMetricsWithEvaluation(activeCategory), 
    [activeCategory, generateMetricsWithEvaluation]
  );
  
  // Apply filters to metrics
  const filteredMetrics = useMemo(() => {
    return currentMetrics.filter(metric => {
      // Text search filter
      const matchesSearch = 
        searchTerm === "" || 
        metric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        metric.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (metric.notes && metric.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Evaluation state filter
      let matchesEvaluation = true;
      if (evaluationFilter === "evaluated") {
        matchesEvaluation = !!metric.tier;
      } else if (evaluationFilter === "not-evaluated") {
        matchesEvaluation = !metric.tier;
      }
      
      return matchesSearch && matchesEvaluation;
    });
  }, [currentMetrics, searchTerm, evaluationFilter]);
  
  const currentCategory = metricsData.find(c => c.id === activeCategory);
  
  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight mb-4">Detailed Metric Evaluation</h2>
      
      <div className="space-y-4 mb-6">
        {/* Search and filters */}
        <MetricsSearch 
          value={searchTerm} 
          onChange={setSearchTerm} 
          placeholder="Search metrics by name, description or notes..." 
        />
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <Label htmlFor="category-select" className="mb-2 block text-sm font-medium">
              Jump to Category
            </Label>
            <Select value={activeCategory} onValueChange={onCategoryChange}>
              <SelectTrigger id="category-select">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {metricsData.map((category, index) => (
                  <SelectItem key={category.id} value={category.id}>
                    {index + 1}. {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-2/3">
            <Label className="mb-2 block text-sm font-medium">
              <Filter className="inline mr-2 h-4 w-4" />
              Filter by Evaluation Status
            </Label>
            <ToggleGroup 
              type="single" 
              value={evaluationFilter} 
              onValueChange={(value) => value && setEvaluationFilter(value)}
              className="justify-start"
            >
              <ToggleGroupItem value="all" aria-label="Show all metrics">All</ToggleGroupItem>
              <ToggleGroupItem value="evaluated" aria-label="Show evaluated metrics">Evaluated</ToggleGroupItem>
              <ToggleGroupItem value="not-evaluated" aria-label="Show not evaluated metrics">Not Evaluated</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>
      
      <Tabs value={activeCategory} onValueChange={onCategoryChange}>
        {metricsData.map(category => (
          <TabsContent key={category.id} value={category.id} className="animate-fade-in">
            <div className="space-y-2 mb-6">
              <h3 className="text-lg font-medium">{category.name}</h3>
              <p className="text-muted-foreground text-sm">{category.description}</p>
            </div>
            
            {filteredMetrics.length === 0 ? (
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-lg text-center">No metrics match your filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    Try adjusting your search term or filters to see more results.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className={cn(
                "grid gap-5", 
                isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
              )}>
                {filteredMetrics.map(metric => (
                  <div key={metric.id} className="flex flex-col">
                    <MetricCard
                      metric={metric}
                      category={category.id}
                      readOnly={true}
                    />
                    {metric.tier ? (
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
                    ) : (
                      <div className="mt-2 px-3 py-2 bg-muted/50 rounded-md text-sm text-muted-foreground">
                        Not yet evaluated
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default DetailedMetrics;
