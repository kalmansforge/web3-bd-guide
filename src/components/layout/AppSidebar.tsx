
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Gauge, 
  BarChart2, 
  BookOpen, 
  LineChart, 
  Database, 
  GitBranch, 
  FileText,
  Settings,
  Shield
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
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Structured navigation data
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
    title: "Evaluation", 
    icon: BarChart2, 
    path: "/new-evaluation",
  },
  { 
    title: "Metrics", 
    icon: LineChart, 
    path: "/metrics-guide",
    isCollapsible: true,
    children: [
      { title: "Foundational", path: "/metrics-guide", tabValue: "foundational" },
      { title: "Product", path: "/metrics-guide", tabValue: "product" },
      { title: "Financial", path: "/metrics-guide", tabValue: "financial" },
      { title: "Strategic", path: "/metrics-guide", tabValue: "strategic" },
      { title: "Ecosystem", path: "/metrics-guide", tabValue: "ecosystem" },
      { title: "Risk", path: "/metrics-guide", tabValue: "risk" },
    ]
  },
  { title: "Guide", icon: BookOpen, path: "/guide" },
  { title: "Risk Assessment", icon: Shield, path: "/risk-assessment" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

const AppSidebar = () => {
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isGroupOpen = (title: string) => !!openGroups[title];

  const handleMetricItemClick = (e: React.MouseEvent, path: string, tabValue?: string) => {
    e.preventDefault();
    navigate(path, { state: { activeTab: tabValue } });
  };

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
                            <SidebarMenuSubItem key={child.title}>
                              <SidebarMenuSubButton 
                                onClick={(e) => handleMetricItemClick(e, child.path, child.tabValue)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                {child.title}
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
