
import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader = ({ title, description, actions, className }: PageHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn("flex flex-col space-y-3 mb-6", className)}>
      <div className="space-y-1 animate-slide-in">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-sm sm:text-base text-muted-foreground">{description}</p>}
      </div>
      {actions && (
        <div className={cn(
          "flex animate-fade-in",
          isMobile ? "flex-col space-y-2" : "items-center space-x-2"
        )}>
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
