
import React from "react";
import { NavLink } from "react-router-dom";
import { Gauge, BarChart2, BookOpen, Users, Shield, LineChart, Database, GitBranch, FileText } from "lucide-react";
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", icon: Gauge, path: "/" },
  { title: "Projects", icon: Database, path: "/projects" },
  { 
    title: "Evaluation", 
    icon: BarChart2, 
    path: "/evaluation",
    children: [
      { title: "New Evaluation", path: "/evaluation/new" },
      { title: "History", path: "/evaluation/history" },
    ]
  },
  { 
    title: "Metrics", 
    icon: LineChart, 
    path: "/metrics",
    children: [
      { title: "Foundational", path: "/metrics/foundational" },
      { title: "Product", path: "/metrics/product" },
      { title: "Financial", path: "/metrics/financial" },
      { title: "Strategic", path: "/metrics/strategic" },
      { title: "Ecosystem", path: "/metrics/ecosystem" },
      { title: "Risk", path: "/metrics/risk" },
    ]
  },
  { title: "Guide", icon: BookOpen, path: "/guide" },
  { title: "Teams", icon: Users, path: "/teams" },
  { title: "Risk Assessment", icon: Shield, path: "/risks" },
];

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="h-14 flex items-center px-6 justify-between">
        <div className="flex items-center space-x-2">
          <GitBranch className="h-5 w-5 text-primary" />
          <span className="font-semibold text-base">Web3 BD Guide</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                  {item.children && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <SidebarMenuButton key={child.path} asChild>
                          <NavLink
                            to={child.path}
                            className={({ isActive }) =>
                              cn(
                                "flex items-center gap-3 w-full rounded-md py-1.5 text-sm transition-colors",
                                isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                              )
                            }
                          >
                            <span>{child.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      ))}
                    </div>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
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
