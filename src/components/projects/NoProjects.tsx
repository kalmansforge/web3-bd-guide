
import React from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NoProjectsProps {
  onNewEvaluation: () => void;
}

const NoProjects = ({ onNewEvaluation }: NoProjectsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No evaluations yet</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Start by creating your first project evaluation to see results here.
        </p>
        <Button onClick={onNewEvaluation}>
          <Plus className="mr-2 h-4 w-4" />
          Create Evaluation
        </Button>
      </CardContent>
    </Card>
  );
};

export default NoProjects;
