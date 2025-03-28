import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Settings, Save, ArrowLeft, PlusCircle, Trash, MoveDiagonal, Copy } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTemplates } from "@/contexts/TemplateContext";
import { Badge } from "@/components/ui/badge";
import { EvaluationTemplate } from "@/types/templates";
import { Metric } from "@/types/metrics";
import { MetricCategory } from "@/types/templates";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TemplateEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { templates, updateTemplate, duplicateTemplateById } = useTemplates();
  const [template, setTemplate] = useState<EvaluationTemplate | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Load template data
  useEffect(() => {
    if (id) {
      const foundTemplate = templates.find((t) => t.id === id);
      if (foundTemplate) {
        setTemplate(JSON.parse(JSON.stringify(foundTemplate))); // Deep clone to avoid reference issues
        setIsLocked(foundTemplate.isLocked || false);
      } else {
        toast.error("Template not found");
        navigate("/settings?tab=templates");
      }
    }
  }, [id, templates, navigate]);

  // Handle duplicate and edit flow for locked templates
  const handleDuplicateAndEdit = () => {
    if (template && isLocked) {
      duplicateTemplateById(template.id);
      toast.success("Template duplicated", {
        description: "You can now edit your copy of this template"
      });
      navigate("/settings?tab=templates");
    }
  };

  // Handle back button with unsaved changes warning
  const handleBackClick = () => {
    if (hasUnsavedChanges && !isLocked) {
      // We'll handle this with an alert dialog below
    } else {
      navigate("/settings?tab=templates");
    }
  };

  // Save template changes
  const handleSaveTemplate = () => {
    if (template && !isLocked) {
      updateTemplate({
        ...template,
        updatedAt: new Date().toISOString(),
      });
      setHasUnsavedChanges(false);
      toast.success("Template saved successfully");
    }
  };

  // Handle template detail changes
  const handleTemplateChange = (field: keyof EvaluationTemplate, value: string) => {
    if (template && !isLocked) {
      setTemplate({
        ...template,
        [field]: value,
      });
      setHasUnsavedChanges(true);
    }
  };

  // Handle category changes
  const handleCategoryChange = (
    categoryIndex: number,
    field: keyof MetricCategory,
    value: string
  ) => {
    if (template) {
      const updatedCategories = [...template.categories];
      updatedCategories[categoryIndex] = {
        ...updatedCategories[categoryIndex],
        [field]: value,
      };

      setTemplate({
        ...template,
        categories: updatedCategories,
      });
      setHasUnsavedChanges(true);
    }
  };

  // Add a new category
  const handleAddCategory = () => {
    if (template) {
      const newCategory: MetricCategory = {
        id: `category-${Date.now()}`,
        name: "New Category",
        description: "Enter category description",
        metrics: [],
      };

      setTemplate({
        ...template,
        categories: [...template.categories, newCategory],
      });
      setHasUnsavedChanges(true);
    }
  };

  // Delete a category
  const handleDeleteCategory = (categoryIndex: number) => {
    if (template) {
      const updatedCategories = [...template.categories];
      updatedCategories.splice(categoryIndex, 1);

      setTemplate({
        ...template,
        categories: updatedCategories,
      });
      setHasUnsavedChanges(true);
    }
  };

  // Add a new metric to a category
  const handleAddMetric = (categoryIndex: number) => {
    if (template) {
      const newMetric: Metric = {
        id: `metric-${Date.now()}`,
        name: "New Metric",
        description: "Enter metric description",
        importance: "Medium",
        thresholds: {
          T0: "Enter T0 threshold criteria",
          T1: "Enter T1 threshold criteria",
        },
        tools: [],
      };

      const updatedCategories = [...template.categories];
      updatedCategories[categoryIndex].metrics.push(newMetric);

      setTemplate({
        ...template,
        categories: updatedCategories,
      });
      setHasUnsavedChanges(true);
    }
  };

  // Handle metric changes
  const handleMetricChange = (
    categoryIndex: number,
    metricIndex: number,
    field: keyof Metric,
    value: any
  ) => {
    if (template) {
      const updatedCategories = [...template.categories];
      const updatedMetric = {
        ...updatedCategories[categoryIndex].metrics[metricIndex],
        [field]: value,
      };
      
      updatedCategories[categoryIndex].metrics[metricIndex] = updatedMetric;

      setTemplate({
        ...template,
        categories: updatedCategories,
      });
      setHasUnsavedChanges(true);
    }
  };

  // Handle threshold changes
  const handleThresholdChange = (
    categoryIndex: number,
    metricIndex: number,
    tier: string,
    value: string
  ) => {
    if (template) {
      const updatedCategories = [...template.categories];
      const updatedMetric = {
        ...updatedCategories[categoryIndex].metrics[metricIndex],
        thresholds: {
          ...updatedCategories[categoryIndex].metrics[metricIndex].thresholds,
          [tier]: value,
        },
      };
      
      updatedCategories[categoryIndex].metrics[metricIndex] = updatedMetric;

      setTemplate({
        ...template,
        categories: updatedCategories,
      });
      setHasUnsavedChanges(true);
    }
  };

  // Delete a metric
  const handleDeleteMetric = (categoryIndex: number, metricIndex: number) => {
    if (template) {
      const updatedCategories = [...template.categories];
      updatedCategories[categoryIndex].metrics.splice(metricIndex, 1);

      setTemplate({
        ...template,
        categories: updatedCategories,
      });
      setHasUnsavedChanges(true);
    }
  };

  // Handle tool item changes
  const handleToolsChange = (
    categoryIndex: number,
    metricIndex: number,
    toolsText: string
  ) => {
    if (template) {
      const tools = toolsText
        .split('\n')
        .map(tool => tool.trim())
        .filter(tool => tool.length > 0);

      const updatedCategories = [...template.categories];
      updatedCategories[categoryIndex].metrics[metricIndex].tools = tools;

      setTemplate({
        ...template,
        categories: updatedCategories,
      });
      setHasUnsavedChanges(true);
    }
  };

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
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </AlertDialogTrigger>
              {hasUnsavedChanges && !isLocked && (
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have unsaved changes. Are you sure you want to leave without saving?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => navigate("/settings?tab=templates")}>
                      Leave without saving
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              )}
            </AlertDialog>
            
            {isLocked ? (
              <Button onClick={handleDuplicateAndEdit} className="flex items-center gap-1">
                <Copy className="h-4 w-4" />
                Duplicate to Edit
              </Button>
            ) : (
              <Button onClick={handleSaveTemplate} className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                Save Template
              </Button>
            )}
          </div>
        }
      />

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="details">Template Details</TabsTrigger>
          <TabsTrigger value="categories">Categories & Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLocked && (
                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-md mb-4 border border-yellow-200 dark:border-yellow-800">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                    This template is locked
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    This is a built-in template that cannot be edited. You can duplicate it to create your own editable version.
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Template Name</label>
                <Input
                  value={template.name}
                  onChange={(e) => handleTemplateChange("name", e.target.value)}
                  placeholder="Enter template name"
                  readOnly={isLocked}
                  className={isLocked ? "bg-muted cursor-not-allowed" : ""}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={template.description}
                  onChange={(e) => handleTemplateChange("description", e.target.value)}
                  placeholder="Enter template description"
                  rows={4}
                  readOnly={isLocked}
                  className={isLocked ? "bg-muted cursor-not-allowed" : ""}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Author</label>
                <Input
                  value={template.author}
                  onChange={(e) => handleTemplateChange("author", e.target.value)}
                  placeholder="Enter author name"
                  readOnly={isLocked}
                  className={isLocked ? "bg-muted cursor-not-allowed" : ""}
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Settings className="h-4 w-4" />
                <span>Template ID: {template.id}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Last updated: {new Date(template.updatedAt).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-6 space-y-6">
          {isLocked && (
            <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-md mb-4 border border-yellow-200 dark:border-yellow-800">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                This template is locked
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                This is a built-in template that cannot be edited. You can duplicate it to create your own editable version.
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Categories</h3>
            {!isLocked && (
              <Button onClick={handleAddCategory} size="sm" className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" />
                Add Category
              </Button>
            )}
          </div>

          {template.categories.map((category, categoryIndex) => (
            <Card key={category.id} className="overflow-hidden">
              <CardHeader className="bg-muted/40">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 w-full">
                    <Input
                      value={category.name}
                      onChange={(e) =>
                        handleCategoryChange(categoryIndex, "name", e.target.value)
                      }
                      className="font-medium text-lg bg-transparent border-transparent focus:bg-background"
                      placeholder="Category Name"
                      readOnly={isLocked}
                      className={isLocked ? "bg-muted cursor-not-allowed" : ""}
                    />
                    <Textarea
                      value={category.description}
                      onChange={(e) =>
                        handleCategoryChange(categoryIndex, "description", e.target.value)
                      }
                      className="bg-transparent border-transparent resize-none focus:bg-background text-muted-foreground"
                      placeholder="Category Description"
                      readOnly={isLocked}
                      className={isLocked ? "bg-muted cursor-not-allowed" : ""}
                    />
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteCategory(categoryIndex)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Metrics</h4>
                    <Badge variant="outline">{category.metrics.length}</Badge>
                  </div>
                  <Button
                    onClick={() => handleAddMetric(categoryIndex)}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <PlusCircle className="h-3 w-3" />
                    Add Metric
                  </Button>
                </div>

                <div className="space-y-6">
                  {category.metrics.map((metric, metricIndex) => (
                    <div key={metric.id} className="border rounded-md p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 w-full">
                          <Input
                            value={metric.name}
                            onChange={(e) =>
                              handleMetricChange(
                                categoryIndex,
                                metricIndex,
                                "name",
                                e.target.value
                              )
                            }
                            className="font-medium bg-transparent border-transparent focus:bg-background"
                            placeholder="Metric Name"
                            readOnly={isLocked}
                            className={isLocked ? "bg-muted cursor-not-allowed" : ""}
                          />
                          <Textarea
                            value={metric.description}
                            onChange={(e) =>
                              handleMetricChange(
                                categoryIndex,
                                metricIndex,
                                "description",
                                e.target.value
                              )
                            }
                            className="bg-transparent border-transparent resize-none focus:bg-background text-muted-foreground"
                            placeholder="Metric Description"
                            rows={2}
                            readOnly={isLocked}
                            className={isLocked ? "bg-muted cursor-not-allowed" : ""}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteMetric(categoryIndex, metricIndex)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Importance</label>
                          <Input
                            value={metric.importance}
                            onChange={(e) =>
                              handleMetricChange(
                                categoryIndex,
                                metricIndex,
                                "importance",
                                e.target.value
                              )
                            }
                            placeholder="e.g., High, Medium, Low"
                            className="text-sm"
                            readOnly={isLocked}
                            className={isLocked ? "bg-muted cursor-not-allowed" : ""}
                          />
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Thresholds</h5>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                T0
                              </Badge>
                              <span>Threshold</span>
                            </label>
                            <Textarea
                              value={metric.thresholds.T0 || ""}
                              onChange={(e) =>
                                handleThresholdChange(
                                  categoryIndex,
                                  metricIndex,
                                  "T0",
                                  e.target.value
                                )
                              }
                              placeholder="Enter T0 threshold criteria"
                              className="min-h-[80px] text-sm"
                              readOnly={isLocked}
                              className={isLocked ? "bg-muted cursor-not-allowed" : ""}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                T1
                              </Badge>
                              <span>Threshold</span>
                            </label>
                            <Textarea
                              value={metric.thresholds.T1 || ""}
                              onChange={(e) =>
                                handleThresholdChange(
                                  categoryIndex,
                                  metricIndex,
                                  "T1",
                                  e.target.value
                                )
                              }
                              placeholder="Enter T1 threshold criteria"
                              className="min-h-[80px] text-sm"
                              readOnly={isLocked}
                              className={isLocked ? "bg-muted cursor-not-allowed" : ""}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tools (one per line)</label>
                        <Textarea
                          value={metric.tools.join("\n")}
                          onChange={(e) =>
                            handleToolsChange(
                              categoryIndex,
                              metricIndex,
                              e.target.value
                            )
                          }
                          placeholder="Enter tools, one per line"
                          className="min-h-[80px] text-sm"
                          rows={4}
                          readOnly={isLocked}
                          className={isLocked ? "bg-muted cursor-not-allowed" : ""}
                        />
                      </div>
                    </div>
                  ))}

                  {category.metrics.length === 0 && (
                    <div className="text-center py-8 border border-dashed rounded-md">
                      <p className="text-muted-foreground mb-4">No metrics in this category</p>
                      <Button
                        onClick={() => handleAddMetric(categoryIndex)}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <PlusCircle className="h-3 w-3" />
                        Add First Metric
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {template.categories.length === 0 && (
            <div className="text-center py-12 border border-dashed rounded-md">
              <p className="text-muted-foreground mb-4">No categories defined yet</p>
              <Button
                onClick={handleAddCategory}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add First Category
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default TemplateEditor;
