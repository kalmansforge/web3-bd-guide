
import React from "react";
import { SidebarProvider } from "../ui/sidebar";
import AppSidebar from "./AppSidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AppLayout = ({ children, className }: AppLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full overflow-hidden">
        <AppSidebar />
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out overflow-y-auto max-h-screen", 
          className
        )}>
          <div className="container mx-auto py-4 md:py-6 px-2 sm:px-4 md:px-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
