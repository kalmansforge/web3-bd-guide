
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { useTemplates } from "@/contexts/TemplateContext";
import { MetricEvaluation, TierType } from "@/types/metrics";
import EvaluationTabs from "@/components/evaluation/EvaluationTabs";
import { getProjectCompletionData } from "@/utils/scoring";

const NewEvaluation = () => {
  // Get templates
  const { activeTemplate, templates } = useTemplates();
  
  // Local state
  const [projectName, setProjectName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [currentStep, setCurrentStep] = useState("project");
  const [activeCategory, setActiveCategory] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Navigation and context
  const navigate = useNavigate();
  const location = useLocation();
  const { createProject, currentProject, setCurrentProject, updateMetric, saveProject, calculateProjectScore } = useEvaluation();
  
  // Initialize the selected template ID once templates are loaded
  useEffect(() => {
    if (activeTemplate && activeTemplate.id && !selectedTemplateId) {
      setSelectedTemplateId(activeTemplate.id);
      setIsLoading(false);
    }
  }, [activeTemplate, selectedTemplateId]);
  
  // Check if we're in edit mode - only if explicitly passed via state
  useEffect(() => {
    // Only set edit mode if we have state passed with the project to edit
    const editProject = location.state?.project;
    
    if (editProject) {
      setProjectName(editProject.name);
      setCurrentStep("evaluation");
      setIsEditMode(true);
      setCurrentProject(editProject);
      
      // If the project has a templateId, use that
      if (editProject.templateId) {
        setSelectedTemplateId(editProject.templateId);
      } else {
        // Fallback to active template
        setSelectedTemplateId(activeTemplate.id);
      }
      setIsLoading(false);
    } else {
      // Clear current project when accessing the page directly
      setCurrentProject(null);
      setProjectName("");
      setCurrentStep("project");
      setIsEditMode(false);
      
      // Only set selectedTemplateId if activeTemplate is loaded and selectedTemplateId is empty
      if (activeTemplate && activeTemplate.id && !selectedTemplateId) {
        setSelectedTemplateId(activeTemplate.id);
      }
    }
  }, [location.state, setCurrentProject, activeTemplate.id, selectedTemplateId]);
  
  // Get the currently selected template
  const selectedTemplate = templates.find(t => t.id === (currentProject?.templateId || selectedTemplateId)) || activeTemplate;
  
  // Update active category when template changes
  useEffect(() => {
    if (selectedTemplate && selectedTemplate.categories && selectedTemplate.categories.length > 0 && !activeCategory) {
      setActiveCategory(selectedTemplate.categories[0].id);
    }
  }, [selectedTemplate, activeCategory]);
  
  // Handlers
  const handleCreateProject = () => {
    if (!projectName.trim() || !selectedTemplateId) return;
    createProject(projectName, selectedTemplateId);
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
  
  // Get evaluation progress stats based on the selected template
  const { completedMetrics, totalMetrics } = getProjectCompletionData(
    currentProject, 
    selectedTemplate?.categories || []
  );
  
  // Get score and tier
  const { score, tier } = currentProject 
    ? calculateProjectScore() 
    : { score: 0, tier: null as TierType };

  // Show loading state if templates are not yet loaded
  if (isLoading || !selectedTemplate) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading templates...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={isEditMode ? `Editing: ${currentProject?.name}` : (currentProject ? `Evaluating: ${currentProject.name}` : "New Project Evaluation")}
        description={currentProject 
          ? `Evaluating using the "${selectedTemplate.name}" template` 
          : "Start by entering the project name and selecting a template"
        }
        actions={
          currentProject && (
            <button onClick={handleSaveProject} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              Save Evaluation
            </button>
          )
        }
      />
      
      <EvaluationTabs
        currentStep={currentStep}
        projectName={projectName}
        setProjectName={setProjectName}
        selectedTemplateId={selectedTemplateId}
        setSelectedTemplateId={setSelectedTemplateId}
        handleCreateProject={handleCreateProject}
        currentProject={currentProject}
        handleUpdateMetric={handleUpdateMetric}
        handleSaveProject={handleSaveProject}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        metricsData={selectedTemplate.categories || []}
        score={score}
        tier={tier}
        completedMetrics={completedMetrics}
        totalMetrics={totalMetrics}
      />
    </AppLayout>
  );
};

export default NewEvaluation;
