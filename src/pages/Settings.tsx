import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Save, Undo, Moon, Sun, Laptop, Database, HardDrive } from "lucide-react";
import { useThresholds } from "@/contexts/ThresholdContext";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { metricsData } from "@/data/metricsData";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";
import DataImportExport from "@/components/ui/DataImportExport";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  calculateStorageSize, 
  getAppearanceFromStorage, 
  saveAppearanceToStorage,
  AppearanceSettings,
  defaultAppearanceSettings 
} from "@/utils/localStorageUtils";

const Settings = () => {
  const { thresholds, loading, updateThreshold, saveChanges, resetChanges, unsavedChanges, refreshData: refreshThresholds } = useThresholds();
  const { projects, refreshData: refreshEvaluations } = useEvaluation();
  const [activeTab, setActiveTab] = useState("config");
  const [storageInfo, setStorageInfo] = useState(calculateStorageSize());
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>(defaultAppearanceSettings);
  const [unsavedAppearanceChanges, setUnsavedAppearanceChanges] = useState(false);
  
  useEffect(() => {
    // Load appearance settings
    const settings = getAppearanceFromStorage();
    setAppearanceSettings(settings);
    
    // Update storage information
    setStorageInfo(calculateStorageSize());
    
    // Apply appearance settings when loaded or changed
    applyAppearanceSettings(settings);
  }, []);
  
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
    setStorageInfo(calculateStorageSize());
    // Reload appearance settings
    const settings = getAppearanceFromStorage();
    setAppearanceSettings(settings);
    applyAppearanceSettings(settings);
  };
  
  const updateAppearanceSetting = <K extends keyof AppearanceSettings>(
    key: K, 
    value: AppearanceSettings[K]
  ) => {
    setAppearanceSettings(prev => ({
      ...prev,
      [key]: value,
      updatedAt: new Date().toISOString()
    }));
    setUnsavedAppearanceChanges(true);
  };
  
  const saveAppearanceChanges = () => {
    const success = saveAppearanceToStorage(appearanceSettings);
    if (success) {
      setUnsavedAppearanceChanges(false);
      // Apply the settings after saving
      applyAppearanceSettings(appearanceSettings);
      
      toast({
        title: "Appearance settings saved",
        description: "Your appearance preferences have been saved successfully"
      });
      // Update storage info
      setStorageInfo(calculateStorageSize());
    } else {
      toast({
        title: "Error saving appearance settings",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };
  
  const resetAppearanceChanges = () => {
    const settings = getAppearanceFromStorage();
    setAppearanceSettings(settings);
    setUnsavedAppearanceChanges(false);
    // Apply the original settings after reset
    applyAppearanceSettings(settings);
    
    toast({
      title: "Changes discarded",
      description: "Appearance settings have been reset to their previous state"
    });
  };
  
  // Function to apply appearance settings to the DOM
  const applyAppearanceSettings = (settings: AppearanceSettings) => {
    const htmlElement = document.documentElement;
    
    // Apply theme
    if (settings.theme === 'dark') {
      htmlElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      htmlElement.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }
    }
    
    // Apply color scheme
    htmlElement.setAttribute('data-color-scheme', settings.colorScheme);
    
    // Apply font size
    htmlElement.setAttribute('data-font-size', settings.fontSize);
    
    // Apply border radius
    htmlElement.setAttribute('data-border-radius', settings.borderRadius);
    
    // Apply animation setting
    if (settings.animation) {
      htmlElement.classList.remove('reduce-motion');
    } else {
      htmlElement.classList.add('reduce-motion');
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Settings"
        description="Configure application settings and thresholds"
      />
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-4">
          <TabsTrigger value="config">Threshold Configuration</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
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
          
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Data Summary
              </CardTitle>
              <CardDescription>
                Overview of your locally stored data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Project Evaluations</div>
                  <div className="text-2xl font-bold">{projects.length}</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Threshold Configurations</div>
                  <div className="text-2xl font-bold">{thresholds.length}</div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <h3 className="text-sm font-medium">Total Storage Used</h3>
                  <span className="text-sm font-medium text-primary">
                    {storageInfo.totalSizeFormatted} ({storageInfo.percentUsed.toFixed(1)}% of 5MB)
                  </span>
                </div>
                <Progress 
                  value={storageInfo.percentUsed} 
                  className={`h-2 ${storageInfo.percentUsed > 80 ? 'bg-destructive/20' : 'bg-muted'}`}
                />
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div className="text-sm text-muted-foreground">
                  <DataImportExport onDataImported={handleDataImported} />
                </div>
              </div>
            </CardContent>
          </Card>
          
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
        
        <TabsContent value="appearance">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-semibold">Appearance Settings</h2>
              <p className="text-muted-foreground">Customize the appearance and theme of your application</p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={resetAppearanceChanges}
                disabled={!unsavedAppearanceChanges}
                className="flex items-center gap-2"
              >
                <Undo className="h-4 w-4" />
                Reset
              </Button>
              
              <Button
                onClick={saveAppearanceChanges}
                disabled={!unsavedAppearanceChanges}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
          
          {unsavedAppearanceChanges && (
            <Alert className="mb-6 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Unsaved Changes</AlertTitle>
              <AlertDescription>
                You have unsaved changes to your appearance settings. Be sure to save them before leaving this page.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>
                  Select your preferred color theme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme Mode</Label>
                  <RadioGroup 
                    value={appearanceSettings.theme} 
                    onValueChange={(value) => updateAppearanceSetting('theme', value as 'light' | 'dark' | 'system')}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem value="light" id="theme-light" className="peer sr-only" />
                      <Label
                        htmlFor="theme-light"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Sun className="h-6 w-6 mb-2" />
                        <span>Light</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" />
                      <Label
                        htmlFor="theme-dark"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Moon className="h-6 w-6 mb-2" />
                        <span>Dark</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="system" id="theme-system" className="peer sr-only" />
                      <Label
                        htmlFor="theme-system"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Laptop className="h-6 w-6 mb-2" />
                        <span>System</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Color Scheme</Label>
                  <RadioGroup 
                    value={appearanceSettings.colorScheme} 
                    onValueChange={(value) => updateAppearanceSetting('colorScheme', value as 'default' | 'purple' | 'blue' | 'green')}
                    className="grid grid-cols-4 gap-2"
                  >
                    <div>
                      <RadioGroupItem value="default" id="color-default" className="peer sr-only" />
                      <Label
                        htmlFor="color-default"
                        className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="h-10 w-10 rounded-full bg-primary" />
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="purple" id="color-purple" className="peer sr-only" />
                      <Label
                        htmlFor="color-purple"
                        className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="h-10 w-10 rounded-full bg-purple-500" />
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="blue" id="color-blue" className="peer sr-only" />
                      <Label
                        htmlFor="color-blue"
                        className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="h-10 w-10 rounded-full bg-blue-500" />
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="green" id="color-green" className="peer sr-only" />
                      <Label
                        htmlFor="color-green"
                        className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="h-10 w-10 rounded-full bg-green-500" />
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>UI Preferences</CardTitle>
                <CardDescription>
                  Adjust the user interface to your preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Font Size</Label>
                    <RadioGroup 
                      value={appearanceSettings.fontSize} 
                      onValueChange={(value) => updateAppearanceSetting('fontSize', value as 'small' | 'medium' | 'large')}
                      className="grid grid-cols-3 gap-2 mt-2"
                    >
                      <div>
                        <RadioGroupItem value="small" id="font-small" className="peer sr-only" />
                        <Label
                          htmlFor="font-small"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary text-sm"
                        >
                          Small
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="medium" id="font-medium" className="peer sr-only" />
                        <Label
                          htmlFor="font-medium"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          Medium
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="large" id="font-large" className="peer sr-only" />
                        <Label
                          htmlFor="font-large"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary text-lg"
                        >
                          Large
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-base">Border Radius</Label>
                    <RadioGroup 
                      value={appearanceSettings.borderRadius} 
                      onValueChange={(value) => updateAppearanceSetting('borderRadius', value as 'none' | 'small' | 'medium' | 'large')}
                      className="grid grid-cols-4 gap-2 mt-2"
                    >
                      <div>
                        <RadioGroupItem value="none" id="radius-none" className="peer sr-only" />
                        <Label
                          htmlFor="radius-none"
                          className="flex aspect-square flex-col items-center justify-center rounded-none border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="h-10 w-10 bg-primary/20" />
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="small" id="radius-small" className="peer sr-only" />
                        <Label
                          htmlFor="radius-small"
                          className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="h-10 w-10 rounded-sm bg-primary/20" />
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="medium" id="radius-medium" className="peer sr-only" />
                        <Label
                          htmlFor="radius-medium"
                          className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="h-10 w-10 rounded-md bg-primary/20" />
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem value="large" id="radius-large" className="peer sr-only" />
                        <Label
                          htmlFor="radius-large"
                          className="flex aspect-square flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="h-10 w-10 rounded-full bg-primary/20" />
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="animation">Animation Effects</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable UI animation effects
                      </p>
                    </div>
                    <Switch
                      id="animation"
                      checked={appearanceSettings.animation}
                      onCheckedChange={(checked) => updateAppearanceSetting('animation', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Settings;
