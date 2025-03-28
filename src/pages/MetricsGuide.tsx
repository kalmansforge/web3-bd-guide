
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
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

const MetricsGuide = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("foundational");
  const { thresholds, loading } = useThresholds();
  const tierNames = getAllTierNames();
  
  useEffect(() => {
    console.log("Current Tier Names:", tierNames);
    console.log("Current Thresholds:", thresholds);
  }, [tierNames, thresholds]);
  
  // Find the active category or default to the first one
  const category = metricsData.find(c => c.id === activeTab) || metricsData[0];
  
  // Filter metrics based on search query
  const filteredMetrics = searchQuery && category
    ? category.metrics.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : category?.metrics || [];

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
      <MetricsSearch value={searchQuery} onChange={setSearchQuery} />
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
