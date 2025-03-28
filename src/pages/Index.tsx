
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Server, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to guide page only if the URL path is exactly "/"
    if (window.location.pathname === "/") {
      navigate("/guide");
    }
  }, [navigate]);
  
  const handleGetStarted = () => {
    navigate("/guide");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
              Web3 BD Field Guide
            </h1>
            <p className="text-muted-foreground md:text-xl max-w-[700px]">
              An interactive evaluation framework for blockchain projects that helps you make data-driven decisions.
            </p>
            <Button size="lg" className="mt-4" onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:gap-10">
            {/* Comprehensive Evaluation Framework */}
            <div className="space-y-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Comprehensive Evaluation Framework
              </h2>
              <p className="text-muted-foreground md:text-lg max-w-[800px] mx-auto">
                Evaluate blockchain projects across multiple dimensions including tokenomics, team composition, 
                technical architecture, market fit, and security measures.
              </p>
            </div>

            {/* Features Section */}
            <div className="space-y-6 pt-8">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FeatureCard 
                  title="Privacy-Focused"
                  description="All your evaluation data stays in your browser's local storage, never transmitted to any server, ensuring complete privacy."
                  icon={Lock}
                />
                <FeatureCard 
                  title="Secure By Design"
                  description="Your sensitive project evaluations never leave your device, eliminating data breach risks and keeping your strategic decisions confidential."
                  icon={Shield}
                />
                <FeatureCard 
                  title="No Server Dependency"
                  description="Works completely offline with no backend server requirements, ensuring your data remains solely under your control."
                  icon={Server}
                />
                <FeatureCard 
                  title="Portable Data"
                  description="Easily export and import your evaluations as JSON files, maintaining data ownership while enabling sharing when needed."
                  icon={FileJson}
                />
              </div>
            </div>

            {/* Privacy Callout */}
            <div className="bg-muted rounded-lg p-6 md:p-8 mt-8">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Lock className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-xl font-semibold">Your Data Never Leaves Your Device</h3>
                  <p className="text-muted-foreground">
                    Unlike cloud-based tools, the Web3 BD Field Guide uses your browser's local storage exclusively.
                    This means your sensitive project evaluations and strategic decisions remain completely private,
                    with no data ever being transmitted to external servers.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center pt-8">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                Start Making Data-Driven Decisions Today
              </h2>
              <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto mb-6">
                Begin evaluating blockchain projects systematically with our comprehensive framework.
              </p>
              <Button size="lg" onClick={handleGetStarted}>
                Launch the Guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 md:py-8 mt-auto bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Web3 BD Field Guide. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
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
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Index;
