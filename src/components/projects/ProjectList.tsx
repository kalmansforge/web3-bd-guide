
import React from "react";
import { ProjectEvaluation } from "@/types/metrics";
import ProjectCard from "./ProjectCard";
import NoMatchingProjects from "./NoMatchingProjects";
import { EvaluationTemplate } from "@/types/templates";

interface ProjectListProps {
  filteredProjects: ProjectEvaluation[];
  templates: EvaluationTemplate[];
  activeTemplate: EvaluationTemplate;
  onEditProject: (project: ProjectEvaluation) => void;
}

const ProjectList = ({ filteredProjects, templates, activeTemplate, onEditProject }: ProjectListProps) => {
  if (filteredProjects.length === 0) {
    return <NoMatchingProjects />;
  }

  return (
    <div className="grid gap-4">
      {filteredProjects.map((project) => {
        // Find the template used for this project
        const projectTemplateId = project.templateId || activeTemplate.id;
        const projectTemplate = templates.find(t => t.id === projectTemplateId) || activeTemplate;
        
        // Calculate total metrics for this specific project's template
        const totalMetrics = projectTemplate.categories.reduce(
          (acc, category) => acc + category.metrics.length, 
          0
        );
        
        return (
          <ProjectCard 
            key={project.id}
            project={project} 
            totalMetrics={totalMetrics}
            templateName={projectTemplate.name}
            onEdit={onEditProject}
          />
        );
      })}
    </div>
  );
};

export default ProjectList;
