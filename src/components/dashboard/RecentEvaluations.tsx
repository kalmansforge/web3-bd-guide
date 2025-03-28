
import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectEvaluation } from "@/types/metrics";

interface RecentEvaluationsProps {
  projects: ProjectEvaluation[];
  onNewEvaluation: () => void;
}

const RecentEvaluations = ({ projects, onNewEvaluation }: RecentEvaluationsProps) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight">Recent Evaluations</h2>
      </div>
      
      {projects.length > 0 ? (
        <div className="space-y-4 mb-6">
          {projects.slice(0, 5).map((project) => (
            <Card key={project.id} className="overflow-hidden animate-fade-in">
              <CardHeader className="py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>
                      Evaluated on {new Date(project.date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {project.overallTier && (
                    <Badge className={
                      project.overallTier === 'T0' 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    }>
                      {project.overallTier}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardFooter className="py-3 px-6 border-t flex justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Score:</span> {project.overallScore ? Math.round(project.overallScore) : 'N/A'}/100
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Metrics:</span> {Object.keys(project.metrics).length}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate(`/projects/${project.id}`)}>
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="animate-pulse-slow mb-6">
          <CardHeader>
            <CardTitle>No evaluations yet</CardTitle>
            <CardDescription>
              Start by creating your first project evaluation to see results here.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={onNewEvaluation}>
              <Plus className="mr-2 h-4 w-4" />
              Create Evaluation
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default RecentEvaluations;
