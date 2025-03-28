
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProjectEvaluation } from "@/types/metrics";
import { getTierDisplayName } from "@/utils/storage";
import DeleteProjectDialog from "@/components/ui/DeleteProjectDialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProjectCardProps {
  project: ProjectEvaluation;
  totalMetrics: number;
  onEdit: (project: ProjectEvaluation) => void;
}

const ProjectCard = ({ project, totalMetrics, onEdit }: ProjectCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const projectMetricsCount = Object.keys(project.metrics).length;
  const completionPercentage = Math.round((projectMetricsCount / totalMetrics) * 100);
  const displayTierName = project.overallTier ? getTierDisplayName(project.overallTier) : null;
  
  return (
    <Card key={project.id} className="overflow-hidden transition-all hover:border-primary/50 animate-fade-in">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col space-y-4">
          {/* Project name and tier */}
          <div className="flex flex-col space-y-1">
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
          
          {/* Middle section - responsive grid for score and completion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Score */}
            <div className="flex flex-col justify-between space-y-1">
              <div className="text-sm text-muted-foreground">
                Score
              </div>
              <div className="text-2xl font-bold">
                {project.overallScore ? Math.round(project.overallScore) : 'N/A'}/100
              </div>
            </div>
            
            {/* Completion */}
            <div className="flex flex-col justify-between space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Completion</span>
                <span className="text-sm font-medium">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {projectMetricsCount} of {totalMetrics} metrics evaluated
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/projects/${project.id}`)}
              className="flex-1 sm:flex-none rounded-full px-3 sm:px-4"
              size={isMobile ? "sm" : "default"}
            >
              Details
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none rounded-full px-3 sm:px-4"
              onClick={() => onEdit(project)}
              size={isMobile ? "sm" : "default"}
            >
              Edit
            </Button>
            
            <DeleteProjectDialog
              project={project}
              trigger={
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full ml-auto"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              }
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProjectCard;
