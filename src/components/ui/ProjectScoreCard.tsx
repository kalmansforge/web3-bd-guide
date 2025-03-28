import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TierType } from '@/types/metrics';
import { cn } from '@/lib/utils';
import { getTierDisplayName } from '@/utils/storage';

interface ProjectScoreCardProps {
  score: number;
  tier: TierType;
  completedMetrics: number;
  totalMetrics: number;
}

const ProjectScoreCard = ({ score, tier, completedMetrics, totalMetrics }: ProjectScoreCardProps) => {
  const roundedScore = Math.round(score);
  
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600 dark:text-green-400";
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 70) return "bg-green-600";
    if (score >= 40) return "bg-yellow-600";
    return "bg-red-600";
  };
  
  const getTierBadgeColor = (tier: TierType) => {
    switch (tier) {
      case 'T0':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'T1':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const completionPercentage = totalMetrics > 0 ? Math.round((completedMetrics / totalMetrics) * 100) : 0;
  const displayTierName = tier ? getTierDisplayName(tier) : '';
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Project Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-1 text-center">
          <div className="text-5xl font-bold tracking-tighter flex justify-center items-baseline gap-2">
            <span className={getScoreColor(roundedScore)}>{roundedScore}</span>
            <span className="text-lg text-muted-foreground font-normal">/100</span>
          </div>
          <div className="pt-2">
            <Progress value={roundedScore} className={cn("h-2", getProgressColor(roundedScore))} />
          </div>
          {tier && (
            <div className="pt-3">
              <Badge className={cn("mx-auto px-3 py-1", getTierBadgeColor(tier))}>
                Classification: {displayTierName}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Evaluation Progress</span>
            <span className="font-medium">{completedMetrics}/{totalMetrics} metrics</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <p className="text-xs text-right text-muted-foreground">{completionPercentage}% complete</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectScoreCard;
