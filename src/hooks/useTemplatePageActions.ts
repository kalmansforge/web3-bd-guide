
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTemplates } from "@/contexts/TemplateContext";
import { toast } from "sonner";
import { EvaluationTemplate } from "@/types/templates";

export const useTemplatePageActions = () => {
  const navigate = useNavigate();
  const { 
    templates, 
    activeTemplate, 
    setActiveTemplateId,
    removeTemplate,
    duplicateTemplateById,
    importTemplateFromJson,
    exportTemplateById,
    createTemplate
  } = useTemplates();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateTemplate = () => {
    createTemplate();
    toast.success("New template created", {
      description: "Edit the template to customize it for your needs"
    });
  };

  const handleSetActive = (templateId: string) => {
    setActiveTemplateId(templateId);
  };

  const handleDuplicate = (templateId: string) => {
    duplicateTemplateById(templateId);
  };

  const handleEdit = (template: EvaluationTemplate) => {
    navigate(`/template-editor/${template.id}`);
  };

  const handleExport = (templateId: string) => {
    exportTemplateById(templateId);
  };

  const handleDelete = (templateId: string) => {
    if (templateId === activeTemplate.id) {
      toast.error("Cannot delete active template", {
        description: "Switch to another template before deleting this one"
      });
      return;
    }
    
    removeTemplate(templateId);
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
        
        if (result.success) {
          toast.success("Import Successful", {
            description: "Template has been imported successfully."
          });
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
    isImporting,
    fileInputRef,
    handleCreateTemplate,
    handleSetActive,
    handleDuplicate,
    handleEdit,
    handleExport,
    handleDelete,
    handleImportClick,
    handleFileChange
  };
};
