
import React, { useState } from "react";
import { AlertTriangle, Shield, ExternalLink, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { metricsData } from "@/data/metricsData";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

const RiskAssessment = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Find risk metrics from metricsData
  const riskCategory = metricsData.find(c => c.id === "risk");
  const allRiskMetrics = riskCategory?.metrics || [];
  
  // Add some sample pre-analyzed projects with risk metrics
  const sampleProjects = [
    {
      id: "1",
      name: "PolygonZK",
      date: "2023-05-15",
      risks: [
        { metricId: "regulatory-risks", status: "high", notes: "Operating in jurisdictions with unclear regulatory frameworks" },
        { metricId: "token-liquidity", status: "medium", notes: "2% of circulating supply in daily trading volume" },
        { metricId: "runway-burn", status: "low", notes: "36+ months runway based on current treasury" }
      ]
    },
    {
      id: "2",
      name: "EcoChain",
      date: "2023-07-10",
      risks: [
        { metricId: "regulatory-risks", status: "low", notes: "Well-established legal entity in Singapore" },
        { metricId: "token-liquidity", status: "high", notes: "Less than 0.5% of supply trading daily" },
        { metricId: "runway-burn", status: "medium", notes: "14 months runway at current burn rate" }
      ]
    },
    {
      id: "3",
      name: "DataDAO",
      date: "2023-09-22",
      risks: [
        { metricId: "regulatory-risks", status: "medium", notes: "Potential data privacy concerns in EU markets" },
        { metricId: "token-liquidity", status: "low", notes: "6% of supply trading daily across multiple venues" },
        { metricId: "runway-burn", status: "medium", notes: "18 months runway, but accelerating development costs" }
      ]
    }
  ];
  
  // Filter metrics based on search and category
  const filteredMetrics = allRiskMetrics.filter(metric => 
    metric.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    metric.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get risk status color
  const getRiskStatusColor = (status: string) => {
    switch (status) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  // Get risk metric by ID
  const getRiskMetricById = (id: string) => {
    return allRiskMetrics.find(m => m.id === id);
  };
  
  // Filter projects based on selected category
  const filteredProjects = selectedCategory === "all" 
    ? sampleProjects 
    : sampleProjects.filter(project => 
        project.risks.some(risk => risk.status === selectedCategory)
      );

  return (
    <AppLayout>
      <PageHeader
        title="Risk Assessment"
        description="Analyze and manage potential risks associated with blockchain projects"
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        }
      />
      
      <Tabs defaultValue="dashboard" className="mb-8">
        <TabsList>
          <TabsTrigger value="dashboard">Risk Dashboard</TabsTrigger>
          <TabsTrigger value="framework">Risk Framework</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6 animate-slide-in">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="pl-9">
                  <SelectValue placeholder="Filter by risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="bg-red-50 dark:bg-red-900/20">
                <CardTitle className="flex items-center text-red-700 dark:text-red-400">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  High Risk Projects
                </CardTitle>
                <CardDescription>Projects with significant risk factors</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">
                  {sampleProjects.filter(p => p.risks.some(r => r.status === "high")).length}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Projects with at least one high-risk factor
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-yellow-50 dark:bg-yellow-900/20">
                <CardTitle className="flex items-center text-yellow-700 dark:text-yellow-400">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Medium Risk Projects
                </CardTitle>
                <CardDescription>Projects with moderate risk exposure</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">
                  {sampleProjects.filter(p => 
                    !p.risks.some(r => r.status === "high") && 
                    p.risks.some(r => r.status === "medium")
                  ).length}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Projects with medium risk factors but no high risks
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-green-50 dark:bg-green-900/20">
                <CardTitle className="flex items-center text-green-700 dark:text-green-400">
                  <Shield className="mr-2 h-5 w-5" />
                  Low Risk Projects
                </CardTitle>
                <CardDescription>Projects with minimal risk exposure</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">
                  {sampleProjects.filter(p => 
                    p.risks.every(r => r.status === "low")
                  ).length}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Projects with all risk factors rated low
                </p>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Project Risk Analysis</h2>
          
          {filteredProjects.length > 0 ? (
            <div className="space-y-4">
              {filteredProjects.map(project => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{project.name}</CardTitle>
                        <CardDescription>Last assessed: {project.date}</CardDescription>
                      </div>
                      <Badge className={getRiskStatusColor(
                        project.risks.sort((a, b) => {
                          const riskOrder = { high: 0, medium: 1, low: 2 };
                          return riskOrder[a.status as keyof typeof riskOrder] - 
                                 riskOrder[b.status as keyof typeof riskOrder];
                        })[0].status
                      )}>
                        {project.risks.sort((a, b) => {
                          const riskOrder = { high: 0, medium: 1, low: 2 };
                          return riskOrder[a.status as keyof typeof riskOrder] - 
                                 riskOrder[b.status as keyof typeof riskOrder];
                        })[0].status.toUpperCase()} RISK
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {project.risks.map((risk, index) => {
                        const riskMetric = getRiskMetricById(risk.metricId);
                        return (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center">
                                <Badge className={`mr-2 ${getRiskStatusColor(risk.status)}`}>
                                  {risk.status.toUpperCase()}
                                </Badge>
                                {riskMetric?.name || risk.metricId}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 pt-2">
                                <p className="text-sm font-medium">Analysis:</p>
                                <p className="text-sm text-muted-foreground">{risk.notes}</p>
                                
                                {riskMetric && (
                                  <div className="pt-2">
                                    <p className="text-sm font-medium">Reference Framework:</p>
                                    <p className="text-sm text-muted-foreground">{riskMetric.description}</p>
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No projects match your filter</CardTitle>
                <CardDescription>Try changing your filter criteria</CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="framework" className="space-y-6 animate-slide-in">
          <div className="mb-6">
            <div className="relative">
              <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search risk metrics..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            {filteredMetrics.length > 0 ? (
              filteredMetrics.map(metric => (
                <Card key={metric.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{metric.name}</CardTitle>
                    <CardDescription>{metric.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Importance</h3>
                      <p className="text-sm text-muted-foreground">{metric.importance}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Threshold Classifications</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 mr-2">
                              T0
                            </Badge>
                            <span className="text-sm font-medium">Low Risk</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{metric.thresholds.T0}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 mr-2">
                              T1
                            </Badge>
                            <span className="text-sm font-medium">High Risk</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{metric.thresholds.T1}</p>
                        </div>
                      </div>
                    </div>
                    
                    {metric.tools && metric.tools.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Recommended Tools & Resources</h3>
                        <div className="space-y-1">
                          {metric.tools.map(tool => (
                            <div key={tool} className="flex items-center">
                              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                              <span className="text-sm">{tool}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No risk metrics found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No risk metrics match your search query: "{searchQuery}"
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default RiskAssessment;
