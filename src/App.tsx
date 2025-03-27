
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EvaluationProvider } from "@/contexts/EvaluationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/layout/AuthGuard";
import Dashboard from "./pages/Dashboard";
import NewEvaluation from "./pages/NewEvaluation";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import MetricsGuide from "./pages/MetricsGuide";
import Guide from "./pages/Guide";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <EvaluationProvider>
            <Toaster />
            <Sonner position="top-right" />
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
              <Route path="/projects" element={<AuthGuard><Projects /></AuthGuard>} />
              <Route path="/projects/:projectId" element={<AuthGuard><ProjectDetail /></AuthGuard>} />
              <Route path="/evaluation/new" element={<AuthGuard><NewEvaluation /></AuthGuard>} />
              <Route path="/metrics/:categoryId" element={<AuthGuard><MetricsGuide /></AuthGuard>} />
              <Route path="/metrics" element={<AuthGuard><MetricsGuide /></AuthGuard>} />
              <Route path="/guide" element={<AuthGuard><Guide /></AuthGuard>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </EvaluationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
