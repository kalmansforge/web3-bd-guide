
import React, { useState } from "react";
import { Download, AlertTriangle } from "lucide-react";
import { ProjectEvaluation } from "@/types/metrics";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { exportSingleEvaluation } from "@/utils/storage";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteProjectDialogProps {
  project: ProjectEvaluation;
  trigger: React.ReactNode;
  onDeleted?: () => void;
}

const DeleteProjectDialog: React.FC<DeleteProjectDialogProps> = ({ 
  project, 
  trigger,
  onDeleted
}) => {
  const { deleteProject } = useEvaluation();
  const [hasExported, setHasExported] = useState(false);
  
  const handleExportBeforeDelete = () => {
    if (exportSingleEvaluation(project.id)) {
      toast.success("Project exported", {
        description: "Your evaluation has been exported as a JSON file"
      });
      setHasExported(true);
    } else {
      toast.error("Export failed", {
        description: "There was a problem exporting your evaluation"
      });
    }
  };
  
  const handleDelete = async () => {
    await deleteProject(project.id);
    if (onDeleted) {
      onDeleted();
    }
  };
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project evaluation?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>
                This will permanently delete the evaluation for <strong>{project.name}</strong>. 
                This action cannot be undone.
              </p>
            </div>
            
            <p>Would you like to export this evaluation before deleting it?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col space-y-2 sm:space-y-0">
          <div className="flex w-full flex-col sm:flex-row sm:justify-between gap-2">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={handleExportBeforeDelete}
              disabled={hasExported}
            >
              <Download className="mr-2 h-4 w-4" />
              {hasExported ? "Exported" : "Export First"}
            </Button>
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
          </div>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={!hasExported}
            className={`
              w-full 
              ${!hasExported 
                ? "bg-red-300 cursor-not-allowed" 
                : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
              }
            `}
          >
            {hasExported ? "Delete Evaluation" : "Export First to Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProjectDialog;
