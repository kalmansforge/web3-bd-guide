
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { metricsData } from "@/data/metricsData";
import { MetricEvaluation, TierType } from "@/types/metrics";
import EvaluationTabs from "@/components/evaluation/EvaluationTabs";
import { getProjectCompletionData } from "@/utils/scoring";

const NewEvaluation = () => {
  // Local state
  const [projectName, setProjectName] = useState("");
  const [currentStep, setCurrentStep] = useState("project");
  const [activeCategory, setActiveCategory] = useState(metricsData[0].id);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Navigation and context
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
  
  // Handlers
  const handleCreateProject = () => {
    if (!projectName.trim()) return;
    createProject(projectName);
    setCurrentStep("evaluation");
  };
  
  const handleUpdateMetric = (categoryId: string, metricId: string, evaluation: MetricEvaluation) => {
    if (updateMetric) {
      updateMetric(categoryId, metricId, evaluation);
    }
  };
  
  const handleSaveProject = () => {
    if (saveProject) {
      saveProject();
      navigate("/projects");
    }
  };
  
  // Get evaluation progress stats
  const { completedMetrics, totalMetrics } = getProjectCompletionData(currentProject, metricsData);
  
  // Get score and tier
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
            <button onClick={handleSaveProject} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="mr-2 h-4 w-4"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              Save Evaluation
            </button>
          )
        }
      />
      
      <EvaluationTabs
        currentStep={currentStep}
        projectName={projectName}
        setProjectName={setProjectName}
        handleCreateProject={handleCreateProject}
        currentProject={currentProject}
        handleUpdateMetric={handleUpdateMetric}
        handleSaveProject={handleSaveProject}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        metricsData={metricsData}
        score={score}
        tier={tier}
        completedMetrics={completedMetrics}
        totalMetrics={totalMetrics}
      />
    </AppLayout>
  );
};

export default NewEvaluation;
