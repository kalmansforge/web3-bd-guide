
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { metricsData } from "@/data/metricsData";
import MetricCard from "@/components/ui/MetricCard";
import ProjectScoreCard from "@/components/ui/ProjectScoreCard";
import { MetricEvaluation, TierType } from "@/types/metrics";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

const NewEvaluation = () => {
  const [projectName, setProjectName] = useState("");
  const [currentStep, setCurrentStep] = useState("project");
  const [activeCategory, setActiveCategory] = useState(metricsData[0].id);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const navigate = useNavigate();
  const { createProject, currentProject, updateMetric, saveProject, calculateProjectScore } = useEvaluation();
  
  // Check if we're in edit mode
  useEffect(() => {
    if (currentProject) {
      setProjectName(currentProject.name);
      setCurrentStep("evaluation");
      setIsEditMode(true);
    }
  }, [currentProject]);
  
  const handleCreateProject = () => {
    if (!projectName.trim()) return;
    createProject(projectName);
    setCurrentStep("evaluation");
  };
  
  const handleUpdateMetric = (categoryId: string, metricId: string, evaluation: MetricEvaluation) => {
    updateMetric(categoryId, metricId, evaluation);
  };
  
  const handleSaveProject = () => {
    saveProject();
    navigate("/projects");
  };
  
  const handleNextCategory = () => {
    const currentIndex = metricsData.findIndex(c => c.id === activeCategory);
    if (currentIndex < metricsData.length - 1) {
      setActiveCategory(metricsData[currentIndex + 1].id);
    }
  };
  
  const handlePrevCategory = () => {
    const currentIndex = metricsData.findIndex(c => c.id === activeCategory);
    if (currentIndex > 0) {
      setActiveCategory(metricsData[currentIndex - 1].id);
    }
  };
  
  // Calculate stats for the evaluation progress
  const totalMetrics = metricsData.reduce((acc, category) => acc + category.metrics.length, 0);
  const completedMetrics = currentProject 
    ? Object.keys(currentProject.metrics).length 
    : 0;
  
  const { score, tier } = currentProject 
    ? calculateProjectScore() 
    : { score: 0, tier: null as TierType };

  return (
    <AppLayout>
      <PageHeader
        title={isEditMode ? `Editing: ${currentProject?.name}` : (currentProject ? `Evaluating: ${currentProject.name}` : "New Project Evaluation")}
        description={currentProject 
          ? "Complete the evaluation by reviewing each metric category" 
          : "Start by entering the project name"
        }
        actions={
          currentProject && (
            <Button onClick={handleSaveProject}>
              <Save className="mr-2 h-4 w-4" />
              Save Evaluation
            </Button>
          )
        }
      />
      
      <Tabs value={currentStep} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="project" disabled={!!currentProject}>Project Details</TabsTrigger>
          <TabsTrigger value="evaluation" disabled={!currentProject}>Metrics Evaluation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="project" className="space-y-4 animate-slide-in">
          <Card>
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>
                Enter the details of the blockchain project you're evaluating
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="Enter project name..."
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/")}>Cancel</Button>
              <Button onClick={handleCreateProject} disabled={!projectName.trim()}>
                Continue to Evaluation
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="evaluation" className="space-y-4 animate-slide-in">
          {currentProject && (
            <div className="grid gap-6 md:grid-cols-4">
              <div className="md:col-span-3">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">{
                      metricsData.find(c => c.id === activeCategory)?.name
                    }</h2>
                    <p className="text-sm text-muted-foreground">{
                      metricsData.find(c => c.id === activeCategory)?.description
                    }</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handlePrevCategory}
                      disabled={metricsData[0].id === activeCategory}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleNextCategory}
                      disabled={metricsData[metricsData.length - 1].id === activeCategory}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
                
                <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                  <TabsList className="mb-4 w-full flex overflow-x-auto no-scrollbar">
                    {metricsData.map((category) => (
                      <TabsTrigger key={category.id} value={category.id} className="flex-shrink-0">
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {metricsData.map((category) => (
                    <TabsContent key={category.id} value={category.id} className="animate-fade-in">
                      <div className="grid gap-4 md:grid-cols-2">
                        {category.metrics.map((metric) => {
                          const metricKey = `${category.id}_${metric.id}`;
                          const evaluation = currentProject.metrics[metricKey];
                          
                          // Merge evaluation data with metric for display
                          const metricWithEvaluation = {
                            ...metric,
                            tier: evaluation?.tier || null,
                            notes: evaluation?.notes || "",
                            value: evaluation?.value || "",
                          };
                          
                          return (
                            <MetricCard
                              key={metric.id}
                              metric={metricWithEvaluation}
                              category={category.id}
                              onUpdate={handleUpdateMetric}
                            />
                          );
                        })}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
              
              <div className="space-y-4">
                <ProjectScoreCard 
                  score={score} 
                  tier={tier} 
                  completedMetrics={completedMetrics} 
                  totalMetrics={totalMetrics}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Navigation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {metricsData.map((category, index) => {
                      const categoryMetrics = category.metrics.length;
                      const completedCategoryMetrics = Object.keys(currentProject.metrics)
                        .filter(key => key.startsWith(`${category.id}_`))
                        .length;
                      
                      const percentComplete = Math.round((completedCategoryMetrics / categoryMetrics) * 100);
                      
                      return (
                        <div key={category.id} className="flex items-center justify-between py-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setActiveCategory(category.id)}
                            className={activeCategory === category.id ? "text-primary font-medium" : ""}
                          >
                            {index + 1}. {category.name}
                          </Button>
                          <span className="text-xs text-muted-foreground">
                            {percentComplete}%
                          </span>
                        </div>
                      );
                    })}
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveProject} className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Save Evaluation
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default NewEvaluation;
