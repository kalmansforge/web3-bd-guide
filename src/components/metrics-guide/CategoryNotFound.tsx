
import React from "react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";
import { useTemplates } from "@/contexts/TemplateContext";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

const CategoryNotFound: React.FC = () => {
  const navigate = useNavigate();
  const { activeTemplate } = useTemplates();
  
  const handleConfigureMetrics = () => {
    // Navigate to template editor for the active template
    if (activeTemplate?.id) {
      navigate(`/template-editor/${activeTemplate.id}`);
    } else {
      // If no active template, go to templates tab in settings
      navigate("/settings?tab=templates");
    }
  };

  return (
    <AppLayout>
      <div className="py-10 text-center">
        <h2 className="text-2xl font-bold">Category not found</h2>
        <p className="mt-2 text-muted-foreground">The requested category does not exist.</p>
        <Button onClick={handleConfigureMetrics} className="mt-4 gap-2">
          <Settings className="h-4 w-4" />
          Configure Metrics
        </Button>
      </div>
    </AppLayout>
  );
};

export default CategoryNotFound;
