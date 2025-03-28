
import React from "react";
import { Badge } from "@/components/ui/badge";

interface MetricToolsProps {
  tools: string[];
}

const MetricTools: React.FC<MetricToolsProps> = ({ tools }) => {
  if (!tools || tools.length === 0) return null;
  
  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium">Suggested Tools:</p>
      <div className="flex flex-wrap gap-1">
        {tools.slice(0, 3).map((tool, i) => (
          <Badge key={i} variant="outline" className="bg-slate-50 dark:bg-slate-900">
            {tool}
          </Badge>
        ))}
        {tools.length > 3 && (
          <Badge variant="outline" className="bg-slate-50 dark:bg-slate-900">
            +{tools.length - 3} more
          </Badge>
        )}
      </div>
    </div>
  );
};

export default MetricTools;
