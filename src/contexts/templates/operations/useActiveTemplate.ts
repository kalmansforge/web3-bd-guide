
import { useState } from "react";
import { toast } from "sonner";
import { setActiveTemplate as setActiveTemplateInStorage } from "@/utils/storage/templates";
import { EvaluationTemplate } from "@/types/templates";

export function useActiveTemplate() {
  const [activeTemplate, setActiveTemplate] = useState<EvaluationTemplate | null>(null);
  const [loading, setLoading] = useState(false);

  const setActiveTemplateId = (id: string) => {
    try {
      setLoading(true);
      
      const success = setActiveTemplateInStorage(id);
      if (!success) {
        toast.error("Failed to set active template");
        return false;
      }
      
      return true;
    } catch (error: any) {
      toast.error("Error setting active template", {
        description: error.message
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    activeTemplate,
    setActiveTemplate,
    setActiveTemplateId,
    loading
  };
}
