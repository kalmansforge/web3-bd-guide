
import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Server, FileJson, Shield, BarChart2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon,
}: { 
  title: string; 
  description: string;
  icon: React.ElementType;
}) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md animate-scale-in h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const Index = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate("/dashboard");
  };
  
  const handleLearnMore = () => {
    navigate("/guide");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-secondary/20 pt-16 pb-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter animate-fade-in">
              Web3 BD Field Guide
            </h1>
            <p className="text-xl text-muted-foreground max-w-[700px] animate-fade-in">
              Interactive evaluation framework for blockchain projects with enhanced privacy and security
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-in">
              <Button size="lg" onClick={handleGetStarted}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={handleLearnMore}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Key Features</h2>
            <p className="text-muted-foreground mt-2">Powerful tools for blockchain project evaluation</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              title="Local Storage Privacy" 
              description="All your data is stored locally in your browser, ensuring maximum privacy and security. No server uploads, no data sharing - your evaluations stay with you."
              icon={Lock}
            />
            <FeatureCard 
              title="Comprehensive Metrics" 
              description="Evaluate projects across 6 key dimensions with detailed metrics designed specifically for blockchain initiatives."
              icon={BarChart2}
            />
            <FeatureCard 
              title="Offline-First Architecture" 
              description="Work anywhere, anytime without an internet connection. Your data is safely stored in your browser."
              icon={Server}
            />
            <FeatureCard 
              title="Standardized Framework" 
              description="Apply consistent evaluation criteria across all projects with a structured methodology."
              icon={FileJson}
            />
            <FeatureCard 
              title="Risk Assessment" 
              description="Identify potential vulnerabilities and threats with our comprehensive risk evaluation tools."
              icon={Shield}
            />
            <FeatureCard 
              title="Collaborative Insights" 
              description="Share your findings and methodology with team members while maintaining full control over your data."
              icon={Users}
            />
          </div>
        </div>
      </section>
      
      {/* Privacy Focus Callout */}
      <section className="bg-primary/5 py-12">
        <div className="container px-4 md:px-6">
          <div className="bg-card rounded-lg shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-16 flex-shrink-0 flex justify-center">
                <Lock className="h-12 w-12 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Your Privacy, Our Priority</h3>
                <p className="text-muted-foreground mb-4">
                  Unlike cloud-based tools, our application uses your browser's local storage to keep all your data on your device. 
                  This means your sensitive evaluations and project assessments never leave your computer unless you explicitly export them.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate('/guide')}>
                    Learn About Our Approach
                  </Button>
                  <Button variant="link" size="sm" onClick={() => navigate('/settings')}>
                    View Storage Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary/10">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Ready to Evaluate Your Projects?
          </h2>
          <p className="text-muted-foreground max-w-[700px] mx-auto mb-6">
            Get started now with our comprehensive blockchain project evaluation framework.
          </p>
          <Button size="lg" onClick={handleGetStarted}>
            Get Started Now
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:h-24">
            <p className="text-sm text-muted-foreground">
              © 2023 Web3 BD Field Guide. All rights reserved.
            </p>
            <nav className="flex gap-4 text-sm text-muted-foreground">
              <a href="/guide" className="hover:underline">Guide</a>
              <a href="/metrics-guide" className="hover:underline">Metrics</a>
              <a href="/settings" className="hover:underline">Settings</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
