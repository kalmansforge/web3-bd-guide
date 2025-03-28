
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

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
      <CardContent>
        <Select value={activeCategory} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category, index) => (
              <SelectItem key={category.id} value={category.id}>
                {isMobile ? (index + 1) : `${index + 1}. ${category.name}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default CategoryNavigation;
