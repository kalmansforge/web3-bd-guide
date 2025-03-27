
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EvaluationProvider } from "@/contexts/EvaluationContext";
import Dashboard from "./pages/Dashboard";
import NewEvaluation from "./pages/NewEvaluation";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import MetricsGuide from "./pages/MetricsGuide";
import Guide from "./pages/Guide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EvaluationProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/evaluation/new" element={<NewEvaluation />} />
            <Route path="/metrics/:categoryId" element={<MetricsGuide />} />
            <Route path="/metrics" element={<MetricsGuide />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </EvaluationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
