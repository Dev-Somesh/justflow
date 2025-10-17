
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EnhancedAppLayout from '@/components/layouts/EnhancedAppLayout';
import ModernDashboard from '@/components/dashboard/ModernDashboard';
import { DashboardSkeleton } from '@/components/ui/LoadingSkeletons';
import { useProject } from '@/contexts/ProjectContext';
import { useUnifiedProjects, useUnifiedTasks } from '@/lib/api/unified';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CalendarClock, PlusCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewTaskModal from '@/components/modals/NewTaskModal';
import { useToast } from '@/hooks/use-toast';
import ErrorBoundary from '@/components/core/ErrorBoundary';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const { setCurrentProject, currentProject } = useProject();
  
  // Use unified data management
  const { data: apiProjects = [], isLoading: projectsLoading, error: projectsError } = useUnifiedProjects();
  const { data: apiTasks = [], isLoading: tasksLoading, error: tasksError } = useUnifiedTasks(currentProject?.id || 'project-1');
  
  const firstProject = apiProjects[0] || null;
  
  // Authentication check with enhanced error handling
  useEffect(() => {
    try {
      const loginSuccess = sessionStorage.getItem('loginSuccess');
      
      if (loginSuccess === 'true') {
        setIsAuthenticated(true);
      } else {
        navigate('/login');
      }
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);

  // Calculate task stats for the dashboard
  const todoCount = apiTasks.filter(t => t && t.status === 'todo').length;
  const inProgressCount = apiTasks.filter(t => t && t.status === 'in-progress').length;
  const doneCount = apiTasks.filter(t => t && t.status === 'done').length;
  const totalTasks = apiTasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;
  
  // Function to handle project selection
  const handleProjectClick = () => {
    if (firstProject) {
      setCurrentProject(firstProject.id);
      navigate('/board');
    }
  };

  // Function to handle quick add task
  const handleQuickAddTask = () => {
    setIsNewTaskModalOpen(true);
  };

  // Function to handle task creation from modal
  const handleTaskCreated = () => {
    setIsNewTaskModalOpen(false);
    toast({
      title: "Task created",
      description: "Your new task has been successfully created.",
    });
  };

  // Function to close modal without creating task
  const handleModalClose = () => {
    setIsNewTaskModalOpen(false);
  };

  // If not authenticated, show loading state
  if (!isAuthenticated) {
    return (
      <EnhancedAppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Checking authentication...</h2>
              <p className="text-gray-500">You will be redirected to login if needed.</p>
            </div>
          </div>
        </div>
      </EnhancedAppLayout>
    );
  }

  // Show loading state while data is being fetched
  if (projectsLoading || tasksLoading) {
    return (
      <EnhancedAppLayout>
        <div className="p-6">
          <DashboardSkeleton />
        </div>
      </EnhancedAppLayout>
    );
  }

  // Show error state if there are errors
  if (projectsError || tasksError) {
    return (
      <EnhancedAppLayout>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading data</AlertTitle>
            <AlertDescription>
              {projectsError?.message || tasksError?.message || 'An unexpected error occurred'}
            </AlertDescription>
          </Alert>
        </div>
      </EnhancedAppLayout>
    );
  }

  return (
    <EnhancedAppLayout>
      <div className="p-6">
        {/* Enhanced Welcome Message */}
        {totalTasks === 0 && (
          <Alert className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Welcome to JustFlow!</AlertTitle>
            <AlertDescription className="text-blue-700">
              Get started by creating your first project or adding tasks to see your dashboard come to life.
            </AlertDescription>
          </Alert>
        )}

        {/* Modern Dashboard */}
        <ModernDashboard projects={apiProjects} tasks={apiTasks} />

        {/* New Task Modal */}
        {isNewTaskModalOpen && (
          <ErrorBoundary>
            <NewTaskModal 
              projectId={firstProject?.id || 'project-1'}
              initialStatus="todo"
              isOpen={isNewTaskModalOpen}
              onClose={handleModalClose}
              onSuccess={handleTaskCreated}
            />
          </ErrorBoundary>
        )}
      </div>
    </EnhancedAppLayout>
  );
};

export default Index;
