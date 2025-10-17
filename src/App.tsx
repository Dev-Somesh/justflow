
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ErrorBoundary from "./components/core/ErrorBoundary";
import React, { Suspense, lazy } from "react";
import { ProjectProvider } from "./contexts/ProjectContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { PageSkeleton } from "@/components/ui/LoadingSkeletons";

// Lazy load pages for better performance
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Index"));
const Issues = lazy(() => import("./pages/Issues"));
const Cycles = lazy(() => import("./pages/Cycles"));
const Modules = lazy(() => import("./pages/Modules"));
const Pages = lazy(() => import("./pages/Pages"));
const Board = lazy(() => import("./pages/EnhancedBoard"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Team = lazy(() => import("./pages/Team"));
const Settings = lazy(() => import("./pages/Settings"));
const Epics = lazy(() => import("./pages/Epics"));
const Help = lazy(() => import("./pages/Help"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FAQs = lazy(() => import("./pages/FAQs"));
const UserGuides = lazy(() => import("./pages/UserGuides"));
const APIDocumentation = lazy(() => import("./pages/APIDocumentation"));
const About = lazy(() => import("./pages/About"));
const WorkflowBuilderPage = lazy(() => import("./pages/WorkflowBuilderPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Enhanced loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen bg-gray-50/50">
    <div className="p-6">
      <PageSkeleton />
    </div>
  </div>
);

// Protected route component with error boundary
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  
  React.useEffect(() => {
    const checkAuth = () => {
      try {
        const authStatus = sessionStorage.getItem('loginSuccess') === 'true';
        setIsAuthenticated(authStatus);
        setIsLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ProjectProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={
                  sessionStorage.getItem('loginSuccess') === 'true' ? 
                    <Navigate to="/dashboard" replace /> : 
                    <ErrorBoundary><LandingPage /></ErrorBoundary>
                } />
                <Route path="/login" element={
                  sessionStorage.getItem('loginSuccess') === 'true' ? 
                    <Navigate to="/dashboard" replace /> : 
                    <ErrorBoundary><Login /></ErrorBoundary>
                } />
                <Route path="/faqs" element={<ErrorBoundary><FAQs /></ErrorBoundary>} />
                <Route path="/guides" element={<ErrorBoundary><UserGuides /></ErrorBoundary>} />
                <Route path="/api-docs" element={<ErrorBoundary><APIDocumentation /></ErrorBoundary>} />
                <Route path="/about" element={<ErrorBoundary><About /></ErrorBoundary>} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/issues" element={
                  <ProtectedRoute>
                    <Issues />
                  </ProtectedRoute>
                } />
                <Route path="/cycles" element={
                  <ProtectedRoute>
                    <Cycles />
                  </ProtectedRoute>
                } />
                <Route path="/modules" element={
                  <ProtectedRoute>
                    <Modules />
                  </ProtectedRoute>
                } />
                <Route path="/pages" element={
                  <ProtectedRoute>
                    <Pages />
                  </ProtectedRoute>
                } />
                <Route path="/board" element={
                  <ProtectedRoute>
                    <Board />
                  </ProtectedRoute>
                } />
                <Route path="/calendar" element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } />
                <Route path="/team" element={
                  <ProtectedRoute>
                    <Team />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/epics" element={
                  <ProtectedRoute>
                    <Epics />
                  </ProtectedRoute>
                } />
                <Route path="/help" element={
                  <ProtectedRoute>
                    <Help />
                  </ProtectedRoute>
                } />
                <Route path="/workflows/builder" element={
                  <ProtectedRoute>
                    <WorkflowBuilderPage />
                  </ProtectedRoute>
                } />
                
                {/* Redirect /index to /dashboard */}
                <Route path="/index" element={<Navigate to="/dashboard" replace />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<ErrorBoundary><NotFound /></ErrorBoundary>} />
              </Routes>
              {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ProjectProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
