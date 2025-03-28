
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  BarChart2, 
  Shield, 
  Database, 
  Users, 
  LineChart, 
  BookOpen, 
  ArrowRightCircle,
  ExternalLink 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { metricsData } from "@/data/metricsData";

// MetricsDialog component to display metrics information
const MetricsDialog = ({ category, isOpen, setIsOpen }) => {
  const metrics = metricsData.find(c => c.id === category)?.metrics || [];
  
  if (metrics.length === 0) {
    return null;
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {metricsData.find(c => c.id === category)?.name || "Metrics"}
          </DialogTitle>
          <DialogDescription>
            {metricsData.find(c => c.id === category)?.description || ""}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">{metric.name}</h3>
              <p className="text-muted-foreground mb-4">{metric.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Importance</h4>
                  <p className="text-sm">{metric.importance}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Threshold Classifications</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1 border p-3 rounded-md">
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 mr-2">
                          T0
                        </Badge>
                        <span className="text-sm font-medium">Strategic Tier</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{metric.thresholds.T0}</p>
                    </div>
                    
                    <div className="space-y-1 border p-3 rounded-md">
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 mr-2">
                          T1
                        </Badge>
                        <span className="text-sm font-medium">Secondary Tier</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{metric.thresholds.T1}</p>
                    </div>
                  </div>
                </div>
                
                {metric.tools && metric.tools.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Recommended Tools</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {metric.tools.map((tool) => (
                        <div key={tool} className="flex items-center">
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                          <span className="text-sm">{tool}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">Close</Button>
          <Button onClick={() => window.location.href = "/metrics-guide"} className="gap-2">
            Go to Full Metrics Guide
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const GuideSection = ({ title, description, icon: Icon, link, linkText }: { 
  title: string; 
  description: string;
  icon: React.ElementType;
  link: string;
  linkText: string;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
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
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => setIsDialogOpen(true)}
        >
          {linkText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
      
      <MetricsDialog 
        category={link.split('/').pop() || ""} 
        isOpen={isDialogOpen} 
        setIsOpen={setIsDialogOpen} 
      />
    </Card>
  );
};

const Guide = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      {/* Hero Section with Enter App Button */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl">Web3 BD Guide</span>
          </div>
          <Button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
            size="lg"
          >
            Enter App
            <ArrowRightCircle className="h-4 w-4" />
          </Button>
        </div>
      </header>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Web3 Business Development Field Guide
              </h1>
              <p className="text-xl text-muted-foreground mb-10">
                A comprehensive, data-driven approach to evaluating blockchain projects
                with clear metrics and objective criteria.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  onClick={() => navigate("/new-evaluation")} 
                  size="lg"
                  className="gap-2"
                >
                  Start Evaluating
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/metrics-guide")}
                  size="lg"
                  className="gap-2"
                >
                  Explore Metrics
                  <BarChart2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Gather Data</h3>
                <p className="text-muted-foreground">
                  Collect key metrics across multiple categories from the project.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Score Metrics</h3>
                <p className="text-muted-foreground">
                  Evaluate each metric against objective thresholds and criteria.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Get Results</h3>
                <p className="text-muted-foreground">
                  Receive T0/T1 classification and detailed insights for decision-making.
                </p>
              </div>
            </div>
          </div>
        </section>
          
        {/* Feature Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4">Comprehensive Evaluation Framework</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Our evaluation framework examines projects across multiple dimensions to provide a complete picture.
            </p>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <GuideSection 
                title="Foundational Metrics" 
                description="Baseline indicators of project strength" 
                icon={Database}
                link="foundational"
                linkText="View Foundational Metrics"
              />
              <GuideSection 
                title="Product Metrics" 
                description="Measures of product quality and adoption" 
                icon={BarChart2}
                link="product"
                linkText="View Product Metrics"
              />
              <GuideSection 
                title="Financial Metrics" 
                description="Economic sustainability indicators" 
                icon={LineChart}
                link="financial"
                linkText="View Financial Metrics"
              />
              <GuideSection 
                title="Strategic Alignment" 
                description="Positioning within industry verticals" 
                icon={ArrowRight}
                link="strategic"
                linkText="View Strategic Metrics"
              />
              <GuideSection 
                title="Ecosystem & Community" 
                description="Health of project community" 
                icon={Users}
                link="ecosystem"
                linkText="View Ecosystem Metrics"
              />
              <GuideSection 
                title="Risk Metrics" 
                description="Potential issues and red flags" 
                icon={Shield}
                link="risk"
                linkText="View Risk Metrics"
              />
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Evaluate Projects?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Start using our structured evaluation framework today to make data-driven decisions about Web3 projects.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={() => navigate("/new-evaluation")} 
                size="lg"
                className="gap-2"
              >
                Start New Evaluation
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/projects")}
                size="lg"
              >
                View Projects
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Web3 BD Field Guide v1.0 — A comprehensive evaluation framework for blockchain projects</p>
        </div>
      </footer>
    </div>
  );
};

export default Guide;
