
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  return (
    <Card className="mb-6">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">Jump to Category</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCategory} onValueChange={onCategoryChange}>
          <TabsList className="w-full flex overflow-x-auto no-scrollbar">
            {categories.map((category, index) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className={activeCategory === category.id ? "text-primary font-medium" : ""}
              >
                {index + 1}. {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CategoryNavigation;
