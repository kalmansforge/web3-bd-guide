
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Gauge, 
  BarChart2, 
  BookOpen, 
  Users, 
  Shield, 
  LineChart, 
  Database, 
  GitBranch, 
  FileText,
  LogOut, 
  User,
  Settings
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
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Structured navigation data
const navItems = [
  { 
    title: "Dashboard", 
    icon: Gauge, 
    path: "/",
  },
  { 
    title: "Projects", 
    icon: Database, 
    path: "/projects",
  },
  { 
    title: "Evaluation", 
    icon: BarChart2, 
    path: "/evaluation",
    isCollapsible: true,
    children: [
      { title: "New Evaluation", path: "/evaluation/new" },
      { title: "History", path: "/evaluation/history" },
    ]
  },
  { 
    title: "Metrics", 
    icon: LineChart, 
    path: "/metrics",
    isCollapsible: true,
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
  { title: "Settings", icon: Settings, path: "/settings" },
];

const AppSidebar = () => {
  const { user, signOut } = useAuth();
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isGroupOpen = (title: string) => !!openGroups[title];

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
                  {item.isCollapsible ? (
                    <>
                      <div 
                        className="flex items-center gap-3 w-full rounded-md p-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                        onClick={() => toggleGroup(item.title)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                        <span className="ml-auto">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isGroupOpen(item.title) ? "transform rotate-180" : ""
                            )}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </span>
                      </div>
                      
                      {isGroupOpen(item.title) && item.children && (
                        <SidebarMenuSub>
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.path}>
                              <SidebarMenuSubButton asChild>
                                <NavLink
                                  to={child.path}
                                  className={({ isActive }) =>
                                    cn("text-muted-foreground", isActive && "text-primary font-medium")
                                  }
                                >
                                  {child.title}
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </>
                  ) : (
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
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {user && (
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="flex items-center gap-3">
                    <User className="h-5 w-5" />
                    <span className="truncate">{user.email}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={signOut} className="text-red-500 hover:text-red-600 flex items-center gap-3">
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
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
