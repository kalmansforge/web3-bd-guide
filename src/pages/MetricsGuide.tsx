import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Filter, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { metricsData } from "@/data/metricsData";
import { useThresholds } from "@/contexts/ThresholdContext";
import { getAllTierNames } from "@/utils/storage";
import MetricsSearch from "@/components/metrics-guide/MetricsSearch";
import MetricsCategoryTabs from "@/components/metrics-guide/MetricsCategoryTabs";
import CategoryDescription from "@/components/metrics-guide/CategoryDescription";
import MetricsList from "@/components/metrics-guide/MetricsList";
import CategoryNotFound from "@/components/metrics-guide/CategoryNotFound";
import BackButton from "@/components/metrics-guide/BackButton";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const MetricsGuide = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("foundational");
  const [notesFilter, setNotesFilter] = useState<string>("all");
  const { thresholds, loading } = useThresholds();
  const tierNames = getAllTierNames();
  
  useEffect(() => {
    console.log("Current Tier Names:", tierNames);
    console.log("Current Thresholds:", thresholds);
  }, [tierNames, thresholds]);
  
  // Find the active category or default to the first one
  const category = metricsData.find(c => c.id === activeTab) || metricsData[0];
  
  // Filter metrics based on all criteria (search, notes filter)
  const filteredMetrics = category?.metrics.filter(metric => {
    // Text search filter
    const matchesSearch = !searchQuery || 
      metric.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      metric.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Notes filter
    const matchesNotesFilter = 
      notesFilter === "all" || 
      (notesFilter === "with-notes" && metric.notes) || 
      (notesFilter === "without-notes" && !metric.notes);
    
    return matchesSearch && matchesNotesFilter;
  }) || [];

  const getThresholdValue = (metricId: string, tier: string) => {
    if (!category || !tier) return "No threshold defined";
    
    if (loading || !thresholds.length) {
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

  if (!category) {
    return <CategoryNotFound onNavigateHome={() => navigate("/")} />;
  }

  return (
    <AppLayout>
      <PageHeader
        title="Metrics Guide"
        description="Comprehensive reference for BD evaluation metrics and frameworks"
        actions={
          <Button onClick={() => navigate("/settings")} variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure Thresholds
          </Button>
        }
      />
      
      <BackButton onClick={() => navigate("/")} />
      
      <div className="space-y-4 mb-6">
        <MetricsSearch 
          value={searchQuery} 
          onChange={setSearchQuery}
          placeholder="Search metrics by name, description or notes..." 
        />
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-full">
            <Label className="mb-2 block text-sm font-medium">
              <MessageSquare className="inline mr-2 h-4 w-4" />
              Filter by Notes
            </Label>
            <ToggleGroup 
              type="single" 
              value={notesFilter} 
              onValueChange={(value) => value && setNotesFilter(value)}
              className="justify-start"
            >
              <ToggleGroupItem value="all" aria-label="Show all metrics">All</ToggleGroupItem>
              <ToggleGroupItem value="with-notes" aria-label="Show metrics with notes">With Notes</ToggleGroupItem>
              <ToggleGroupItem value="without-notes" aria-label="Show metrics without notes">Without Notes</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>
      
      <MetricsCategoryTabs 
        categories={metricsData} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
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
