
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, Shield, Info, CheckCircle2, XCircle } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import AppLayout from "@/components/layout/AppLayout";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Risk assessment categories and questions
const riskCategories = [
  {
    id: "smart-contract",
    title: "Smart Contract Security",
    description: "Evaluate the security of smart contracts",
    icon: Shield,
    questions: [
      { id: "audit", label: "Has the contract been audited by a reputable security firm?", required: true },
      { id: "upgradable", label: "Is the contract upgradable with proper governance?", required: false },
      { id: "testing", label: "Does the contract have comprehensive test coverage?", required: true },
      { id: "overflow", label: "Is the contract protected against integer overflow/underflow?", required: true },
    ]
  },
  {
    id: "compliance",
    title: "Regulatory Compliance",
    description: "Assess compliance with relevant regulations",
    icon: Info,
    questions: [
      { id: "kyc-aml", label: "Does the project implement KYC/AML procedures?", required: true },
      { id: "personal-data", label: "Is personal data handled in compliance with privacy laws?", required: true },
      { id: "jurisdiction", label: "Has legal counsel confirmed compliance in target jurisdictions?", required: false },
    ]
  },
  {
    id: "operational",
    title: "Operational Security",
    description: "Evaluate operational security practices",
    icon: AlertTriangle,
    questions: [
      { id: "key-management", label: "Is there a secure key management system in place?", required: true },
      { id: "multi-sig", label: "Are critical operations secured by multi-signature requirements?", required: true },
      { id: "incident-response", label: "Is there a documented incident response plan?", required: false },
      { id: "backup", label: "Are there regular backups of critical data?", required: true },
    ]
  }
];

const RiskAssessment = () => {
  const navigate = useNavigate();
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  
  const form = useForm({
    defaultValues: {
      projectName: "",
      projectDescription: "",
    }
  });

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setCheckedItems(prev => ({ ...prev, [id]: checked }));
  };

  const calculateRiskLevel = () => {
    const requiredQuestions = riskCategories.flatMap(
      category => category.questions.filter(q => q.required)
    );
    
    const requiredCheckedCount = requiredQuestions.filter(
      q => checkedItems[q.id]
    ).length;
    
    const percentage = (requiredCheckedCount / requiredQuestions.length) * 100;
    
    if (percentage >= 80) return "low";
    if (percentage >= 50) return "medium";
    return "high";
  };

  const onSubmit = (data: any) => {
    const risk = calculateRiskLevel();
    setRiskLevel(risk);
    
    toast.success("Risk assessment completed", {
      description: `Project: ${data.projectName} - Risk level: ${risk.toUpperCase()}`
    });
  };
  
  return (
    <AppLayout>
      <PageHeader
        title="Risk Assessment"
        description="Evaluate project risks and vulnerabilities"
      />
      
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                  <CardDescription>
                    Enter basic information about the project you want to assess
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter project name" {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of the project or protocol being assessed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="projectDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description of the project" {...field} />
                        </FormControl>
                        <FormDescription>
                          A short description of the project's purpose and scope
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              {riskCategories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <category.icon className="h-5 w-5 text-primary" />
                      <CardTitle>{category.title}</CardTitle>
                    </div>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.questions.map((question) => (
                        <div key={question.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={question.id}
                            checked={checkedItems[question.id] || false}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange(question.id, checked === true)
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={question.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {question.label}
                            </label>
                            {question.required && (
                              <p className="text-xs text-muted-foreground">
                                Required for risk assessment
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button type="submit" className="w-full">
                Calculate Risk Assessment
              </Button>
            </form>
          </Form>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Guide</CardTitle>
              <CardDescription>How to use this assessment tool</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This tool helps identify potential risks in your Web3 project across multiple security dimensions.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium">How it works:</h4>
                  <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Enter your project details</li>
                    <li>Check all security measures that are in place</li>
                    <li>Submit to receive a risk assessment</li>
                  </ol>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium">Risk Levels:</h4>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span>High Risk: Less than 50% of required measures</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Medium Risk: 50-80% of required measures</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Low Risk: More than 80% of required measures</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {riskLevel && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Assessment Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-4">
                  {riskLevel === "high" && (
                    <>
                      <XCircle className="h-12 w-12 text-destructive mb-2" />
                      <h3 className="text-xl font-bold text-destructive">High Risk</h3>
                    </>
                  )}
                  
                  {riskLevel === "medium" && (
                    <>
                      <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
                      <h3 className="text-xl font-bold text-amber-500">Medium Risk</h3>
                    </>
                  )}
                  
                  {riskLevel === "low" && (
                    <>
                      <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                      <h3 className="text-xl font-bold text-green-500">Low Risk</h3>
                    </>
                  )}
                  
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    Based on your responses to the required security measures
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default RiskAssessment;
