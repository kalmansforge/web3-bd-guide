
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart2, Shield, Database, Users, LineChart } from "lucide-react";
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
          This section provides comprehensive guidance on evaluating {title.toLowerCase()} aspects of Web3 projects for business development professionals.
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
          enabling BD teams to make informed, strategic decisions based on clear metrics and objective criteria.
        </p>
        
        <h3>Why Metrics Matter in Web3 Business Development</h3>
        <p>
          Metrics offer clarity in an inherently complex and dynamic environment. By leveraging objective and 
          quantifiable benchmarks, BD professionals can assess project strengths, potential risks, and strategic 
          alignment efficiently. This structured approach reduces uncertainty, enhances decision-making, and 
          fosters meaningful partnerships.
        </p>
        
        <h3>T0/T1 Classification</h3>
        <p>
          Projects are classified into two tiers:
        </p>
        <ul>
          <li><strong>T0 (Strategic Tier):</strong> Projects meeting or exceeding high-threshold benchmarks, indicating strategic importance and significant potential.</li>
          <li><strong>T1 (Secondary Tier):</strong> Projects meeting lower-threshold benchmarks, with moderate potential or requiring further development.</li>
        </ul>
      </div>
      
      <Separator className="my-8" />
      
      <h2 className="text-2xl font-semibold tracking-tight mb-4">Metric Categories</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <GuideSection 
          title="Foundational Metrics" 
          description="Baseline indicators of a project's strength and viability" 
          icon={Database}
          link="/metrics/foundational"
          linkText="View Foundational Metrics"
        />
        <GuideSection 
          title="Product Metrics" 
          description="Measures of product strength and market acceptance" 
          icon={BarChart2}
          link="/metrics/product"
          linkText="View Product Metrics"
        />
        <GuideSection 
          title="Financial Metrics" 
          description="Evaluation of economic sustainability and token design" 
          icon={LineChart}
          link="/metrics/financial"
          linkText="View Financial Metrics"
        />
        <GuideSection 
          title="Strategic Alignment" 
          description="Assessment of positioning within industry verticals" 
          icon={ArrowRight}
          link="/metrics/strategic"
          linkText="View Strategic Metrics"
        />
        <GuideSection 
          title="Ecosystem & Community" 
          description="Health and engagement of project community" 
          icon={Users}
          link="/metrics/ecosystem"
          linkText="View Ecosystem Metrics"
        />
        <GuideSection 
          title="Risk Metrics" 
          description="Indicators of potential issues and red flags" 
          icon={Shield}
          link="/metrics/risk"
          linkText="View Risk Metrics"
        />
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How to Use This Guide Effectively</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">1. Project Assessment Workflow</h3>
            <p className="text-muted-foreground">Follow these steps for thorough project evaluation:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="text-muted-foreground">Initial screening based on foundational metrics</li>
              <li className="text-muted-foreground">Deep-dive into product, financial, strategic alignment, and ecosystem metrics</li>
              <li className="text-muted-foreground">Risk assessment through clearly defined risk metrics</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">2. Tier Classification</h3>
            <p className="text-muted-foreground">
              Use the T0/T1 thresholds to classify projects and prioritize strategic partnerships accordingly.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">3. Regular Reassessment</h3>
            <p className="text-muted-foreground">
              The Web3 landscape evolves rapidly. Schedule regular reassessments of evaluated projects to track progress.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => navigate("/evaluation/new")}>
            Start a New Project Evaluation
          </Button>
        </CardFooter>
      </Card>
    </AppLayout>
  );
};

export default Guide;
