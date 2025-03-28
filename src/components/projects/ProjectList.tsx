
import React from "react";
import { ProjectEvaluation } from "@/types/metrics";
import ProjectCard from "./ProjectCard";
import NoMatchingProjects from "./NoMatchingProjects";

interface ProjectListProps {
  filteredProjects: ProjectEvaluation[];
  totalMetrics: number;
  onEditProject: (project: ProjectEvaluation) => void;
}

const ProjectList = ({ filteredProjects, totalMetrics, onEditProject }: ProjectListProps) => {
  if (filteredProjects.length === 0) {
    return <NoMatchingProjects />;
  }

  return (
    <div className="grid gap-4">
      {filteredProjects.map((project) => (
        <ProjectCard 
          key={project.id}
          project={project} 
          totalMetrics={totalMetrics}
          onEdit={onEditProject}
        />
      ))}
    </div>
  );
};

export default ProjectList;
