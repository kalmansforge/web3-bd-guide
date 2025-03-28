
import React, { createContext, useContext, useState, useEffect } from "react";
import { ProjectEvaluation, MetricEvaluation, TierType } from "@/types/metrics";
import { toast } from "sonner";
import { saveEvaluationsToStorage, getEvaluationsFromStorage } from "@/utils/localStorageUtils";

interface EvaluationContextType {
  projects: ProjectEvaluation[];
  currentProject: ProjectEvaluation | null;
  setCurrentProject: (project: ProjectEvaluation | null) => void;
  createProject: (name: string) => void;
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

  // Load projects from local storage
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
  
  // Refresh data (used after import)
  const refreshData = () => {
    loadProjects();
  };

  // Load projects on initial mount
  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = (name: string) => {
    const newProject: ProjectEvaluation = {
      id: crypto.randomUUID(),
      name,
      date: new Date().toISOString(),
      metrics: {},
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

  const calculateProjectScore = (project = currentProject): { score: number; tier: TierType } => {
    if (!project) return { score: 0, tier: null };
    
    const metrics = Object.values(project.metrics);
    if (metrics.length === 0) return { score: 0, tier: null };
    
    const t0Count = metrics.filter(m => m.tier === 'T0').length;
    const t1Count = metrics.filter(m => m.tier === 'T1').length;
    const totalMetrics = metrics.length;
    
    const score = (t0Count * 100 + t1Count * 50) / totalMetrics;
    
    let tier: TierType = null;
    if (score >= 70) tier = 'T0';
    else if (score >= 40) tier = 'T1';
    
    return { score, tier };
  };

  const saveProject = async () => {
    if (!currentProject) return;
    
    try {
      setLoading(true);
      
      const { score, tier } = calculateProjectScore();
      const updatedProject = {
        ...currentProject,
        overallScore: score,
        overallTier: tier
      };
      
      // Update local state
      setProjects(prev => {
        const existing = prev.findIndex(p => p.id === updatedProject.id);
        const updatedProjects = existing >= 0 
          ? prev.map(p => p.id === updatedProject.id ? updatedProject : p)
          : [...prev, updatedProject];
          
        // Save to local storage
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
      
      // Update local state
      setProjects(prev => {
        const updatedProjects = prev.filter(p => p.id !== id);
        // Save to local storage
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
        calculateProjectScore,
        loading,
        refreshData
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};
