
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCategory } from "@/types/metrics";

interface MetricsCategoryTabsProps {
  categories: MetricCategory[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

const MetricsCategoryTabs: React.FC<MetricsCategoryTabsProps> = ({ 
  categories, 
  activeTab, 
  onTabChange 
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="w-full flex overflow-x-auto no-scrollbar mb-6">
        {categories.map(category => (
          <TabsTrigger key={category.id} value={category.id} className="flex-shrink-0">
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default MetricsCategoryTabs;
