
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { useTemplates } from "@/contexts/TemplateContext";
import ProjectScoreCard from "@/components/ui/ProjectScoreCard";
import { Metric, TierType } from "@/types/metrics";
import { exportSingleEvaluation } from "@/utils/storage";
import AppLayout from "@/components/layout/AppLayout";
import { getProjectCompletionData } from "@/utils/scoring";
import { useIsMobile } from "@/hooks/use-mobile";

// Import our components
import ProjectActions from "@/components/project-detail/ProjectActions";
import ProjectSummary from "@/components/project-detail/ProjectSummary";
import DetailedMetrics from "@/components/project-detail/DetailedMetrics";
import BackButton from "@/components/metrics-guide/BackButton";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, setCurrentProject } = useEvaluation();
  const { templates, activeTemplate } = useTemplates();
  const [activeCategory, setActiveCategory] = useState("");
  const isMobile = useIsMobile();
  
  const project = projects.find(p => p.id === id);
  
  // Get the template used for this project
  const projectTemplateId = project?.templateId || activeTemplate.id;
  const projectTemplate = templates.find(t => t.id === projectTemplateId) || activeTemplate;
  
  // Set initial active category from the project's template
  useEffect(() => {
    if (projectTemplate.categories.length > 0 && !activeCategory) {
      setActiveCategory(projectTemplate.categories[0].id);
    }
  }, [projectTemplate, activeCategory]);
  
  useEffect(() => {
    if (!project) {
      toast.error("Project not found", {
        description: "The requested project evaluation does not exist."
      });
      navigate("/projects");
    }
  }, [project, navigate]);
  
  if (!project) return null;
  
  // Get evaluation progress stats using our utility function with the project's template
  const { completedMetrics, totalMetrics } = getProjectCompletionData(project, projectTemplate.categories);
  
  const handleEditProject = () => {
    setCurrentProject(project);
    navigate("/new-evaluation", { state: { project } });
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
    const category = projectTemplate.categories.find(c => c.id === categoryId);
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
      <div className="w-full max-w-[1600px] mx-auto px-2 md:px-4">
        <BackButton onClick={() => navigate("/projects")} />
        
        <ProjectActions 
          project={project}
          onEditProject={handleEditProject}
          onExportPDF={handleExportPDF}
        />
        
        <div className="mb-6">
          <ProjectScoreCard 
            score={project.overallScore || 0} 
            tier={project.overallTier as TierType} 
            completedMetrics={completedMetrics} 
            totalMetrics={totalMetrics}
          />
        </div>
        
        <div className="mb-3 text-sm text-muted-foreground">
          Using template: <span className="font-medium">{projectTemplate.name}</span>
        </div>
        
        <ProjectSummary 
          name={project.name}
          overallTier={project.overallTier as TierType}
          completedMetrics={completedMetrics}
          totalMetrics={totalMetrics}
          metricsData={projectTemplate.categories}
          metrics={project.metrics}
        />
        
        <DetailedMetrics 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          metricsData={projectTemplate.categories}
          generateMetricsWithEvaluation={generateMetricsWithEvaluation}
        />
      </div>
    </AppLayout>
  );
};

export default ProjectDetail;
