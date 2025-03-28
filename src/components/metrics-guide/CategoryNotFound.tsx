
import React from "react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";

interface CategoryNotFoundProps {
  onNavigateHome: () => void;
}

const CategoryNotFound: React.FC<CategoryNotFoundProps> = ({ onNavigateHome }) => {
  return (
    <AppLayout>
      <div className="py-10 text-center">
        <h2 className="text-2xl font-bold">Category not found</h2>
        <p className="mt-2 text-muted-foreground">The requested category does not exist.</p>
        <Button onClick={onNavigateHome} className="mt-4">
          Return to Dashboard
        </Button>
      </div>
    </AppLayout>
  );
};

export default CategoryNotFound;
