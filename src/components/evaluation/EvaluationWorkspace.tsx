
import React from "react";
import { ProjectEvaluation, MetricEvaluation, TierType } from "@/types/metrics";
import MetricEvaluationPanel from "@/components/evaluation/MetricEvaluationPanel";
import CategoryNavigationCard from "@/components/evaluation/CategoryNavigationCard";
import ProjectScoreCard from "@/components/ui/ProjectScoreCard";

interface EvaluationWorkspaceProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  metricsData: any[];
  currentProject: ProjectEvaluation;
  handleUpdateMetric: (categoryId: string, metricId: string, evaluation: MetricEvaluation) => void;
  handleSaveProject: () => void;
  score: number;
  tier: TierType;
  completedMetrics: number;
  totalMetrics: number;
}

const EvaluationWorkspace: React.FC<EvaluationWorkspaceProps> = ({
  activeCategory,
  setActiveCategory,
  metricsData,
  currentProject,
  handleUpdateMetric,
  handleSaveProject,
  score,
  tier,
  completedMetrics,
  totalMetrics
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      <div className="md:col-span-3">
        <MetricEvaluationPanel
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          metricsData={metricsData}
          currentProject={currentProject}
          handleUpdateMetric={handleUpdateMetric}
        />
      </div>
      
      <div className="space-y-4">
        <ProjectScoreCard 
          score={score} 
          tier={tier} 
          completedMetrics={completedMetrics} 
          totalMetrics={totalMetrics}
        />
        
        <CategoryNavigationCard
          metricsData={metricsData}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          projectMetrics={currentProject.metrics}
          handleSaveProject={handleSaveProject}
        />
      </div>
    </div>
  );
};

export default EvaluationWorkspace;
