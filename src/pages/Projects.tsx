
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { metricsData } from "@/data/metricsData";
import { ProjectEvaluation } from "@/types/metrics";

// Import our new components
import ProjectFilters from "@/components/projects/ProjectFilters";
import NoProjects from "@/components/projects/NoProjects";
import ProjectList from "@/components/projects/ProjectList";

const Projects = () => {
  const { projects, setCurrentProject } = useEvaluation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState<string | null>(null);
  
  const totalMetrics = metricsData.reduce((acc, category) => acc + category.metrics.length, 0);
  
  const handleNewEvaluation = () => {
    setCurrentProject(null);
    navigate('/new-evaluation');
  };

  const handleEditProject = (project: ProjectEvaluation) => {
    navigate(`/new-evaluation`, { state: { project } });
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier ? project.overallTier === filterTier : true;
    return matchesSearch && matchesTier;
  });

  return (
    <AppLayout>
      <PageHeader
        title="Project Evaluations"
        description="View and manage your blockchain project evaluations"
        actions={
          <Button onClick={handleNewEvaluation}>
            <Plus className="mr-2 h-4 w-4" />
            New Evaluation
          </Button>
        }
      />
      
      {projects.length > 0 ? (
        <>
          <ProjectFilters 
            searchTerm={searchTerm}
            filterTier={filterTier}
            setSearchTerm={setSearchTerm}
            setFilterTier={setFilterTier}
          />
          
          <ProjectList 
            filteredProjects={filteredProjects}
            totalMetrics={totalMetrics}
            onEditProject={handleEditProject}
          />
        </>
      ) : (
        <NoProjects onNewEvaluation={handleNewEvaluation} />
      )}
    </AppLayout>
  );
};

export default Projects;
