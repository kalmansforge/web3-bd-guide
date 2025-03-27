
import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronRight, BarChart2, HardDrive, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { Badge } from "@/components/ui/badge";

const DashboardCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  trend,
  onClick
}: { 
  title: string; 
  value: string | number; 
  description?: string;
  icon: React.ElementType;
  trend?: { value: number; positive: boolean };
  onClick?: () => void;
}) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md animate-scale-in" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
            {trend.positive ? '+' : ''}{trend.value}%
          </p>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
      {onClick && (
        <CardFooter className="p-2 border-t">
          <Button variant="ghost" size="sm" className="w-full justify-between" onClick={onClick}>
            <span>View details</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

const Dashboard = () => {
  const { projects } = useEvaluation();
  const navigate = useNavigate();
  
  const t0Projects = projects.filter(p => p.overallTier === 'T0').length;
  const t1Projects = projects.filter(p => p.overallTier === 'T1').length;
  
  const handleNewEvaluation = () => {
    navigate('/evaluation/new');
  };
  
  const handleViewProjects = () => {
    navigate('/projects');
  };
  
  const handleViewMetrics = () => {
    navigate('/metrics/foundational');
  };

  return (
    <AppLayout>
      <PageHeader
        title="Web3 BD Field Guide"
        description="Interactive evaluation framework for blockchain projects"
        actions={
          <Button onClick={handleNewEvaluation}>
            <Plus className="mr-2 h-4 w-4" />
            New Evaluation
          </Button>
        }
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Total Evaluations" 
          value={projects.length} 
          icon={HardDrive}
          description="Projects evaluated"
          onClick={handleViewProjects}
        />
        <DashboardCard 
          title="Strategic (T0) Projects" 
          value={t0Projects} 
          icon={BarChart2}
          trend={projects.length ? { value: Math.round((t0Projects / projects.length) * 100), positive: true } : undefined}
          onClick={handleViewProjects}
        />
        <DashboardCard 
          title="Secondary (T1) Projects" 
          value={t1Projects} 
          icon={Shield}
          trend={projects.length ? { value: Math.round((t1Projects / projects.length) * 100), positive: false } : undefined}
          onClick={handleViewProjects}
        />
        <DashboardCard 
          title="Evaluation Categories" 
          value="6" 
          icon={Users}
          description="Framework dimensions"
          onClick={handleViewMetrics}
        />
      </div>
      
      <h2 className="mt-8 mb-4 text-xl font-semibold tracking-tight">Recent Evaluations</h2>
      {projects.length > 0 ? (
        <div className="space-y-4">
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
              <CardFooter className="py-3 border-t flex justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-muted-foreground">
                    Score: <span className="font-medium">{project.overallScore ? Math.round(project.overallScore) : 'N/A'}/100</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Metrics: <span className="font-medium">{Object.keys(project.metrics).length}</span>
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
        <Card className="animate-pulse-slow">
          <CardHeader>
            <CardTitle>No evaluations yet</CardTitle>
            <CardDescription>
              Start by creating your first project evaluation to see results here.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleNewEvaluation}>
              <Plus className="mr-2 h-4 w-4" />
              Create Evaluation
            </Button>
          </CardFooter>
        </Card>
      )}
    </AppLayout>
  );
};

export default Dashboard;
