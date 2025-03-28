
import React, { useState, useEffect } from "react";
import { AlertTriangle, Shield, ExternalLink, Filter, Download, BarChart } from "lucide-react";
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
import { getEvaluationsFromStorage } from "@/utils/localStorageUtils";
import { toast } from "sonner";
import { ProjectEvaluation } from "@/types/metrics";

// Risk status type
type RiskStatus = 'high' | 'medium' | 'low';

// Interface for risk assessment
interface RiskAssessment {
  metricId: string;
  status: RiskStatus;
  notes: string;
}

// Extended project with risk assessments
interface ProjectWithRisks extends ProjectEvaluation {
  risks: RiskAssessment[];
  riskStatus?: RiskStatus;
}

const RiskAssessment = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [projects, setProjects] = useState<ProjectWithRisks[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Find risk metrics from metricsData
  const riskCategory = metricsData.find(c => c.id === "risk");
  const allRiskMetrics = riskCategory?.metrics || [];
  
  // Load projects and analyze risks
  useEffect(() => {
    const loadProjects = () => {
      setIsLoading(true);
      try {
        // Get all projects from local storage
        const storedProjects = getEvaluationsFromStorage();
        
        // Analyze projects for risks
        const projectsWithRisks = storedProjects.map(project => {
          const risks: RiskAssessment[] = [];
          
          // Check regulatory risks
          if (project.metrics["risk_regulatory-risks"]) {
            const metricValue = project.metrics["risk_regulatory-risks"];
            risks.push({
              metricId: "regulatory-risks",
              status: metricValue.tier === 'T0' ? 'low' : metricValue.tier === 'T1' ? 'medium' : 'high',
              notes: metricValue.notes || "No additional notes provided."
            });
          }
          
          // Check token liquidity
          if (project.metrics["risk_token-liquidity"]) {
            const metricValue = project.metrics["risk_token-liquidity"];
            risks.push({
              metricId: "token-liquidity",
              status: metricValue.tier === 'T0' ? 'low' : metricValue.tier === 'T1' ? 'medium' : 'high',
              notes: metricValue.notes || "No additional notes provided."
            });
          }
          
          // Check runway/burn rate
          if (project.metrics["risk_runway-burn"]) {
            const metricValue = project.metrics["risk_runway-burn"];
            risks.push({
              metricId: "runway-burn",
              status: metricValue.tier === 'T0' ? 'low' : metricValue.tier === 'T1' ? 'medium' : 'high',
              notes: metricValue.notes || "No additional notes provided."
            });
          }
          
          // Check technical risks
          if (project.metrics["risk_technical-risks"]) {
            const metricValue = project.metrics["risk_technical-risks"];
            risks.push({
              metricId: "technical-risks",
              status: metricValue.tier === 'T0' ? 'low' : metricValue.tier === 'T1' ? 'medium' : 'high',
              notes: metricValue.notes || "No additional notes provided."
            });
          }
          
          // If project has no risk metrics evaluated
          if (risks.length === 0) {
            // Add placeholder risk assessments for projects without risk data
            risks.push({
              metricId: "regulatory-risks",
              status: 'medium',
              notes: "No evaluation data available for this risk."
            });
            risks.push({
              metricId: "token-liquidity", 
              status: 'medium',
              notes: "No evaluation data available for this risk."
            });
          }
          
          // Determine overall risk status (highest risk level)
          let overallRiskStatus: RiskStatus = 'low';
          if (risks.some(r => r.status === 'high')) {
            overallRiskStatus = 'high';
          } else if (risks.some(r => r.status === 'medium')) {
            overallRiskStatus = 'medium';
          }
          
          return {
            ...project,
            risks,
            riskStatus: overallRiskStatus
          };
        });
        
        setProjects(projectsWithRisks);
      } catch (error) {
        console.error("Error loading projects for risk assessment:", error);
        toast.error("Failed to load project risk data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjects();
  }, []);
  
  // Filter metrics based on search and category
  const filteredMetrics = allRiskMetrics.filter(metric => 
    metric.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    metric.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get risk status color
  const getRiskStatusColor = (status: RiskStatus) => {
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
    ? projects 
    : projects.filter(project => project.riskStatus === selectedCategory);
  
  // Export risk assessment report
  const exportRiskReport = () => {
    try {
      const reportData = {
        generatedAt: new Date().toISOString(),
        projects: projects.map(project => ({
          name: project.name,
          id: project.id,
          date: project.date,
          overallRisk: project.riskStatus,
          risks: project.risks.map(risk => ({
            metric: getRiskMetricById(risk.metricId)?.name || risk.metricId,
            status: risk.status,
            notes: risk.notes
          }))
        }))
      };
      
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileName = `risk_assessment_report_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileName);
      linkElement.click();
      
      toast.success("Risk assessment report exported");
    } catch (error) {
      console.error("Error exporting risk report:", error);
      toast.error("Failed to export risk assessment report");
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Risk Assessment"
        description="Analyze and manage potential risks associated with blockchain projects"
        actions={
          <Button variant="outline" onClick={exportRiskReport}>
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
                  {projects.filter(p => p.riskStatus === "high").length}
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
                  {projects.filter(p => p.riskStatus === "medium").length}
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
                  {projects.filter(p => p.riskStatus === "low").length}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Projects with all risk factors rated low
                </p>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Project Risk Analysis</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                <p className="text-muted-foreground">Loading risk assessments...</p>
              </div>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="space-y-4">
              {filteredProjects.map(project => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{project.name}</CardTitle>
                        <CardDescription>Last assessed: {new Date(project.date).toLocaleDateString()}</CardDescription>
                      </div>
                      <Badge className={getRiskStatusColor(project.riskStatus || 'medium')}>
                        {project.riskStatus?.toUpperCase() || 'MEDIUM'} RISK
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
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/projects/${project.id}`}>
                        View Project Details <BarChart className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No projects match your filter</CardTitle>
                <CardDescription>
                  {projects.length === 0 
                    ? "No projects with risk assessments found. Create new evaluations to analyze risks." 
                    : "Try changing your filter criteria"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length === 0 && (
                  <Button asChild>
                    <a href="/new-evaluation">Create a New Evaluation</a>
                  </Button>
                )}
              </CardContent>
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
                            <span className="text-sm font-medium">Higher Risk</span>
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
