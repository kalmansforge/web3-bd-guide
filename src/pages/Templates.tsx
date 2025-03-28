
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Upload, Download, Copy, Trash, Settings, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTemplates } from "@/contexts/TemplateContext";
import { EvaluationTemplate } from "@/types/templates";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Templates = () => {
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  
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
  
  const handleExport = (templateId: string) => {
    exportTemplateById(templateId);
  };
  
  const handleEdit = (template: EvaluationTemplate) => {
    navigate(`/template-editor/${template.id}`);
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
        
        if (!result.success) {
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

  return (
    <AppLayout>
      <PageHeader
        title="Evaluation Templates"
        description="Manage your evaluation frameworks and templates"
        actions={
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleImportClick}
              size="sm"
              disabled={isImporting}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isImporting ? "Importing..." : "Import Template"}
            </Button>
            <Button 
              onClick={handleCreateTemplate}
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Template
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
      
      <div className="mb-8 mt-6">
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredTemplates.map(template => (
          <Card key={template.id} className={`relative ${template.id === activeTemplate.id ? 'border-primary' : ''}`}>
            {template.id === activeTemplate.id && (
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-primary">Active</Badge>
              </div>
            )}
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {template.isBuiltIn && <Badge variant="outline" className="mr-2">Built-in</Badge>}
                    By {template.author}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Categories:</span>
                  <span className="font-medium">{template.categories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Metrics:</span>
                  <span className="font-medium">
                    {template.categories.reduce((sum, cat) => sum + cat.metrics.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-medium">
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
            
            <Separator />
            
            <CardFooter className="pt-4 pb-4 flex flex-wrap gap-2">
              {template.id !== activeTemplate.id && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSetActive(template.id)}
                >
                  <Settings className="mr-1.5 h-3 w-3" />
                  Set Active
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEdit(template)}
              >
                <Edit className="mr-1.5 h-3 w-3" />
                Edit
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDuplicate(template.id)}
              >
                <Copy className="mr-1.5 h-3 w-3" />
                Duplicate
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExport(template.id)}
              >
                <Download className="mr-1.5 h-3 w-3" />
                Export
              </Button>
              
              {!template.isBuiltIn && template.id !== activeTemplate.id && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash className="mr-1.5 h-3 w-3" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Template</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this template? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 mt-4">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(template.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium mb-3">No templates found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm ? 
              `No templates match your search for "${searchTerm}"` : 
              "You don't have any templates yet. Create a new template or import one to get started."}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={handleCreateTemplate}>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
            <Button variant="outline" onClick={handleImportClick}>
              <Upload className="mr-2 h-4 w-4" />
              Import Template
            </Button>
          </div>
        </Card>
      )}
    </AppLayout>
  );
};

export default Templates;
