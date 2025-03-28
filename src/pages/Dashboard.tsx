
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { useEvaluation } from "@/contexts/EvaluationContext";
import { calculateStorageSize } from "@/utils/storage";
import StatsOverview from "@/components/dashboard/StatsOverview";
import StorageUsageCard from "@/components/dashboard/StorageUsageCard";
import RecentEvaluations from "@/components/dashboard/RecentEvaluations";

const Dashboard = () => {
  const { projects } = useEvaluation();
  const navigate = useNavigate();
  const [storageInfo, setStorageInfo] = useState(calculateStorageSize());
  
  useEffect(() => {
    setStorageInfo(calculateStorageSize());
  }, []);
  
  const handleNewEvaluation = () => {
    navigate('/new-evaluation');
  };
  
  const handleViewProjects = () => {
    navigate('/projects');
  };
  
  const handleViewMetrics = () => {
    navigate('/metrics-guide');
  };

  const handleViewStorage = () => {
    navigate('/settings?tab=data-management');
  };

  return (
    <AppLayout>
      <PageHeader
        title="Web3 BD Field Guide"
        description="Interactive evaluation framework for blockchain projects"
        actions={
          <Button onClick={handleNewEvaluation}>
            <Plus className="mr-2 h-4 w-4" />
            New Evaluation
          </Button>
        }
      />
      
      <StatsOverview 
        projects={projects} 
        onViewProjects={handleViewProjects} 
        onViewMetrics={handleViewMetrics} 
      />
      
      <StorageUsageCard 
        storageInfo={storageInfo} 
        onManageStorage={handleViewStorage} 
      />
      
      <RecentEvaluations 
        projects={projects} 
        onNewEvaluation={handleNewEvaluation} 
      />
    </AppLayout>
  );
};

export default Dashboard;
