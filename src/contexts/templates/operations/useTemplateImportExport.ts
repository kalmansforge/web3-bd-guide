
import { useState } from "react";
import { toast } from "sonner";
import { EvaluationTemplate } from "@/types/templates";
import {
  importTemplate,
  exportTemplate
} from "@/utils/storage/templates";

export function useTemplateImportExport() {
  const [loading, setLoading] = useState(false);

  const importTemplateFromJson = (json: string) => {
    try {
      setLoading(true);
      
      const result = importTemplate(json);
      
      if (result.success && result.template) {
        toast.success("Template imported", {
          description: `"${result.template.name}" has been imported`
        });
      } else {
        toast.error("Failed to import template", {
          description: "The template format is invalid or the import failed"
        });
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
      
      if (exportTemplate(id)) {
        toast.success("Template exported", {
          description: "The template has been exported to a JSON file"
        });
        return true;
      } else {
        toast.error("Failed to export template");
        return false;
      }
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
