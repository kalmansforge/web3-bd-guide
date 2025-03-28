
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ExternalLink, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { metricsData } from "@/data/metricsData";
import { useThresholds } from "@/contexts/ThresholdContext";
import { cn } from "@/lib/utils";

const MetricsGuide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<string>("foundational");
  const { thresholds, loading } = useThresholds();
  
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);
  
  // Find the active category or default to the first one
  const category = metricsData.find(c => c.id === activeTab) || metricsData[0];
  
  // Filter metrics based on search query
  const filteredMetrics = searchQuery && category
    ? category.metrics.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : category?.metrics || [];

  const getThresholdValue = (metricId: string, tier: string) => {
    if (loading || !thresholds.length) {
      // Use default threshold from metricsData when thresholds are loading or empty
      const metric = category?.metrics.find(m => m.id === metricId);
      return metric?.thresholds[tier] || "No threshold defined";
    }
    
    // Find custom threshold from user settings
    const threshold = thresholds.find(
      t => t.metricId === metricId && t.categoryId === category?.id
    );
    
    if (threshold && threshold.thresholds && threshold.thresholds[tier] !== undefined) {
      return threshold.thresholds[tier];
    }
    
    // Fall back to default threshold
    const metric = category?.metrics.find(m => m.id === metricId);
    return metric?.thresholds[tier] || "No threshold defined";
  };

  if (!category) {
    return (
      <AppLayout>
        <div className="py-10 text-center">
          <h2 className="text-2xl font-bold">Category not found</h2>
          <p className="mt-2 text-muted-foreground">The requested category does not exist.</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
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
      
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search metrics..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="w-full flex overflow-x-auto no-scrollbar mb-6">
          {metricsData.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex-shrink-0">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="space-y-3 mb-6 animate-slide-in">
          <h2 className="text-2xl font-semibold tracking-tight">{category.name}</h2>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
        
        <div className="space-y-6 animate-fade-in">
          {filteredMetrics.length > 0 ? (
            filteredMetrics.map(metric => (
              <Card key={metric.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{metric.name}</CardTitle>
                  <CardDescription>{metric.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Importance</h3>
                    <p className="text-sm text-muted-foreground">{metric.importance}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Threshold Classifications</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 mr-2">
                            T0
                          </Badge>
                          <span className="text-sm font-medium">Strategic Tier</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{getThresholdValue(metric.id, "T0")}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 mr-2">
                            T1
                          </Badge>
                          <span className="text-sm font-medium">Secondary Tier</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{getThresholdValue(metric.id, "T1")}</p>
                      </div>
                    </div>
                  </div>
                  
                  {metric.tools && metric.tools.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Recommended Tools & Resources</h3>
                      <div className="space-y-1">
                        {metric.tools.map(tool => (
                          <div key={tool} className="flex items-center">
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                            <span className="text-sm">{tool}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No metrics found</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No metrics match your search query: "{searchQuery}"
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </Tabs>
    </AppLayout>
  );
};

export default MetricsGuide;
