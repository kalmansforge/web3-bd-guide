
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { metricsData } from "@/data/metricsData";
import ProjectScoreCard from "@/components/ui/ProjectScoreCard";
import { Metric, TierType } from "@/types/metrics";
import { exportSingleEvaluation } from "@/utils/storage";
import AppLayout from "@/components/layout/AppLayout";
import { getProjectCompletionData } from "@/utils/scoring";
import { useIsMobile } from "@/hooks/use-mobile";

// Import our new components
import ProjectActions from "@/components/project-detail/ProjectActions";
import ProjectSummary from "@/components/project-detail/ProjectSummary";
import CategoryNavigation from "@/components/project-detail/CategoryNavigation";
import DetailedMetrics from "@/components/project-detail/DetailedMetrics";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, setCurrentProject } = useEvaluation();
  const [activeCategory, setActiveCategory] = useState(metricsData[0].id);
  const isMobile = useIsMobile();
  
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
  
  // Get evaluation progress stats using our utility function
  const { completedMetrics, totalMetrics } = getProjectCompletionData(project, metricsData);
  
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
      <div className="max-w-[1600px] mx-auto">
        <ProjectActions 
          project={project}
          onEditProject={handleEditProject}
          onExportPDF={handleExportPDF}
        />
        
        <div className={`mb-6 ${isMobile ? "px-1" : ""}`}>
          <ProjectScoreCard 
            score={project.overallScore || 0} 
            tier={project.overallTier as TierType} 
            completedMetrics={completedMetrics} 
            totalMetrics={totalMetrics}
          />
        </div>
        
        <ProjectSummary 
          name={project.name}
          overallTier={project.overallTier as TierType}
          completedMetrics={completedMetrics}
          totalMetrics={totalMetrics}
          metricsData={metricsData}
          metrics={project.metrics}
        />
        
        <CategoryNavigation 
          categories={metricsData}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        <DetailedMetrics 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          metricsData={metricsData}
          generateMetricsWithEvaluation={generateMetricsWithEvaluation}
        />
      </div>
    </AppLayout>
  );
};

export default ProjectDetail;
