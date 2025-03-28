
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, DownloadIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";
import DeleteProjectDialog from "@/components/ui/DeleteProjectDialog";
import { ProjectEvaluation } from "@/types/metrics";

interface ProjectActionsProps {
  project: ProjectEvaluation;
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
            <DeleteProjectDialog 
              project={project}
              onDeleted={() => navigate("/projects")}
              trigger={
                <Button variant="outline" className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              }
            />
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
