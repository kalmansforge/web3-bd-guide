
import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { cn } from "@/lib/utils";
import { metricsData } from "@/data/metricsData";

const Projects = () => {
  const { projects, deleteProject } = useEvaluation();
  const navigate = useNavigate();
  
  const totalMetrics = metricsData.reduce((acc, category) => acc + category.metrics.length, 0);
  
  const handleNewEvaluation = () => {
    navigate('/new-evaluation');
  };

  return (
    <AppLayout>
      <PageHeader
        title="Project Evaluations"
        description="View and manage your blockchain project evaluations"
        actions={
          <Button onClick={handleNewEvaluation}>
            <Plus className="mr-2 h-4 w-4" />
            New Evaluation
          </Button>
        }
      />
      
      {projects.length > 0 ? (
        <div className="grid gap-4">
          {projects.map((project) => {
            const projectMetricsCount = Object.keys(project.metrics).length;
            const completionPercentage = Math.round((projectMetricsCount / totalMetrics) * 100);
            
            return (
              <Card key={project.id} className="overflow-hidden transition-all hover:border-primary/50 animate-fade-in">
                <CardHeader className="p-6">
                  <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6 lg:space-x-8">
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{project.name}</CardTitle>
                        {project.overallTier && (
                          <Badge className={cn(
                            project.overallTier === 'T0' 
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          )}>
                            {project.overallTier}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Evaluated on {new Date(project.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-between space-y-1 min-w-44">
                      <div className="text-sm text-muted-foreground">
                        Score
                      </div>
                      <div className="text-2xl font-bold">
                        {project.overallScore ? Math.round(project.overallScore) : 'N/A'}/100
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-between space-y-1 flex-1 min-w-44">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Completion</span>
                        <span className="text-sm font-medium">{completionPercentage}%</span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {projectMetricsCount} of {totalMetrics} metrics evaluated
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="rounded-full px-4"
                      >
                        Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="rounded-full">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete project evaluation?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the evaluation for {project.name}. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteProject(project.id)} className="bg-red-600">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No evaluations yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Start by creating your first project evaluation to see results here.
            </p>
            <Button onClick={handleNewEvaluation}>
              <Plus className="mr-2 h-4 w-4" />
              Create Evaluation
            </Button>
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
};

export default Projects;
