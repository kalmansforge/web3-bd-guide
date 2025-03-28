
import { useState } from "react";
import { toast } from "sonner";
import { deleteTemplate } from "@/utils/storage/templates";

export function useTemplateRemoval() {
  const [loading, setLoading] = useState(false);

  const removeTemplate = (id: string): boolean => {
    try {
      setLoading(true);
      
      if (deleteTemplate(id)) {
        toast.success("Template deleted", {
          description: "The template has been removed"
        });
        return true;
      } else {
        toast.error("Cannot delete template", {
          description: "You cannot delete the active template or the last remaining template"
        });
        return false;
      }
    } catch (error: any) {
      toast.error("Error deleting template", {
        description: error.message
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    removeTemplate,
    loading
  };
}
