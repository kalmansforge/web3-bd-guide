
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Save } from "lucide-react";
import { MetricCategory } from "@/types/metrics";

interface CategoryNavigationCardProps {
  metricsData: MetricCategory[];
  activeCategory: string;
  setActiveCategory: (categoryId: string) => void;
  projectMetrics: Record<string, any>;
  handleSaveProject: () => void;
}

const CategoryNavigationCard: React.FC<CategoryNavigationCardProps> = ({
  metricsData,
  activeCategory, 
  setActiveCategory,
  projectMetrics,
  handleSaveProject
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Navigation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {metricsData.map((category, index) => {
          const categoryMetrics = category.metrics.length;
          const completedCategoryMetrics = Object.keys(projectMetrics)
            .filter(key => key.startsWith(`${category.id}_`))
            .length;
          
          const percentComplete = Math.round((completedCategoryMetrics / categoryMetrics) * 100);
          
          return (
            <div key={category.id} className="flex items-center justify-between py-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveCategory(category.id)}
                className={activeCategory === category.id ? "text-primary font-medium" : ""}
              >
                {index + 1}. {category.name}
              </Button>
              <span className="text-xs text-muted-foreground">
                {percentComplete}%
              </span>
            </div>
          );
        })}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveProject} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Evaluation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CategoryNavigationCard;
