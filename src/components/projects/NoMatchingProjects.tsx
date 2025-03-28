
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const NoMatchingProjects = () => {
  return (
    <Card>
      <CardContent className="pt-6 pb-6">
        <div className="text-center p-4">
          <h3 className="text-lg font-medium mb-2">No matching projects found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoMatchingProjects;
