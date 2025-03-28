
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTemplates } from "@/contexts/TemplateContext";
import { EvaluationTemplate } from "@/types/templates";

interface ProjectDetailsFormProps {
  projectName: string;
  setProjectName: (name: string) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  handleCreateProject: () => void;
}

const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({
  projectName,
  setProjectName,
  selectedTemplateId,
  setSelectedTemplateId,
  handleCreateProject
}) => {
  const navigate = useNavigate();
  const { templates, activeTemplate } = useTemplates();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>
          Enter the details of the blockchain project you're evaluating
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="project-name">Project Name</Label>
          <Input
            id="project-name"
            placeholder="Enter project name..."
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="template">Evaluation Template</Label>
          <Select 
            value={selectedTemplateId} 
            onValueChange={setSelectedTemplateId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template: EvaluationTemplate) => (
                <SelectItem 
                  key={template.id} 
                  value={template.id}
                >
                  {template.name} {template.id === activeTemplate.id ? "(Active)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">
            Select which template to use for this evaluation
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/")}>Cancel</Button>
        <Button onClick={handleCreateProject} disabled={!projectName.trim()}>
          Continue to Evaluation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectDetailsForm;
