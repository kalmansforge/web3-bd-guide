
import React, { createContext, useEffect } from "react";
import { TemplateContextType } from "./types";
import { useTemplateOperations } from "./useTemplateOperations";
import { EvaluationTemplate } from "@/types/templates";

// Create the context with a default undefined value
export const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export interface TemplateProviderProps {
  children: React.ReactNode;
}

export const TemplateProvider: React.FC<TemplateProviderProps> = ({ children }) => {
  const templateOperations = useTemplateOperations();

  // Load templates on component mount
  useEffect(() => {
    templateOperations.refreshData();
  }, []);

  // Only provide context if activeTemplate exists
  if (!templateOperations.activeTemplate) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading templates...</p>
      </div>
    );
  }

  return (
    <TemplateContext.Provider value={templateOperations}>
      {children}
    </TemplateContext.Provider>
  );
};
