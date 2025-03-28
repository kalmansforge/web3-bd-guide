
import { useContext } from "react";
import { TemplateContext } from "./TemplateProvider";
import { TemplateContextType } from "./types";

export const useTemplates = (): TemplateContextType => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error("useTemplates must be used within a TemplateProvider");
  }
  return context;
};
