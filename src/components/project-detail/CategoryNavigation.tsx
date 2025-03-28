
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface CategoryNavigationProps {
  categories: Array<{id: string, name: string}>;
  activeCategory: string;
  onCategoryChange: (value: string) => void;
}

const CategoryNavigation = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: CategoryNavigationProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">Jump to Category</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Tabs value={activeCategory} onValueChange={onCategoryChange}>
          <TabsList className="w-full flex overflow-x-auto no-scrollbar pb-1">
            {categories.map((category, index) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className={cn(
                  "flex-shrink-0 whitespace-nowrap",
                  activeCategory === category.id ? "text-primary font-medium" : "",
                  isMobile ? "text-xs" : ""
                )}
              >
                {isMobile ? (index + 1) : `${index + 1}. ${category.name}`}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CategoryNavigation;
