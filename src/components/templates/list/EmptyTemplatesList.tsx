
import React from "react";
import { Plus, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyTemplatesListProps {
  searchTerm: string;
  onCreateTemplate: () => void;
  onImportClick: () => void;
}

const EmptyTemplatesList: React.FC<EmptyTemplatesListProps> = ({
  searchTerm,
  onCreateTemplate,
  onImportClick
}) => {
  return (
    <Card className="p-6 text-center">
      <h3 className="text-lg font-medium mb-2">No templates found</h3>
      <p className="text-muted-foreground mb-4">
        {searchTerm ? 
          `No templates match your search for "${searchTerm}"` : 
          "You don't have any templates yet. Create a new template or import one to get started."}
      </p>
      <div className="flex gap-2 justify-center">
        <Button onClick={onCreateTemplate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
        <Button variant="outline" onClick={onImportClick}>
          <Upload className="mr-2 h-4 w-4" />
          Import Template
        </Button>
      </div>
    </Card>
  );
};

export default EmptyTemplatesList;
