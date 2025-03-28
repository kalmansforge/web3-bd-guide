
import React from "react";
import { Menu, GitBranch } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface MobileHeaderProps {
  className?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ className }) => {
  const { toggleSidebar, openMobile } = useSidebar();
  const location = useLocation();
  
  // Get the current page title based on the route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/projects")) return "Projects";
    if (path.includes("/new-evaluation")) return "New Evaluation";
    if (path.includes("/metrics-guide")) return "Metrics Guide";
    if (path.includes("/templates")) return "Templates";
    if (path.includes("/settings")) return "Settings";
    return "Web3 BD Guide";
  };
  
  return (
    <div 
      className={cn(
        "h-14 md:hidden flex items-center justify-between px-4 border-b bg-background sticky top-0 z-10",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          <span className="font-semibold text-base">{getPageTitle()}</span>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
