
import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader = ({ title, description, actions, className }: PageHeaderProps) => {
  return (
    <div className={cn("flex flex-col space-y-3 md:flex-row md:items-center md:justify-between mb-6", className)}>
      <div className="space-y-1 animate-slide-in">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-sm sm:text-base text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center space-x-2 animate-fade-in">{actions}</div>}
    </div>
  );
};

export default PageHeader;
