
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metric } from "@/types/metrics";
import MetricItem from "./MetricItem";

interface MetricsListProps {
  metrics: Metric[];
  searchQuery: string;
  getTierValue: (metricId: string, tier: string) => string;
  tierNames: Array<{ internalName: string; displayName: string }>;
}

const MetricsList: React.FC<MetricsListProps> = ({ 
  metrics, 
  searchQuery, 
  getTierValue,
  tierNames
}) => {
  if (metrics.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>No metrics found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No metrics match your search query: "{searchQuery}"
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in mb-6">
      {metrics.map(metric => (
        <MetricItem 
          key={metric.id}
          id={metric.id}
          name={metric.name}
          description={metric.description}
          importance={metric.importance}
          tools={metric.tools}
          getTierValue={getTierValue}
          tierNames={tierNames}
        />
      ))}
    </div>
  );
};

export default MetricsList;
