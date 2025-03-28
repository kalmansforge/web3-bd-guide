
import { useState } from "react";
import { toast } from "sonner";
import { EvaluationTemplate } from "@/types/templates";
import { importTemplate, exportTemplate } from "@/utils/storage/templates";

export function useTemplateImportExport() {
  const [loading, setLoading] = useState(false);

  const importTemplateFromJson = async (json: string): Promise<{ success: boolean; template?: EvaluationTemplate }> => {
    try {
      setLoading(true);
      const result = importTemplate(json);
      
      if (!result.success) {
        toast.error("Failed to import template", {
          description: "The file contains invalid template data"
        });
      } else if (result.template) {
        toast.success("Template imported successfully");
      }
      
      return result;
    } catch (error: any) {
      toast.error("Error importing template", {
        description: error.message
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const exportTemplateById = (id: string): boolean => {
    try {
      setLoading(true);
      const success = exportTemplate(id);
      
      if (!success) {
        toast.error("Failed to export template");
      }
      
      return success;
    } catch (error: any) {
      toast.error("Error exporting template", {
        description: error.message
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    importTemplateFromJson,
    exportTemplateById,
    loading
  };
}
