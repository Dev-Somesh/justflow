
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layouts/AppLayout';
import SprintBurndownChart from '@/components/dashboard/SprintBurndownChart';
import VelocityChart from '@/components/dashboard/VelocityChart';
import ProjectCard from '@/components/dashboard/ProjectCard';
import RecentActivityWidget from '@/components/dashboard/RecentActivityWidget';
import StoryPointsInfo from '@/components/dashboard/StoryPointsInfo';
import TeamWorkloadView from '@/components/dashboard/TeamWorkloadView';
import { useProject } from '@/contexts/ProjectContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CalendarClock, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewTaskModal from '@/components/modals/NewTaskModal';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const { projects, setCurrentProject, tasks, addTask } = useProject();
  
  // Simple authentication check - in a real app, this would check for a token
  useEffect(() => {
    console.log("Dashboard page loaded, checking authentication");
    // Check if user was redirected from login page
    const loginSuccess = sessionStorage.getItem('loginSuccess');
    
    if (loginSuccess === 'true') {
      console.log("User is authenticated");
      setIsAuthenticated(true);
    } else {
      console.log("User is not authenticated, navigating to login");
      navigate('/login');
    }
  }, [navigate]);

  // Get the first project to display on dashboard
  const firstProject = projects[0] || null;

  // Calculate task stats for the dashboard
  const todoCount = tasks.filter(t => t && t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t && t.status === 'in-progress').length;
  const doneCount = tasks.filter(t => t && t.status === 'done').length;
  const totalTasks = tasks.length;
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

  console.log("Rendering dashboard with authenticated user");

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
            <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{firstProject.name}</h2>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Project</span>
              </div>
              <p className="text-gray-600 mb-4">{firstProject.description}</p>
              
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Tasks</h3>
                <div className="flex justify-between text-sm mb-4">
                  <span>{todoCount + inProgressCount + doneCount} / {totalTasks || 'No tasks'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="text-lg font-bold">{todoCount}</div>
                    <div className="text-xs text-gray-500">To Do</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="text-lg font-bold">{inProgressCount}</div>
                    <div className="text-xs text-gray-500">In Progress</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="text-lg font-bold">{doneCount}</div>
                    <div className="text-xs text-gray-500">Done</div>
                  </div>
                </div>
              </div>
              
              {tasks.some(t => t && t.priority === 'high') && (
                <div className="mt-4 flex items-center text-sm text-amber-600">
                  <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  <span>{tasks.filter(t => t && t.priority === 'high').length} high priority</span>
                </div>
              )}
              
              {firstProject.dueDate && (
                <div className="mt-2 flex items-center text-sm text-blue-600">
                  <CalendarClock className="h-4 w-4 mr-1" />
                  <span>Due: {new Date(firstProject.dueDate).toLocaleDateString()}</span>
                </div>
              )}
              
              {firstProject.team && firstProject.team.length > 0 && (
                <div className="mt-4 flex -space-x-2">
                  {firstProject.team.slice(0, 3).map((member, index) => (
                    <div key={index} className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-xs font-bold">
                      {member.name.charAt(0)}
                    </div>
                  ))}
                  {firstProject.team.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                      +{firstProject.team.length - 3}
                    </div>
                  )}
                </div>
              )}
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={handleProjectClick}
              >
                View Project Board
              </Button>
            </div>
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
          <StoryPointsInfo />
          <RecentActivityWidget projectId={firstProject?.id || 'project-1'} limit={5} />
        </div>
      </div>
      
      {/* New Task Modal */}
      <NewTaskModal 
        projectId={firstProject?.id || 'project-1'}
        initialStatus="todo"
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
      />
    </AppLayout>
  );
};

export default Index;
