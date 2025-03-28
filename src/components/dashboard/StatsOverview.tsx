
import React from "react";
import { BarChart2, HardDrive, Shield, Users } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { ProjectEvaluation } from "@/types/metrics";

interface StatsOverviewProps {
  projects: ProjectEvaluation[];
  onViewProjects: () => void;
  onViewMetrics: () => void;
}

const StatsOverview = ({ projects, onViewProjects, onViewMetrics }: StatsOverviewProps) => {
  const t0Projects = projects.filter(p => p.overallTier === 'T0').length;
  const t1Projects = projects.filter(p => p.overallTier === 'T1').length;

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <DashboardCard 
        title="Total Evaluations" 
        value={projects.length} 
        icon={HardDrive}
        description="Projects evaluated"
        onClick={onViewProjects}
      />
      <DashboardCard 
        title="Strategic (T0) Projects" 
        value={t0Projects} 
        icon={BarChart2}
        trend={projects.length ? { value: Math.round((t0Projects / projects.length) * 100), positive: true } : undefined}
        onClick={onViewProjects}
      />
      <DashboardCard 
        title="Secondary (T1) Projects" 
        value={t1Projects} 
        icon={Shield}
        trend={projects.length ? { value: Math.round((t1Projects / projects.length) * 100), positive: false } : undefined}
        onClick={onViewProjects}
      />
      <DashboardCard 
        title="Evaluation Categories" 
        value="6" 
        icon={Users}
        description="Framework dimensions"
        onClick={onViewMetrics}
      />
    </div>
  );
};

export default StatsOverview;
