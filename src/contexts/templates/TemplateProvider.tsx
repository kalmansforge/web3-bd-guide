
import React, { createContext, useEffect, useState } from "react";
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Load templates on component mount
  useEffect(() => {
    const initialize = async () => {
      await templateOperations.refreshData();
      setIsInitialized(true);
    };
    
    initialize();
  }, []);

  // Show loading state while initializing
  if (!isInitialized || !templateOperations.activeTemplate) {
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
