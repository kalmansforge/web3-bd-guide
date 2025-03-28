
import React, { createContext, useContext, useState, useEffect } from "react";
import { ProjectEvaluation, MetricEvaluation, TierType } from "@/types/metrics";
import { toast } from "sonner";
import { saveEvaluationsToStorage, getEvaluationsFromStorage } from "@/utils/storage";
import { calculateProjectScore } from "@/utils/scoring";
import { useTemplates } from "@/contexts/TemplateContext";

interface EvaluationContextType {
  projects: ProjectEvaluation[];
  currentProject: ProjectEvaluation | null;
  setCurrentProject: (project: ProjectEvaluation | null) => void;
  createProject: (name: string, templateId?: string) => void;
  updateMetric: (categoryId: string, metricId: string, evaluation: MetricEvaluation) => void;
  saveProject: () => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  calculateProjectScore: (project?: ProjectEvaluation) => { score: number; tier: TierType };
  loading: boolean;
  refreshData: () => void;
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

export const useEvaluation = () => {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error("useEvaluation must be used within an EvaluationProvider");
  }
  return context;
};

export const EvaluationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectEvaluation[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const { activeTemplate, templates } = useTemplates();

  const loadProjects = () => {
    try {
      setLoading(true);
      const storedProjects = getEvaluationsFromStorage();
      setProjects(storedProjects);
    } catch (error: any) {
      toast.error("Failed to load projects", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  const refreshData = () => {
    loadProjects();
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = (name: string, templateId?: string) => {
    // Use the specified templateId or default to activeTemplate id
    const selectedTemplateId = templateId || activeTemplate.id;
    
    const newProject: ProjectEvaluation = {
      id: crypto.randomUUID(),
      name,
      date: new Date().toISOString(),
      metrics: {},
      templateId: selectedTemplateId, // Store the template ID with the project
    };
    
    setCurrentProject(newProject);
    toast.success("New project created", {
      description: `Started evaluation for ${name}`
    });
  };

  const updateMetric = (categoryId: string, metricId: string, evaluation: MetricEvaluation) => {
    if (!currentProject) return;
    
    const metricKey = `${categoryId}_${metricId}`;
    const updatedProject = {
      ...currentProject,
      metrics: {
        ...currentProject.metrics,
        [metricKey]: evaluation
      }
    };
    
    setCurrentProject(updatedProject);
  };

  const calculateProjectScoreWrapper = (project = currentProject) => {
    if (!project) return { score: 0, tier: null };
    
    // Get the template used for this project
    const templateId = project.templateId || activeTemplate.id;
    const projectTemplate = templates.find(t => t.id === templateId) || activeTemplate;
    
    const result = calculateProjectScore(project, projectTemplate.categories);
    return { score: result.score, tier: result.tier };
  };

  const saveProject = async () => {
    if (!currentProject) return;
    
    try {
      setLoading(true);
      
      const { score, tier } = calculateProjectScoreWrapper();
      const updatedProject = {
        ...currentProject,
        overallScore: score,
        overallTier: tier
      };
      
      setProjects(prev => {
        const existing = prev.findIndex(p => p.id === updatedProject.id);
        const updatedProjects = existing >= 0 
          ? prev.map(p => p.id === updatedProject.id ? updatedProject : p)
          : [...prev, updatedProject];
          
        saveEvaluationsToStorage(updatedProjects);
        return updatedProjects;
      });
      
      setCurrentProject(updatedProject);
      toast.success("Project saved", {
        description: `${updatedProject.name} has been saved with a score of ${Math.round(score)}/100`
      });
    } catch (error: any) {
      toast.error("Failed to save project", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setLoading(true);
      
      setProjects(prev => {
        const updatedProjects = prev.filter(p => p.id !== id);
        saveEvaluationsToStorage(updatedProjects);
        return updatedProjects;
      });
      
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }
      
      toast.success("Project deleted", {
        description: "The project has been removed from your evaluations"
      });
    } catch (error: any) {
      toast.error("Failed to delete project", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <EvaluationContext.Provider
      value={{
        projects,
        currentProject,
        setCurrentProject,
        createProject,
        updateMetric,
        saveProject,
        deleteProject,
        calculateProjectScore: calculateProjectScoreWrapper,
        loading,
        refreshData
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};
