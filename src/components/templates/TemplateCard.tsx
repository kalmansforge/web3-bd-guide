
import React from "react";
import { Settings, Edit, Copy, Download, Trash } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { EvaluationTemplate } from "@/types/templates";

interface TemplateCardProps {
  template: EvaluationTemplate;
  isActive: boolean;
  onSetActive: (templateId: string) => void;
  onDuplicate: (templateId: string) => void;
  onEdit: (template: EvaluationTemplate) => void;
  onExport: (templateId: string) => void;
  onDelete: (templateId: string) => void;
}

const TemplateCard = ({
  template,
  isActive,
  onSetActive,
  onDuplicate,
  onEdit,
  onExport,
  onDelete
}: TemplateCardProps) => {
  return (
    <Card className={`relative ${isActive ? 'border-primary' : ''}`}>
      {isActive && (
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
        {!isActive && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSetActive(template.id)}
          >
            <Settings className="mr-1.5 h-3 w-3" />
            Set Active
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(template)}
        >
          <Edit className="mr-1.5 h-3 w-3" />
          Edit
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDuplicate(template.id)}
        >
          <Copy className="mr-1.5 h-3 w-3" />
          Duplicate
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onExport(template.id)}
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
                  onClick={() => onDelete(template.id)}
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
  );
};

export default TemplateCard;
