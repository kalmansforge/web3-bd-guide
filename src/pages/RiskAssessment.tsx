import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { getTierDisplayName } from "@/utils/storage";

const RiskAssessment = () => {
  const navigate = useNavigate();
  
  return (
    <AppLayout>
      <PageHeader
        title="Risk Assessment"
        description="Evaluate project risks and vulnerabilities"
      />
      
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Under Construction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page is currently under construction. Please check back later.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default RiskAssessment;
