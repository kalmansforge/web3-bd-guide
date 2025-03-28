
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

interface ProjectDetailsFormProps {
  projectName: string;
  setProjectName: (name: string) => void;
  handleCreateProject: () => void;
}

const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({
  projectName,
  setProjectName,
  handleCreateProject
}) => {
  const navigate = useNavigate();
  
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
