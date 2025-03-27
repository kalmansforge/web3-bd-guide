
import React from "react";
import { SidebarProvider } from "../ui/sidebar";
import AppSidebar from "./AppSidebar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AppLayout = ({ children, className }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className={cn("flex-1 transition-all duration-300 ease-in-out", className)}>
          <div className="container py-6 md:py-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
