
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Filter, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { useThresholds } from "@/contexts/thresholds";
import { useTemplates } from "@/contexts/templates";
import { getAllTierNames } from "@/utils/storage";
import MetricsSearch from "@/components/metrics-guide/MetricsSearch";
import MetricsCategoryTabs from "@/components/metrics-guide/MetricsCategoryTabs";
import CategoryDescription from "@/components/metrics-guide/CategoryDescription";
import MetricsList from "@/components/metrics-guide/MetricsList";
import CategoryNotFound from "@/components/metrics-guide/CategoryNotFound";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

const MetricsGuide = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [notesFilter, setNotesFilter] = useState<string>("all");
  const { thresholds, loading: thresholdsLoading } = useThresholds();
  const { activeTemplate, loading: templateLoading } = useTemplates();
  const tierNames = getAllTierNames();
  
  const [activeTab, setActiveTab] = useState<string>(
    activeTemplate?.categories[0]?.id || ""
  );
  
  useEffect(() => {
    if (activeTemplate && activeTemplate.categories.length > 0) {
      setActiveTab(activeTemplate.categories[0].id);
    }
  }, [activeTemplate]);
  
  useEffect(() => {
    console.log("Current Tier Names:", tierNames);
    console.log("Current Thresholds:", thresholds);
    console.log("Current Template:", activeTemplate);
  }, [tierNames, thresholds, activeTemplate]);
  
  if (templateLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading metrics template...</p>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  if (!activeTemplate?.categories || activeTemplate.categories.length === 0) {
    return <CategoryNotFound />;
  }
  
  const category = activeTemplate.categories.find(c => c.id === activeTab) || activeTemplate.categories[0];
  
  if (!category) {
    return <CategoryNotFound />;
  }
  
  const filteredMetrics = category?.metrics.filter(metric => {
    const matchesSearch = !searchQuery || 
      metric.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      metric.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesNotes = notesFilter === "all" || false;
    
    return matchesSearch && (notesFilter === "all" || matchesNotes);
  }) || [];

  const getThresholdValue = (metricId: string, tier: string) => {
    if (!category || !tier) return "No threshold defined";
    
    if (thresholdsLoading || !thresholds.length) {
      const metric = category.metrics.find(m => m.id === metricId);
      return metric?.thresholds[tier] || "No threshold defined";
    }
    
    const threshold = thresholds.find(
      t => t.metricId === metricId && t.categoryId === category.id
    );
    
    if (threshold && threshold.thresholds && threshold.thresholds[tier] !== undefined) {
      return threshold.thresholds[tier];
    }
    
    const metric = category.metrics.find(m => m.id === metricId);
    return metric?.thresholds[tier] || "No threshold defined";
  };

  return (
    <AppLayout>
      <PageHeader
        title={`Metrics Guide: ${activeTemplate.name}`}
        description={activeTemplate.description}
        actions={
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button onClick={() => navigate("/templates")} variant="outline" size={isMobile ? "sm" : "default"} className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="truncate">Manage Templates</span>
            </Button>
            <Button onClick={() => navigate("/settings")} variant="outline" size={isMobile ? "sm" : "default"} className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="truncate">Configure Thresholds</span>
            </Button>
          </div>
        }
      />
      
      <div className="space-y-4 mb-4 sm:mb-6">
        <MetricsSearch 
          value={searchQuery} 
          onChange={setSearchQuery}
          placeholder="Search metrics..." 
        />
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <Label htmlFor="category-select" className="mb-2 block text-sm font-medium">
              Jump to Category
            </Label>
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger id="category-select" className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {activeTemplate.categories.map((category, index) => (
                  <SelectItem key={category.id} value={category.id}>
                    {index + 1}. {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-2/3">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className="mb-2 block text-sm font-medium">
                  <MessageSquare className="inline mr-2 h-4 w-4" />
                  Filter by Notes
                </Label>
                <ToggleGroup 
                  type="single" 
                  value={notesFilter} 
                  onValueChange={(value) => value && setNotesFilter(value)}
                  className="justify-start flex-wrap"
                >
                  <ToggleGroupItem value="all" aria-label="Show all metrics">All</ToggleGroupItem>
                  <ToggleGroupItem value="with-notes" aria-label="Show metrics with notes">With Notes</ToggleGroupItem>
                  <ToggleGroupItem value="without-notes" aria-label="Show metrics without notes">Without Notes</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto -mx-2 px-2">
        <MetricsCategoryTabs 
          categories={activeTemplate.categories} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>
      
      <CategoryDescription name={category.name} description={category.description} />
      
      <MetricsList 
        metrics={filteredMetrics} 
        searchQuery={searchQuery} 
        getTierValue={getThresholdValue}
        tierNames={tierNames}
      />
    </AppLayout>
  );
};

export default MetricsGuide;
