import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Index from "@/pages/Index";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import NewEvaluation from "@/pages/NewEvaluation";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import MetricsGuide from "@/pages/MetricsGuide";
import NotFound from "@/pages/NotFound";
import TemplateEditor from "@/pages/TemplateEditor";
import Templates from "@/pages/Templates";

import { TemplateProvider } from "@/contexts/templates";
import { ThresholdProvider } from "@/contexts/thresholds";
import { EvaluationProvider } from "@/contexts/EvaluationContext";

import "./App.css";

function App() {
  return (
    <Router>
      <TemplateProvider>
        <ThresholdProvider>
          <EvaluationProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/new-evaluation" element={<NewEvaluation />} />
              <Route path="/metrics-guide" element={<MetricsGuide />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/template-editor/:id" element={<TemplateEditor />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-right" closeButton richColors />
          </EvaluationProvider>
        </ThresholdProvider>
      </TemplateProvider>
    </Router>
  );
}

export default App;
