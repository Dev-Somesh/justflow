
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layouts/AppLayout';
import SprintBurndownChart from '@/components/dashboard/SprintBurndownChart';
import VelocityChart from '@/components/dashboard/VelocityChart';
import ProjectCard from '@/components/dashboard/ProjectCard';
import RecentActivityWidget from '@/components/dashboard/RecentActivityWidget';
import StoryPointsInfo from '@/components/dashboard/StoryPointsInfo';
import TeamWorkloadView from '@/components/dashboard/TeamWorkloadView';
import AttentionWidget from '@/components/dashboard/AttentionWidget';
import { useProject } from '@/contexts/ProjectContext';
import { useProjects } from '@/lib/api/projects';
import { useTasks } from '@/lib/api/tasks';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CalendarClock, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewTaskModal from '@/components/modals/NewTaskModal';
import { useToast } from '@/hooks/use-toast';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const { setCurrentProject } = useProject();
  const { data: apiProjects = [] } = useProjects();
  const firstProject = apiProjects[0] || null;
  const { data: apiTasks = [] } = useTasks(firstProject?.id || 'project-1');
  
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
      console.error('Authentication check failed:', error);
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

  // If not authenticated, show nothing while redirecting
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Checking authentication...</h2>
          <p className="text-gray-500">You will be redirected to login if needed.</p>
        </div>
      </div>
    );
  }

  // Dashboard rendering with authenticated user

  return (
    <AppLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Button onClick={handleQuickAddTask}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
          
          {totalTasks === 0 && (
            <Alert className="bg-amber-50 text-amber-800 border-amber-200">
              <AlertTitle>No tasks added yet</AlertTitle>
              <AlertDescription>
                Start by adding your first task using the "Add Task" button above.
              </AlertDescription>
            </Alert>
          )}
          
          {firstProject && (
            <ProjectCard 
              project={firstProject}
              onClick={handleProjectClick}
              ctaLabel="Open Board"
              onCtaClick={handleProjectClick}
              density="compact"
            />
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
              <h2 className="text-lg font-medium mb-4">Sprint Burndown</h2>
              {totalTasks === 0 ? (
                <div className="flex items-center justify-center h-48 bg-gray-50 rounded-md">
                  <p className="text-gray-500">No tasks available to generate burndown chart</p>
                </div>
              ) : (
                <SprintBurndownChart />
              )}
            </div>
            <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
              <h2 className="text-lg font-medium mb-4">Team Velocity</h2>
              {totalTasks === 0 ? (
                <div className="flex items-center justify-center h-48 bg-gray-50 rounded-md">
                  <p className="text-gray-500">No historical data available for velocity chart</p>
                </div>
              ) : (
                <VelocityChart />
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
            <h2 className="text-lg font-medium mb-4">Team Workload</h2>
            <TeamWorkloadView projectId={firstProject?.id || 'project-1'} />
          </div>
        </div>
        
        <div className="space-y-6">
          <AttentionWidget projectId={firstProject?.id || 'project-1'} />
          <StoryPointsInfo />
        </div>
      </div>
      
      <div className="mt-6">
        <RecentActivityWidget projectId={firstProject?.id || 'project-1'} limit={5} />
      </div>
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
    </AppLayout>
  );
};

export default Index;
