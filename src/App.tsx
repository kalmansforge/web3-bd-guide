
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { ThresholdProvider } from '@/contexts/ThresholdContext';
import { EvaluationProvider } from '@/contexts/EvaluationContext';
import { useEffect } from 'react';
import { getAppearanceFromStorage } from '@/utils/storage';

// Pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Guide from './pages/Guide';
import MetricsGuide from './pages/MetricsGuide';
import NewEvaluation from './pages/NewEvaluation';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import RiskAssessment from './pages/RiskAssessment';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  // Initialize appearance settings on app load
  useEffect(() => {
    const applyAppearanceSettings = () => {
      const settings = getAppearanceFromStorage();
      const htmlElement = document.documentElement;
      
      // Apply theme
      if (settings.theme === 'dark') {
        htmlElement.classList.add('dark');
      } else if (settings.theme === 'light') {
        htmlElement.classList.remove('dark');
      } else {
        // System preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          htmlElement.classList.add('dark');
        } else {
          htmlElement.classList.remove('dark');
        }
      }
      
      // Apply color scheme
      htmlElement.setAttribute('data-color-scheme', settings.colorScheme);
      
      // Apply font size
      htmlElement.setAttribute('data-font-size', settings.fontSize);
      
      // Apply border radius
      htmlElement.setAttribute('data-border-radius', settings.borderRadius);
      
      // Apply animation setting
      if (settings.animation) {
        htmlElement.classList.remove('reduce-motion');
      } else {
        htmlElement.classList.add('reduce-motion');
      }
    };
    
    applyAppearanceSettings();
    
    // Listen for system theme changes if using system setting
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const settings = getAppearanceFromStorage();
      if (settings.theme === 'system') {
        applyAppearanceSettings();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThresholdProvider>
      <EvaluationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/metrics-guide" element={<MetricsGuide />} />
            <Route path="/new-evaluation" element={<NewEvaluation />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/risk-assessment" element={<RiskAssessment />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <SonnerToaster />
        </Router>
      </EvaluationProvider>
    </ThresholdProvider>
  );
}

export default App;
