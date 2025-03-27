
import React, { createContext, useContext, useState } from "react";
import { ProjectEvaluation, MetricEvaluation, TierType } from "@/types/metrics";
import { toast } from "sonner";

interface EvaluationContextType {
  projects: ProjectEvaluation[];
  currentProject: ProjectEvaluation | null;
  setCurrentProject: (project: ProjectEvaluation | null) => void;
  createProject: (name: string) => void;
  updateMetric: (categoryId: string, metricId: string, evaluation: MetricEvaluation) => void;
  saveProject: () => void;
  deleteProject: (id: string) => void;
  calculateProjectScore: (project?: ProjectEvaluation) => { score: number; tier: TierType };
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

  const saveProject = () => {
    if (!currentProject) return;
    
    const { score, tier } = calculateProjectScore();
    const updatedProject = {
      ...currentProject,
      overallScore: score,
      overallTier: tier
    };
    
    setProjects(prev => {
      const existing = prev.findIndex(p => p.id === updatedProject.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = updatedProject;
        return updated;
      }
      return [...prev, updatedProject];
    });
    
    setCurrentProject(updatedProject);
    toast.success("Project saved", {
      description: `${updatedProject.name} has been saved with a score of ${Math.round(score)}/100`
    });
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
    toast.success("Project deleted", {
      description: "The project has been removed from your evaluations"
    });
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
        calculateProjectScore
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};
