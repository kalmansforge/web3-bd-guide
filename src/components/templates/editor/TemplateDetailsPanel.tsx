
import React from "react";
import { EvaluationTemplate } from "@/types/templates";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Settings } from "lucide-react";

interface TemplateDetailsPanelProps {
  template: EvaluationTemplate;
  isLocked: boolean;
  handleTemplateChange: (field: keyof EvaluationTemplate, value: string) => void;
}

const TemplateDetailsPanel: React.FC<TemplateDetailsPanelProps> = ({
  template,
  isLocked,
  handleTemplateChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLocked && (
          <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-md mb-4 border border-yellow-200 dark:border-yellow-800">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
              This template is locked
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              This is a built-in template that cannot be edited. You can duplicate it to create your own editable version.
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Template Name</label>
          <Input
            value={template.name}
            onChange={(e) => handleTemplateChange("name", e.target.value)}
            placeholder="Enter template name"
            readOnly={isLocked}
            className={isLocked ? "bg-muted cursor-not-allowed" : ""}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={template.description}
            onChange={(e) => handleTemplateChange("description", e.target.value)}
            placeholder="Enter template description"
            rows={4}
            readOnly={isLocked}
            className={isLocked ? "bg-muted cursor-not-allowed" : ""}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Author</label>
          <Input
            value={template.author}
            onChange={(e) => handleTemplateChange("author", e.target.value)}
            placeholder="Enter author name"
            readOnly={isLocked}
            className={isLocked ? "bg-muted cursor-not-allowed" : ""}
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Settings className="h-4 w-4" />
          <span>Template ID: {template.id}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Last updated: {new Date(template.updatedAt).toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateDetailsPanel;
