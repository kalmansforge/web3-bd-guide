
import { ProjectEvaluation, MetricEvaluation, TierType } from "@/types/metrics";
import { MetricCategory } from "@/types/metrics";
import { getAllTierNames } from "@/utils/storage";

/**
 * Calculates the weighted score for a metric based on its tier and optional weighting factors
 */
export const getMetricScore = (
  tier: TierType, 
  metricWeight: number = 1,
  tierWeights: Record<string, number> = {}
): number => {
  if (!tier) return 0;
  
  // Get all configured tiers and their weights
  const tierNames = getAllTierNames();
  
  // Find the tier in the configuration
  const tierConfig = tierNames.find(t => t.internalName === tier);
  
  // If we have a custom weight for this tier, use it
  if (tierWeights[tier]) {
    return tierWeights[tier] * metricWeight;
  }
  
  // Otherwise, use a position-based weight (higher tier = higher weight)
  // First tier (usually T0) has highest weight
  if (tierConfig) {
    const tierIndex = tierNames.findIndex(t => t.internalName === tier);
    const totalTiers = tierNames.length;
    
    if (totalTiers > 0 && tierIndex >= 0) {
      // Create a scale where the first tier (index 0) has maximum score
      // and the last tier has minimum score
      const tierWeight = (totalTiers - tierIndex) / totalTiers * 100;
      return tierWeight * metricWeight;
    }
  }
  
  // Fallback to legacy calculation if tier configuration is not found
  switch(tier) {
    case "T0": return 100 * metricWeight;
    case "T1": return 50 * metricWeight;
    default: return 0;
  }
};

/**
 * Calculates project score and tier based on all evaluated metrics
 */
export const calculateProjectScore = (
  project: ProjectEvaluation | null, 
  metricsData?: MetricCategory[]
): { score: number; tier: TierType; completedMetrics: number } => {
  if (!project) return { score: 0, tier: null, completedMetrics: 0 };
  
  const metrics = Object.entries(project.metrics || {});
  if (metrics.length === 0) return { score: 0, tier: null, completedMetrics: 0 };
  
  let totalScore = 0;
  let totalWeight = 0;
  const completedMetrics = metrics.length;
  
  // Get all configured tiers
  const tierNames = getAllTierNames();
  const tierThresholds: Record<string, number> = {};
  
  // Determine tier thresholds - by default, use dynamic thresholds based on number of tiers
  if (tierNames.length > 0) {
    const scoreRange = 100 / tierNames.length;
    tierNames.forEach((tier, index) => {
      // Higher tiers have higher thresholds
      tierThresholds[tier.internalName] = (tierNames.length - index) * scoreRange;
    });
  } else {
    // Legacy fallback thresholds
    tierThresholds["T0"] = 70;
    tierThresholds["T1"] = 40;
  }
  
  // Calculate weighted score for each metric
  metrics.forEach(([key, evaluation]) => {
    if (metricsData) {
      // If we have metricsData, we can use it to apply importance weighting
      const [categoryId, metricId] = key.split('_');
      const category = metricsData.find(c => c.id === categoryId);
      const metric = category?.metrics.find(m => m.id === metricId);
      
      // Apply a weight modifier based on importance
      let importanceWeight = 1;
      if (metric?.importance) {
        // Parse importance level - this could be extended with numeric values
        if (metric.importance.toLowerCase().includes('high')) {
          importanceWeight = 1.5;
        } else if (metric.importance.toLowerCase().includes('low')) {
          importanceWeight = 0.75;
        }
      }
      
      totalScore += getMetricScore(evaluation.tier, importanceWeight);
      totalWeight += importanceWeight;
    } else {
      // Simple scoring without importance weighting
      totalScore += getMetricScore(evaluation.tier);
      totalWeight++;
    }
  });
  
  // Calculate final score (0-100 scale)
  const score = totalWeight > 0 ? totalScore / totalWeight : 0;
  
  // Determine tier based on score thresholds
  let tier: TierType = null;
  
  // Sort tier names by threshold (descending)
  const sortedTiers = Object.entries(tierThresholds)
    .sort((a, b) => b[1] - a[1]);
  
  // Find the highest tier threshold that the score meets or exceeds
  for (const [tierName, threshold] of sortedTiers) {
    if (score >= threshold) {
      tier = tierName;
      break;
    }
  }
  
  return { 
    score, 
    tier, 
    completedMetrics 
  };
};

/**
 * Get completion data for a project
 */
export const getProjectCompletionData = (
  project: ProjectEvaluation | null,
  metricsData: MetricCategory[]
): { completedMetrics: number, totalMetrics: number } => {
  if (!project) return { completedMetrics: 0, totalMetrics: 0 };
  
  const totalMetrics = metricsData.reduce((acc, category) => 
    acc + category.metrics.length, 0);
    
  const completedMetrics = Object.keys(project?.metrics || {}).length;
  
  return { completedMetrics, totalMetrics };
};
