
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
    <div className={cn(
      "flex flex-col space-y-3 mb-4 sm:mb-6",
      className
    )}>
      <div className="space-y-1 animate-slide-in">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight break-words">{title}</h1>
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground max-w-full break-words">{description}</p>
        )}
      </div>
      {actions && (
        <div className={cn(
          "flex flex-wrap animate-fade-in gap-2",
          isMobile ? "flex-col space-y-2" : "items-center"
        )}>
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
