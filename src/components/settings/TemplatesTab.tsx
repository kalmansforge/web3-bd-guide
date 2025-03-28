
import React, { useState, useRef, useEffect } from "react";
import { Plus, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTemplates } from "@/contexts/TemplateContext";
import { useThresholds } from "@/contexts/ThresholdContext";
import TemplatesList from "@/components/templates/list/TemplatesList";
import EmptyTemplatesList from "@/components/templates/list/EmptyTemplatesList";
import TemplateActionsConfirmDialog from "@/components/templates/list/TemplateActionsConfirmDialog";

const TemplatesTab = () => {
  const navigate = useNavigate();
  const { 
    templates, 
    activeTemplate, 
    setActiveTemplateId,
    removeTemplate,
    duplicateTemplateById,
    importTemplateFromJson,
    exportTemplateById,
    createTemplate,
    refreshData
  } = useTemplates();
  
  const { refreshData: refreshThresholds, applyTemplateThresholds } = useThresholds();
  
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(null);
  
  // Refresh data when component mounts to ensure we have the latest templates
  useEffect(() => {
    refreshData();
  }, []);
  
  const handleCreateTemplate = () => {
    const newTemplate = createTemplate();
    navigate(`/template-editor/${newTemplate.id}`);
    toast.success("New template created", {
      description: "Edit the template to customize it for your needs"
    });
  };
  
  const handleSetActive = (templateId: string) => {
    setPendingTemplateId(templateId);
    setConfirmDialogOpen(true);
  };
  
  const confirmSetActive = (updateThresholds: boolean) => {
    if (pendingTemplateId) {
      setActiveTemplateId(pendingTemplateId);
      
      if (updateThresholds) {
        applyTemplateThresholds(pendingTemplateId);
        toast.success("Template and thresholds updated", {
          description: "The template has been set as active and thresholds have been updated"
        });
      } else {
        toast.success("Template activated", {
          description: "The template has been set as active but thresholds remain unchanged"
        });
      }
      
      setPendingTemplateId(null);
      setConfirmDialogOpen(false);
    }
  };
  
  const handleDuplicate = (templateId: string) => {
    const success = duplicateTemplateById(templateId);
    if (success) {
      // Find the newly created duplicate template (it will have "Copy" in the name)
      const original = templates.find(t => t.id === templateId);
      if (original) {
        const duplicate = templates.find(t => 
          t.id !== templateId && t.name === `${original.name} (Copy)`
        );
        
        if (duplicate) {
          navigate(`/template-editor/${duplicate.id}`);
        }
      }
    }
  };
  
  const handleEdit = (templateId: string, isLocked: boolean) => {
    if (isLocked) {
      toast.info("This template cannot be edited directly", {
        description: "You can view it or duplicate it to create your own version",
      });
    }
    navigate(`/template-editor/${templateId}`);
  };
  
  const handleExport = (templateId: string) => {
    exportTemplateById(templateId);
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const fileContent = event.target?.result as string;
        const result = importTemplateFromJson(fileContent);
        
        if (result.success && result.template) {
          navigate(`/template-editor/${result.template.id}`);
        } else {
          toast.error("Import Failed", {
            description: "The file contains invalid template data"
          });
        }
      } catch (error) {
        toast.error("Import Failed", {
          description: "There was an error importing the template"
        });
      } finally {
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    
    reader.onerror = () => {
      toast.error("Import Failed", {
        description: "There was an error reading the file"
      });
    };
    
    reader.readAsText(file);
  };
  
  const handleDelete = (templateId: string) => {
    if (templateId === activeTemplate.id) {
      toast.error("Cannot delete active template", {
        description: "Switch to another template before deleting this one"
      });
      return;
    }
    
    // Check if template is locked
    const template = templates.find(t => t.id === templateId);
    if (template && template.isLocked) {
      toast.error("Cannot delete locked template", {
        description: "This is a built-in template that cannot be deleted"
      });
      return;
    }
    
    removeTemplate(templateId);
  };
  
  // Filter templates based on search
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold">Evaluation Templates</h2>
          <p className="text-sm text-muted-foreground">
            Manage your evaluation frameworks and templates
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleImportClick}
            size="sm"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import Template
          </Button>
          <Button 
            onClick={handleCreateTemplate}
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      
      <div className="mb-6">
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {filteredTemplates.length > 0 ? (
        <TemplatesList
          templates={filteredTemplates}
          activeTemplateId={activeTemplate.id}
          onSetActive={handleSetActive}
          onDuplicate={handleDuplicate}
          onEdit={handleEdit}
          onExport={handleExport}
          onDelete={handleDelete}
        />
      ) : (
        <EmptyTemplatesList
          searchTerm={searchTerm}
          onCreateTemplate={handleCreateTemplate}
          onImportClick={handleImportClick}
        />
      )}
      
      <TemplateActionsConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirmWithThresholds={() => confirmSetActive(true)}
        onConfirmWithoutThresholds={() => confirmSetActive(false)}
      />
    </div>
  );
};

export default TemplatesTab;
