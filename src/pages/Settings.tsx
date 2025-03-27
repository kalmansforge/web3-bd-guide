
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Save, Undo } from "lucide-react";
import { useThresholds } from "@/contexts/ThresholdContext";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { metricsData } from "@/data/metricsData";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";
import DataImportExport from "@/components/ui/DataImportExport";

const Settings = () => {
  const { thresholds, loading, updateThreshold, saveChanges, resetChanges, unsavedChanges, refreshData: refreshThresholds } = useThresholds();
  const { refreshData: refreshEvaluations } = useEvaluation();
  const [activeTab, setActiveTab] = useState("config");
  
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
    
    // Fallback to default values from metricsData
    const category = metricsData.find(c => c.id === categoryId);
    const metric = category?.metrics.find(m => m.id === metricId);
    
    if (metric) {
      return tier === "t0" ? metric.thresholds.T0 : metric.thresholds.T1;
    }
    
    return "";
  };

  const handleDataImported = () => {
    refreshThresholds();
    refreshEvaluations();
  };

  return (
    <AppLayout>
      <PageHeader
        title="Settings"
        description="Configure application settings and thresholds"
      />
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-4">
          <TabsTrigger value="config">Threshold Configuration</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="config" className="space-y-4">
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
          
          <Separator className="my-6" />
          
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
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Data Management</h2>
            <p className="text-muted-foreground">Export and import your evaluation data and configurations</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <DataImportExport onDataImported={handleDataImported} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Local Storage</CardTitle>
                  <CardDescription>
                    Information about your locally stored data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Data Privacy</h3>
                      <p className="text-sm text-muted-foreground">
                        All your evaluation data and threshold configurations are stored locally in your browser.
                        No sensitive data is sent to our servers.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Data Security</h3>
                      <p className="text-sm text-muted-foreground">
                        To ensure your data is not lost, regularly export it and keep a backup.
                        Clearing your browser cache or history will remove locally stored data.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Storage Usage</CardTitle>
                <CardDescription>
                  Overview of your local storage usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <h3 className="text-sm font-medium">Project Evaluations</h3>
                    <span className="text-sm text-muted-foreground">{thresholds.length} items</span>
                  </div>
                  <div className="h-2 bg-muted rounded overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.min(100, (thresholds.length / 100) * 100)}%` }} 
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <h3 className="text-sm font-medium">Threshold Configurations</h3>
                    <span className="text-sm text-muted-foreground">{thresholds.length} items</span>
                  </div>
                  <div className="h-2 bg-muted rounded overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.min(100, (thresholds.length / 100) * 100)}%` }} 
                    />
                  </div>
                </div>
                
                <div className="pt-2 mt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-2">Browser Storage Information</h3>
                  <p className="text-xs text-muted-foreground">
                    Modern browsers typically allocate 5-10MB of local storage per domain.
                    Your evaluation data is designed to be efficient and should not exceed this limit 
                    for typical usage.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Account settings will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the appearance and theme of your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Appearance settings will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Advanced settings will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Settings;
