
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart2, Shield, Database, Users, LineChart, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";

const GuideSection = ({ title, description, icon: Icon, link, linkText }: { 
  title: string; 
  description: string;
  icon: React.ElementType;
  link: string;
  linkText: string;
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Learn how to evaluate {title.toLowerCase()} aspects of Web3 projects.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => navigate(link)}>
          {linkText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const Guide = () => {
  const navigate = useNavigate();
  
  return (
    <AppLayout>
      <PageHeader
        title="Web3 BD Field Guide"
        description="Comprehensive guide for evaluating blockchain projects"
        actions={
          <Button onClick={() => navigate("/evaluation/new")}>Start New Evaluation</Button>
        }
      />
      
      <div className="prose prose-blue dark:prose-invert max-w-none mb-8 animate-fade-in">
        <h2>Introduction</h2>
        <p>
          This guide provides a structured, data-driven approach to evaluating blockchain/Web3 projects, 
          enabling BD teams to make informed decisions based on clear metrics and objective criteria.
        </p>
        
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 my-6">
          <div className="flex-1 bg-muted/30 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">T0/T1 Classification</h3>
            <p className="text-sm text-muted-foreground">
              <strong>T0 (Strategic Tier):</strong> Projects meeting high-threshold benchmarks, indicating strategic importance.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>T1 (Secondary Tier):</strong> Projects meeting lower-threshold benchmarks, with moderate potential.
            </p>
          </div>
          
          <div className="flex-1 bg-muted/30 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">How To Use</h3>
            <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
              <li>Start with foundational metrics assessment</li>
              <li>Evaluate product, financial, and ecosystem metrics</li>
              <li>Assess strategic alignment and risks</li>
              <li>Calculate final score and tier classification</li>
            </ol>
          </div>
        </div>
      </div>
      
      <Separator className="my-8" />
      
      <h2 className="text-2xl font-semibold tracking-tight mb-4">Metric Categories</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <GuideSection 
          title="Foundational Metrics" 
          description="Baseline indicators of project strength" 
          icon={Database}
          link="/metrics/foundational"
          linkText="View Foundational Metrics"
        />
        <GuideSection 
          title="Product Metrics" 
          description="Measures of product quality and adoption" 
          icon={BarChart2}
          link="/metrics/product"
          linkText="View Product Metrics"
        />
        <GuideSection 
          title="Financial Metrics" 
          description="Economic sustainability indicators" 
          icon={LineChart}
          link="/metrics/financial"
          linkText="View Financial Metrics"
        />
        <GuideSection 
          title="Strategic Alignment" 
          description="Positioning within industry verticals" 
          icon={ArrowRight}
          link="/metrics/strategic"
          linkText="View Strategic Metrics"
        />
        <GuideSection 
          title="Ecosystem & Community" 
          description="Health of project community" 
          icon={Users}
          link="/metrics/ecosystem"
          linkText="View Ecosystem Metrics"
        />
        <GuideSection 
          title="Risk Metrics" 
          description="Potential issues and red flags" 
          icon={Shield}
          link="/metrics/risk"
          linkText="View Risk Metrics"
        />
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
          <CardDescription>Begin evaluating blockchain projects with our structured approach</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Ready to evaluate a project? Start a new evaluation and work through each metric category systematically.
            Share your evaluations with team members to collaborate on project assessments.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button className="w-full sm:w-auto" onClick={() => navigate("/evaluation/new")}>
            New Evaluation
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/teams")}>
            <Users className="mr-2 h-4 w-4" />
            Manage Teams
          </Button>
        </CardFooter>
      </Card>
    </AppLayout>
  );
};

export default Guide;
