
import React, { createContext, useContext, useState, useEffect } from "react";
import { ProjectEvaluation, MetricEvaluation, TierType } from "@/types/metrics";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const { user } = useAuth();

  // Fetch projects when user changes
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setProjects([]);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch all evaluations for the current user
        const { data: evaluations, error: evalError } = await supabase
          .from('evaluations')
          .select('*, projects(*)')
          .eq('user_id', user.id);
          
        if (evalError) throw evalError;
        
        if (!evaluations || evaluations.length === 0) {
          setProjects([]);
          return;
        }
        
        // Fetch metric evaluations for each evaluation
        const projectsWithMetrics = await Promise.all(
          evaluations.map(async (evaluation) => {
            const { data: metricEvals, error: metricError } = await supabase
              .from('metric_evaluations')
              .select('*')
              .eq('evaluation_id', evaluation.id);
              
            if (metricError) throw metricError;
            
            // Format metric evaluations into the expected structure
            const metrics: Record<string, MetricEvaluation> = {};
            metricEvals?.forEach(metric => {
              const metricKey = `${metric.category_id}_${metric.metric_id}`;
              metrics[metricKey] = {
                value: metric.value,
                tier: metric.tier as TierType,
                notes: metric.notes || ""
              };
            });
            
            // Create a ProjectEvaluation object
            return {
              id: evaluation.id,
              name: evaluation.projects.name,
              date: evaluation.created_at,
              metrics,
              overallScore: evaluation.overall_score,
              overallTier: evaluation.overall_tier as TierType,
              notes: evaluation.notes
            } as ProjectEvaluation;
          })
        );
        
        setProjects(projectsWithMetrics);
      } catch (error: any) {
        toast.error("Failed to load projects", {
          description: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const createProject = (name: string) => {
    if (!user) {
      toast.error("You must be logged in to create a project");
      return;
    }
    
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
    if (!currentProject || !user) return;
    
    try {
      setLoading(true);
      
      const { score, tier } = calculateProjectScore();
      const updatedProject = {
        ...currentProject,
        overallScore: score,
        overallTier: tier
      };
      
      // First, create or update the project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .upsert({
          id: updatedProject.id,
          name: updatedProject.name,
          user_id: user.id
        }, {
          onConflict: 'id'
        })
        .select('id')
        .single();
        
      if (projectError) throw projectError;
      
      // Then create or update the evaluation
      const { data: evalData, error: evalError } = await supabase
        .from('evaluations')
        .upsert({
          id: updatedProject.id,
          project_id: projectData.id,
          user_id: user.id,
          name: updatedProject.name,
          overall_score: score,
          overall_tier: tier,
          notes: updatedProject.notes || ""
        }, {
          onConflict: 'id'
        })
        .select('id')
        .single();
        
      if (evalError) throw evalError;
      
      // Finally save all metric evaluations
      const metricInserts = Object.entries(updatedProject.metrics).map(([key, evaluation]) => {
        const [categoryId, metricId] = key.split('_');
        return {
          evaluation_id: evalData.id,
          category_id: categoryId,
          metric_id: metricId,
          value: String(evaluation.value),
          tier: evaluation.tier,
          notes: evaluation.notes || ""
        };
      });
      
      // First delete any existing metrics for this evaluation
      await supabase
        .from('metric_evaluations')
        .delete()
        .eq('evaluation_id', evalData.id);
      
      // Then insert the new ones
      if (metricInserts.length > 0) {
        const { error: metricsError } = await supabase
          .from('metric_evaluations')
          .insert(metricInserts);
          
        if (metricsError) throw metricsError;
      }
      
      // Update local state
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
    } catch (error: any) {
      toast.error("Failed to save project", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Delete the evaluation (cascades to metric_evaluations)
      const { error } = await supabase
        .from('evaluations')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setProjects(prev => prev.filter(p => p.id !== id));
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
        loading
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};
