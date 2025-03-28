
import React, { useState, useRef } from "react";
import { Plus, Upload, Download, Copy, Trash, Settings, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTemplates } from "@/contexts/TemplateContext";
import { useThresholds } from "@/contexts/ThresholdContext";
import { EvaluationTemplate } from "@/types/templates";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
    createTemplate
  } = useTemplates();
  
  const { thresholds, refreshData: refreshThresholds, applyTemplateThresholds } = useThresholds();
  
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(null);
  
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
  
  const handleEdit = (templateId: string) => {
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <Card key={template.id} className={`relative ${template.id === activeTemplate.id ? 'border-primary' : ''}`}>
            {template.id === activeTemplate.id && (
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-primary">Active</Badge>
              </div>
            )}
            
            <CardHeader>
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
              <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
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
                  <Settings className="mr-1 h-3 w-3" />
                  Set Active
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEdit(template.id)}
              >
                <Edit className="mr-1 h-3 w-3" />
                Edit
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDuplicate(template.id)}
              >
                <Copy className="mr-1 h-3 w-3" />
                Duplicate
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExport(template.id)}
              >
                <Download className="mr-1 h-3 w-3" />
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
                      <Trash className="mr-1 h-3 w-3" />
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
                    <AlertDialogFooter>
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
        <Card className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 
              `No templates match your search for "${searchTerm}"` : 
              "You don't have any templates yet. Create a new template or import one to get started."}
          </p>
          <div className="flex gap-2 justify-center">
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
      
      {/* Template activation confirmation dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply Template</DialogTitle>
            <DialogDescription>
              Would you like to update the thresholds based on this template? This will replace your current threshold configurations.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => confirmSetActive(false)}>
              Keep Current Thresholds
            </Button>
            <Button onClick={() => confirmSetActive(true)}>
              Update Thresholds
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplatesTab;
