
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";

interface ProjectActionsProps {
  project: {
    id: string;
    name: string;
    date: string;
  };
  onEditProject: () => void;
  onExportPDF: () => void;
}

const ProjectActions = ({ project, onEditProject, onExportPDF }: ProjectActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <>
      <PageHeader
        title={project.name}
        description={`Evaluation created on ${new Date(project.date).toLocaleDateString()}`}
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onExportPDF}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={onEditProject}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Evaluation
            </Button>
          </div>
        }
      />
      
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => navigate("/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    </>
  );
};

export default ProjectActions;
