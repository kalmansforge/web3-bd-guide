
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { metricsData } from "@/data/metricsData";
import { ProjectEvaluation } from "@/types/metrics";
import { toast } from "sonner";
import { importData } from "@/utils/storage";

// Import our components
import ProjectFilters from "@/components/projects/ProjectFilters";
import NoProjects from "@/components/projects/NoProjects";
import ProjectList from "@/components/projects/ProjectList";

const Projects = () => {
  const { projects, setCurrentProject, refreshData } = useEvaluation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const totalMetrics = metricsData.reduce((acc, category) => acc + category.metrics.length, 0);
  
  const handleNewEvaluation = () => {
    setCurrentProject(null);
    navigate('/new-evaluation');
  };

  const handleEditProject = (project: ProjectEvaluation) => {
    navigate(`/new-evaluation`, { state: { project } });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const fileContent = event.target?.result as string;
        const result = importData(fileContent);
        
        if (result.success) {
          if (result.type === 'complete') {
            toast.success("Import Successful", {
              description: "Your complete data (evaluations, thresholds, and settings) has been imported successfully."
            });
          } else if (result.type === 'evaluation') {
            toast.success("Evaluation Import Successful", {
              description: "The project evaluation has been imported and added to your existing projects."
            });
          }
          
          refreshData();
        } else {
          toast.error("Import Failed", {
            description: "The file contains invalid data. Please check the file and try again."
          });
        }
      } catch (error) {
        toast.error("Import Failed", {
          description: "There was an error importing your data. Please try again."
        });
      } finally {
        setIsImporting(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    
    reader.onerror = () => {
      toast.error("Import Failed", {
        description: "There was an error reading the file. Please try again."
      });
      setIsImporting(false);
    };
    
    reader.readAsText(file);
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImportClick} disabled={isImporting}>
              <Upload className="mr-2 h-4 w-4" />
              Import Evaluation
            </Button>
            <Button onClick={handleNewEvaluation}>
              <Plus className="mr-2 h-4 w-4" />
              New Evaluation
            </Button>
          </div>
        }
      />
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
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
