import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, Settings, Edit, Copy, Download, Trash } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
  onEdit: (templateId: string, isLocked: boolean) => void;
  onExport: (templateId: string) => void;
  onDelete: (templateId: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isActive,
  onSetActive,
  onDuplicate,
  onEdit,
  onExport,
  onDelete
}) => {
  const navigate = useNavigate();

  return (
    <Card key={template.id} className={`relative ${isActive ? 'border-primary' : ''}`}>
      {isActive && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-primary">Active</Badge>
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              {template.isLocked && (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <CardDescription className="mt-1">
              {template.isBuiltIn && <Badge variant="outline" className="mr-2">Built-in</Badge>}
              By {template.author}
              {template["aiui-author"] && (
                <span className="ml-2">
                  <Badge variant="secondary">AI: {template["aiui-author"]}</Badge>
                </span>
              )}
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
        {!isActive && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSetActive(template.id)}
          >
            <Settings className="mr-1 h-3 w-3" />
            Set Active
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(template.id, template.isLocked || false)}
        >
          {template.isLocked ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-3 w-3">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              View
            </>
          ) : (
            <>
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDuplicate(template.id)}
        >
          <Copy className="mr-1 h-3 w-3" />
          Duplicate
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onExport(template.id)}
        >
          <Download className="mr-1 h-3 w-3" />
          Export
        </Button>
        
        {!template.isLocked && !isActive && (
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
