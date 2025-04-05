
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProjectProvider } from "./contexts/ProjectContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Index";
import Board from "./pages/Board";
import Calendar from "./pages/Calendar";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import Epics from "./pages/Epics";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import FAQs from "./pages/FAQs";
import UserGuides from "./pages/UserGuides";
import APIDocumentation from "./pages/APIDocumentation";
import About from "./pages/About";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = sessionStorage.getItem('loginSuccess') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ProjectProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              sessionStorage.getItem('loginSuccess') === 'true' ? 
                <Navigate to="/dashboard" replace /> : 
                <LandingPage />
            } />
            <Route path="/login" element={
              sessionStorage.getItem('loginSuccess') === 'true' ? 
                <Navigate to="/dashboard" replace /> : 
                <Login />
            } />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/guides" element={<UserGuides />} />
            <Route path="/api-docs" element={<APIDocumentation />} />
            <Route path="/about" element={<About />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
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
            
            {/* Redirect /index to /dashboard */}
            <Route path="/index" element={<Navigate to="/dashboard" replace />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ProjectProvider>
  </QueryClientProvider>
);

export default App;
