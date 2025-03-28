
import { useState } from "react";
import { toast } from "sonner";
import { duplicateTemplate } from "@/utils/storage/templates";

export function useTemplateDuplication() {
  const [loading, setLoading] = useState(false);

  const duplicateTemplateById = (id: string): boolean => {
    try {
      setLoading(true);
      
      if (duplicateTemplate(id)) {
        toast.success("Template duplicated", {
          description: "A copy of the template has been created"
        });
        return true;
      } else {
        toast.error("Failed to duplicate template");
        return false;
      }
    } catch (error: any) {
      toast.error("Error duplicating template", {
        description: error.message
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    duplicateTemplateById,
    loading
  };
}
