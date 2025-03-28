
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTemplates } from "@/contexts/TemplateContext";
import { useThresholds } from "@/contexts/ThresholdContext";

export const useTemplateOperations = () => {
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
    refreshData,
    loading
  } = useTemplates();
  
  const { refreshData: refreshThresholds, applyTemplateThresholds } = useThresholds();
  
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
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
  
  const handleDuplicate = async (templateId: string) => {
    const success = duplicateTemplateById(templateId);
    if (success) {
      // Ensure templates are refreshed before navigating
      await refreshData();
      
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    setIsImporting(true);
    
    reader.onload = async (event) => {
      try {
        const fileContent = event.target?.result as string;
        const result = await importTemplateFromJson(fileContent);
        
        if (result.success && result.template) {
          navigate(`/template-editor/${result.template.id}`);
        } else if (!result.success) {
          toast.error("Import Failed", {
            description: "The file contains invalid template data"
          });
        }
      } catch (error) {
        toast.error("Import Failed", {
          description: "There was an error importing the template"
        });
      } finally {
        // Reset file input and importing state
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setIsImporting(false);
      }
    };
    
    reader.onerror = () => {
      toast.error("Import Failed", {
        description: "There was an error reading the file"
      });
      setIsImporting(false);
    };
    
    reader.readAsText(file);
  };
  
  const handleDelete = (templateId: string) => {
    if (!activeTemplate) {
      toast.error("No active template", {
        description: "Please wait for templates to load"
      });
      return;
    }
    
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

  return {
    templates,
    activeTemplate,
    filteredTemplates,
    searchTerm,
    setSearchTerm,
    fileInputRef,
    confirmDialogOpen,
    setConfirmDialogOpen,
    pendingTemplateId,
    isImporting,
    loading,
    refreshData,
    handleCreateTemplate,
    handleSetActive,
    confirmSetActive,
    handleDuplicate,
    handleEdit,
    handleExport,
    handleImportClick,
    handleFileChange,
    handleDelete
  };
};
