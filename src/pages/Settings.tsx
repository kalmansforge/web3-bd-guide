
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";
import { useThresholds } from "@/contexts/ThresholdContext";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { useTemplates } from "@/contexts/TemplateContext";
import { 
  calculateStorageSize, 
  getAppearanceFromStorage, 
  saveAppearanceToStorage,
  AppearanceSettings,
  defaultAppearanceSettings 
} from "@/utils/storage";
import { toast } from "@/hooks/use-toast";
import ThresholdConfigTab from "@/components/settings/ThresholdConfigTab";
import AppearanceTab from "@/components/settings/AppearanceTab";
import TierNamesTab from "@/components/settings/TierNamesTab";
import DataManagementTab from "@/components/settings/DataManagementTab";
import TemplatesTab from "@/components/settings/TemplatesTab";

const Settings = () => {
  const navigate = useNavigate();
  const { thresholds, refreshData: refreshThresholds } = useThresholds();
  const { projects, refreshData: refreshEvaluations } = useEvaluation();
  const { templates, refreshData: refreshTemplates } = useTemplates();
  const [activeTab, setActiveTab] = useState("config");
  const [storageInfo, setStorageInfo] = useState(calculateStorageSize());
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>(defaultAppearanceSettings);
  const [unsavedAppearanceChanges, setUnsavedAppearanceChanges] = useState(false);
  
  useEffect(() => {
    const settings = getAppearanceFromStorage();
    setAppearanceSettings(settings);
    setStorageInfo(calculateStorageSize());
    applyAppearanceSettings(settings);
  }, []);

  const handleDataImported = () => {
    refreshThresholds();
    refreshEvaluations();
    refreshTemplates();
    setStorageInfo(calculateStorageSize());
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
      applyAppearanceSettings(appearanceSettings);
      
      toast({
        title: "Appearance settings saved",
        description: "Your appearance preferences have been saved successfully"
      });
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
    applyAppearanceSettings(settings);
    
    toast({
      title: "Changes discarded",
      description: "Appearance settings have been reset to their previous state"
    });
  };
  
  const applyAppearanceSettings = (settings: AppearanceSettings) => {
    const htmlElement = document.documentElement;
    
    if (settings.theme === 'dark') {
      htmlElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      htmlElement.classList.remove('dark');
    } else {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }
    }
    
    htmlElement.setAttribute('data-color-scheme', settings.colorScheme);
    htmlElement.setAttribute('data-font-size', settings.fontSize);
    htmlElement.setAttribute('data-border-radius', settings.borderRadius);
    
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
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-5 mb-4">
          <TabsTrigger value="config">Threshold Configuration</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="tier-names">Tier Names</TabsTrigger>
          <TabsTrigger value="data-management">Data Management</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="config">
          <ThresholdConfigTab />
        </TabsContent>
        
        <TabsContent value="appearance">
          <AppearanceTab 
            appearanceSettings={appearanceSettings}
            unsavedChanges={unsavedAppearanceChanges}
            updateAppearanceSetting={updateAppearanceSetting}
            saveChanges={saveAppearanceChanges}
            resetChanges={resetAppearanceChanges}
          />
        </TabsContent>
        
        <TabsContent value="tier-names">
          <TierNamesTab 
            appearanceSettings={appearanceSettings}
            unsavedChanges={unsavedAppearanceChanges}
            updateAppearanceSetting={updateAppearanceSetting}
            saveChanges={saveAppearanceChanges}
            resetChanges={resetAppearanceChanges}
          />
        </TabsContent>
        
        <TabsContent value="data-management">
          <DataManagementTab 
            projects={projects}
            thresholds={thresholds}
            storageInfo={storageInfo}
            onDataImported={handleDataImported}
          />
        </TabsContent>
        
        <TabsContent value="templates">
          <TemplatesTab />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Settings;
