
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProjectEvaluation, MetricEvaluation, TierType } from "@/types/metrics";
import ProjectDetailsForm from "@/components/evaluation/ProjectDetailsForm";
import EvaluationWorkspace from "@/components/evaluation/EvaluationWorkspace";

interface EvaluationTabsProps {
  currentStep: string;
  projectName: string;
  setProjectName: (name: string) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  handleCreateProject: () => void;
  currentProject: ProjectEvaluation | null;
  handleUpdateMetric: (categoryId: string, metricId: string, evaluation: MetricEvaluation) => void;
  handleSaveProject: () => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  metricsData: any[];
  score: number;
  tier: TierType;
  completedMetrics: number;
  totalMetrics: number;
}

const EvaluationTabs: React.FC<EvaluationTabsProps> = ({
  currentStep,
  projectName,
  setProjectName,
  selectedTemplateId,
  setSelectedTemplateId,
  handleCreateProject,
  currentProject,
  handleUpdateMetric,
  handleSaveProject,
  activeCategory,
  setActiveCategory,
  metricsData,
  score,
  tier,
  completedMetrics,
  totalMetrics
}) => {
  return (
    <Tabs value={currentStep} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="project" disabled={!!currentProject}>Project Details</TabsTrigger>
        <TabsTrigger value="evaluation" disabled={!currentProject}>Metrics Evaluation</TabsTrigger>
      </TabsList>
      
      <TabsContent value="project" className="space-y-4 animate-slide-in">
        <ProjectDetailsForm 
          projectName={projectName}
          setProjectName={setProjectName}
          selectedTemplateId={selectedTemplateId}
          setSelectedTemplateId={setSelectedTemplateId}
          handleCreateProject={handleCreateProject}
        />
      </TabsContent>
      
      <TabsContent value="evaluation" className="space-y-4 animate-slide-in">
        {currentProject && (
          <EvaluationWorkspace
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            metricsData={metricsData}
            currentProject={currentProject}
            handleUpdateMetric={handleUpdateMetric}
            handleSaveProject={handleSaveProject}
            score={score}
            tier={tier}
            completedMetrics={completedMetrics}
            totalMetrics={totalMetrics}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default EvaluationTabs;
