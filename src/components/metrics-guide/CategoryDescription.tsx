
import React from "react";

interface CategoryDescriptionProps {
  name: string;
  description: string;
}

const CategoryDescription: React.FC<CategoryDescriptionProps> = ({ name, description }) => {
  return (
    <div className="space-y-3 mb-6 animate-slide-in">
      <h2 className="text-2xl font-semibold tracking-tight">{name}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default CategoryDescription;
