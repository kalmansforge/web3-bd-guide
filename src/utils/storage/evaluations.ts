
import { ProjectEvaluation } from "@/types/metrics";
import { saveToStorage, getFromStorage, EVALUATIONS_KEY } from "./core";

/**
 * Save evaluations to local storage
 */
export const saveEvaluationsToStorage = (evaluations: ProjectEvaluation[]): boolean => {
  return saveToStorage(EVALUATIONS_KEY, evaluations);
};

/**
 * Get evaluations from local storage
 */
export const getEvaluationsFromStorage = (): ProjectEvaluation[] => {
  return getFromStorage<ProjectEvaluation[]>(EVALUATIONS_KEY, []);
};

/**
 * Export a single evaluation as a downloadable JSON file
 */
export const exportSingleEvaluation = (evaluationId: string): boolean => {
  try {
    const evaluations = getEvaluationsFromStorage();
    const evaluation = evaluations.find(e => e.id === evaluationId);
    
    if (!evaluation) {
      return false;
    }
    
    const exportData = {
      evaluations: [evaluation],
      exportDate: new Date().toISOString(),
      version: '1.0',
      type: 'single-evaluation'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileName = `${evaluation.name.replace(/\s+/g, '_').toLowerCase()}_evaluation_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    return true;
  } catch (error) {
    console.error('Error exporting single evaluation:', error);
    return false;
  }
};
