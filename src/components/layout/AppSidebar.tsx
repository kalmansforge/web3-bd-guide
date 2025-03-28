
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Gauge, 
  BarChart2, 
  LineChart, 
  Database, 
  GitBranch, 
  FileText,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  FileJson
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
import { useIsMobile } from "@/hooks/use-mobile";

// Simplified navigation data without nested children
const navItems = [
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
    title: "Metrics Guide", 
    icon: LineChart, 
    path: "/metrics-guide",
  },
  { 
    title: "Templates", 
    icon: FileJson, 
    path: "/templates",
  },
  { title: "Settings", icon: Settings, path: "/settings" },
];

const AppSidebar = () => {
  const { state, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const isExpanded = state === "expanded";

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "icon"}>
      <SidebarHeader className="h-14 flex items-center justify-between px-4">
        <div className={cn("flex items-center gap-2", isExpanded ? "ml-2" : "justify-center w-full")}>
          <GitBranch className="h-5 w-5 text-primary" />
          <span className={cn("font-semibold text-base transition-opacity", 
            isExpanded ? "opacity-100" : "opacity-0 hidden"
          )}>
            Web3 BD Guide
          </span>
        </div>
        {isExpanded && !isMobile && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            className="h-7 w-7"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </Button>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isExpanded ? "" : "sr-only"}>Main</SidebarGroupLabel>
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
                          isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground",
                          !isExpanded && "justify-center"
                        )
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {isExpanded && (
                        <span className="transition-opacity truncate">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {isExpanded ? (
        <SidebarFooter className="p-4">
          <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-accent">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">v1.0</span>
            </div>
            <span className="text-xs text-muted-foreground">BD Field Guide</span>
          </div>
        </SidebarFooter>
      ) : (
        <SidebarFooter className="p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="w-full flex justify-center"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </Button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default AppSidebar;
