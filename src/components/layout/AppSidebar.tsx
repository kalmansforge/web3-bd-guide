
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Gauge, 
  BarChart2, 
  BookOpen, 
  LineChart, 
  Database, 
  GitBranch, 
  FileText,
  Settings,
  Shield,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Simplified navigation data without nested children
const navItems = [
  { title: "Guide", icon: BookOpen, path: "/guide" },
  { 
    title: "Dashboard", 
    icon: Gauge, 
    path: "/dashboard",
  },
  { 
    title: "Projects", 
    icon: Database, 
    path: "/projects",
  },
  { 
    title: "New Evaluation", 
    icon: BarChart2, 
    path: "/new-evaluation",
  },
  { 
    title: "Metrics", 
    icon: LineChart, 
    path: "/metrics-guide",
  },
  { title: "Risk Assessment", icon: Shield, path: "/risk-assessment" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

const AppSidebar = () => {
  const { state, toggleSidebar } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 flex items-center px-6 justify-between">
        <div className="flex items-center space-x-2">
          <GitBranch className="h-5 w-5 text-primary" />
          <span className={cn("font-semibold text-base transition-opacity", 
            isExpanded ? "opacity-100" : "opacity-0"
          )}>
            Web3 BD Guide
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleSidebar}
          className="h-7 w-7"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={!isExpanded ? item.title : undefined}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 w-full rounded-md transition-colors",
                          isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                        )
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span className={cn(
                        "transition-opacity", 
                        isExpanded ? "opacity-100" : "opacity-0"
                      )}>
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className={cn("p-4", isExpanded ? "block" : "hidden")}>
        <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-accent">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">v1.0</span>
          </div>
          <span className="text-xs text-muted-foreground">BD Field Guide</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
