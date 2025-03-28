
import React from "react";
import { ArrowLeft, Copy, Lock, Save } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useTemplateEditor } from "@/hooks/template-editor";
import TemplateDetailsPanel from "@/components/templates/editor/TemplateDetailsPanel";
import CategoriesPanel from "@/components/templates/editor/CategoriesPanel";

const TemplateEditor = () => {
  const {
    template,
    activeTab,
    setActiveTab,
    hasUnsavedChanges,
    isLocked,
    handleDuplicateAndEdit,
    handleBackClick,
    handleSaveTemplate,
    handleTemplateChange,
    handleCategoryChange,
    handleAddCategory,
    handleDeleteCategory,
    handleAddMetric,
    handleDeleteMetric,
    handleMetricChange,
    handleThresholdChange,
    handleToolsChange,
  } = useTemplateEditor();

  if (!template) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <p>Loading template...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={`${isLocked ? 'Viewing' : 'Editing'}: ${template.name}`}
        description={
          template.isBuiltIn && isLocked 
            ? "Built-in template (locked for editing)" 
            : template.isBuiltIn 
              ? "Built-in template (customized copy)" 
              : "Custom template"
        }
        actions={
          <div className="flex gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </AlertDialogTrigger>
              {hasUnsavedChanges && !isLocked ? (
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have unsaved changes. Are you sure you want to leave without saving?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2 mt-4">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBackClick}>
                      Leave without saving
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              ) : (
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Return to templates</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to go back to the templates list?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2 mt-4">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBackClick}>
                      Go back
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              )}
            </AlertDialog>
            
            {isLocked ? (
              <Button onClick={handleDuplicateAndEdit} className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Duplicate to Edit
              </Button>
            ) : (
              <Button onClick={handleSaveTemplate} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Template
              </Button>
            )}
          </div>
        }
      />

      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab} 
        className="mt-8"
      >
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="details">Template Details</TabsTrigger>
          <TabsTrigger value="categories">Categories & Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6 space-y-6">
          <TemplateDetailsPanel
            template={template}
            isLocked={isLocked}
            handleTemplateChange={handleTemplateChange}
          />
        </TabsContent>

        <TabsContent value="categories" className="mt-6 space-y-8">
          <CategoriesPanel
            template={template}
            isLocked={isLocked}
            handleCategoryChange={handleCategoryChange}
            handleAddCategory={handleAddCategory}
            handleDeleteCategory={handleDeleteCategory}
            handleAddMetric={handleAddMetric}
            handleDeleteMetric={handleDeleteMetric}
            handleMetricChange={handleMetricChange}
            handleThresholdChange={handleThresholdChange}
            handleToolsChange={handleToolsChange}
          />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default TemplateEditor;
