import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronRight, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { cn } from "@/lib/utils";
import { metricsData } from "@/data/metricsData";
import { getTierDisplayName } from "@/utils/storage";
import { ProjectEvaluation } from "@/types/metrics";

const Projects = () => {
  const { projects, deleteProject, setCurrentProject } = useEvaluation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState<string | null>(null);
  
  const totalMetrics = metricsData.reduce((acc, category) => acc + category.metrics.length, 0);
  
  const handleNewEvaluation = () => {
    setCurrentProject(null);
    navigate('/new-evaluation');
  };

  const handleEditProject = (project: ProjectEvaluation) => {
    navigate(`/new-evaluation`, { state: { project } });
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier ? project.overallTier === filterTier : true;
    return matchesSearch && matchesTier;
  });

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
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {filterTier ? `Tier: ${getTierDisplayName(filterTier as 'T0' | 'T1')}` : 'Filter by Tier'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by Tier</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setFilterTier(null)}>
                    All Projects
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterTier('T0')}>
                    {getTierDisplayName('T0')} Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterTier('T1')}>
                    {getTierDisplayName('T1')} Only
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="grid gap-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => {
                const projectMetricsCount = Object.keys(project.metrics).length;
                const completionPercentage = Math.round((projectMetricsCount / totalMetrics) * 100);
                const displayTierName = project.overallTier ? getTierDisplayName(project.overallTier) : null;
                
                return (
                  <Card key={project.id} className="overflow-hidden transition-all hover:border-primary/50 animate-fade-in">
                    <CardHeader className="p-6">
                      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6 lg:space-x-8">
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl">{project.name}</CardTitle>
                            {displayTierName && (
                              <Badge className={cn(
                                project.overallTier === 'T0' 
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              )}>
                                {displayTierName}
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
                          
                          <Button 
                            variant="outline" 
                            className="rounded-full px-4"
                            onClick={() => handleEditProject(project)}
                          >
                            Edit
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
              })
            ) : (
              <Card>
                <CardContent className="pt-6 pb-6">
                  <div className="text-center p-4">
                    <h3 className="text-lg font-medium mb-2">No matching projects found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
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
