
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, FileText, DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { metricsData } from "@/data/metricsData";
import MetricCard from "@/components/ui/MetricCard";
import ProjectScoreCard from "@/components/ui/ProjectScoreCard";
import { Metric, TierType } from "@/types/metrics";
import { toast } from "sonner";
import { exportSingleEvaluation, getTierDisplayName } from "@/utils/localStorageUtils";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, setCurrentProject } = useEvaluation();
  const [activeCategory, setActiveCategory] = useState(metricsData[0].id);
  
  const project = projects.find(p => p.id === id);
  
  useEffect(() => {
    if (!project) {
      toast.error("Project not found", {
        description: "The requested project evaluation does not exist."
      });
      navigate("/projects");
    }
  }, [project, navigate]);
  
  if (!project) return null;
  
  const totalMetrics = metricsData.reduce((acc, category) => acc + category.metrics.length, 0);
  const completedMetrics = Object.keys(project.metrics).length;
  
  const handleEditProject = () => {
    setCurrentProject(project);
    navigate("/new-evaluation");
  };
  
  const handleExportPDF = () => {
    if (exportSingleEvaluation(project.id)) {
      toast.success("Export successful", {
        description: "Your evaluation has been exported to a JSON file"
      });
    } else {
      toast.error("Export failed", {
        description: "There was a problem exporting your evaluation"
      });
    }
  };
  
  const generateMetricsWithEvaluation = (categoryId: string): Metric[] => {
    const category = metricsData.find(c => c.id === categoryId);
    if (!category) return [];
    
    return category.metrics.map(metric => {
      const metricKey = `${categoryId}_${metric.id}`;
      const evaluation = project.metrics[metricKey];
      
      return {
        ...metric,
        tier: evaluation?.tier || null,
        notes: evaluation?.notes || "",
        value: evaluation?.value || "",
      };
    });
  };

  return (
    <AppLayout>
      <PageHeader
        title={project.name}
        description={`Evaluation created on ${new Date(project.date).toLocaleDateString()}`}
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportPDF}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={handleEditProject}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Evaluation
            </Button>
          </div>
        }
      />
      
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => navigate("/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
      
      <div className="mb-6">
        <ProjectScoreCard 
          score={project.overallScore || 0} 
          tier={project.overallTier as TierType} 
          completedMetrics={completedMetrics} 
          totalMetrics={totalMetrics}
        />
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Jump to Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="w-full flex overflow-x-auto no-scrollbar">
              {metricsData.map((category, index) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className={activeCategory === category.id ? "text-primary font-medium" : ""}
                >
                  {index + 1}. {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Evaluation Summary</CardTitle>
            <CardDescription>
              Overall assessment of {project.name} based on the Web3 BD metrics framework
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium mb-2">Classification</h3>
                <p className="text-3xl font-bold">
                  {project.overallTier ? getTierDisplayName(project.overallTier) : 'Unclassified'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {project.overallTier === 'T0' 
                    ? 'Strategic tier project with high potential' 
                    : project.overallTier === 'T1'
                    ? 'Secondary tier project with moderate potential'
                    : 'Not enough data to classify'
                  }
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Evaluation Coverage</h3>
                <p className="text-3xl font-bold">{Math.round((completedMetrics / totalMetrics) * 100)}%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {completedMetrics} of {totalMetrics} metrics evaluated
                </p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="text-lg font-medium mb-3">Category Breakdown</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {metricsData.map(category => {
                  const categoryMetrics = category.metrics.length;
                  const categoryEvaluations = Object.keys(project.metrics)
                    .filter(key => key.startsWith(`${category.id}_`));
                  const completedCount = categoryEvaluations.length;
                  
                  const t0Count = categoryEvaluations
                    .filter(key => project.metrics[key].tier === 'T0')
                    .length;
                  
                  const t1Count = categoryEvaluations
                    .filter(key => project.metrics[key].tier === 'T1')
                    .length;
                  
                  const percentComplete = (completedCount / categoryMetrics) * 100;
                  const tierNames = { t0: getTierDisplayName('T0'), t1: getTierDisplayName('T1') };
                  
                  return (
                    <Card key={category.id} className="overflow-hidden">
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">{category.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="py-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Completion</span>
                            <span>{Math.round(percentComplete)}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{tierNames.t0} Metrics</span>
                            <span>{t0Count} of {completedCount}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{tierNames.t1} Metrics</span>
                            <span>{t1Count} of {completedCount}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Detailed Metric Evaluation</h2>
        
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          {metricsData.map(category => (
            <TabsContent key={category.id} value={category.id} className="animate-fade-in">
              <div className="space-y-2 mb-4">
                <h3 className="text-lg font-medium">{category.name}</h3>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {generateMetricsWithEvaluation(category.id).map(metric => (
                  <MetricCard
                    key={metric.id}
                    metric={metric}
                    categoryId={category.id}
                    readOnly={true}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ProjectDetail;
