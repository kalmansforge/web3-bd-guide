import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { useTemplates } from "@/contexts/templates";
import { 
  getAppearanceFromStorage, 
  saveAppearanceToStorage,
  AppearanceSettings,
  defaultAppearanceSettings 
} from "@/utils/storage";
import { calculateStorageSize } from "@/utils/storage/core";
import { toast } from "@/hooks/use-toast";
import AppearanceTab from "@/components/settings/AppearanceTab";
import TierNamesTab from "@/components/settings/TierNamesTab";
import DataManagementTab from "@/components/settings/DataManagementTab";
import TemplatesTab from "@/components/settings/TemplatesTab";

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, refreshData: refreshEvaluations } = useEvaluation();
  const { templates, refreshData: refreshTemplates } = useTemplates();
  
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || "appearance");
  
  const [storageInfo, setStorageInfo] = useState(calculateStorageSize());
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>(defaultAppearanceSettings);
  const [unsavedAppearanceChanges, setUnsavedAppearanceChanges] = useState(false);
  
  useEffect(() => {
    const settings = getAppearanceFromStorage();
    setAppearanceSettings(settings);
    setStorageInfo(calculateStorageSize());
    applyAppearanceSettings(settings);
  }, []);

  useEffect(() => {
    if (activeTab !== tabParam) {
      navigate(`/settings?tab=${activeTab}`, { replace: true });
    }
  }, [activeTab, navigate, tabParam]);

  useEffect(() => {
    if (tabParam && ['appearance', 'tier-names', 'data-management', 'templates'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleDataImported = () => {
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
        description="Configure application appearance and data management"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="mb-6 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="tier-names">Tier Names</TabsTrigger>
          <TabsTrigger value="data-management">Data Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="mt-0">
          <AppearanceTab 
            appearanceSettings={appearanceSettings}
            unsavedChanges={unsavedAppearanceChanges}
            updateAppearanceSetting={updateAppearanceSetting}
            saveChanges={saveAppearanceChanges}
            resetChanges={resetAppearanceChanges}
          />
        </TabsContent>
        
        <TabsContent value="tier-names" className="mt-0">
          <TierNamesTab 
            appearanceSettings={appearanceSettings}
            unsavedChanges={unsavedAppearanceChanges}
            updateAppearanceSetting={updateAppearanceSetting}
            saveChanges={saveAppearanceChanges}
            resetChanges={resetAppearanceChanges}
          />
        </TabsContent>
        
        <TabsContent value="data-management" className="mt-0">
          <DataManagementTab 
            projects={projects}
            storageInfo={{
              totalSize: storageInfo.totalSize,
              breakdown: storageInfo.breakdown
            }}
            onDataImported={handleDataImported}
          />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Settings;
