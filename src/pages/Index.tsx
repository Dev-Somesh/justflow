
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
import { CalendarClock } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { projects, setCurrentProject, tasks } = useProject();
  
  // Simple authentication check - in a real app, this would check for a token
  useEffect(() => {
    // Check if user was redirected from login page
    const loginSuccess = sessionStorage.getItem('loginSuccess');
    
    if (loginSuccess === 'true') {
      setIsAuthenticated(true);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Get the first project to display on dashboard
  const firstProject = projects[0] || null;

  // Calculate task stats for the dashboard
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;
  
  // Function to handle project selection
  const handleProjectClick = () => {
    if (firstProject) {
      setCurrentProject(firstProject.id);
      navigate('/board');
    }
  };

  // If not authenticated, show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          
          {firstProject && (
            <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{firstProject.name}</h2>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Sprint</span>
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
                  <span>{todoCount + inProgressCount + doneCount} / {totalTasks}</span>
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
              
              {tasks.some(t => t.priority === 'high') && (
                <div className="mt-4 flex items-center text-sm text-amber-600">
                  <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  <span>{tasks.filter(t => t.priority === 'high').length} high priority</span>
                </div>
              )}
              
              {firstProject.dueDate && (
                <div className="mt-2 flex items-center text-sm text-blue-600">
                  <CalendarClock className="h-4 w-4 mr-1" />
                  <span>Feb 1</span>
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
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
              <h2 className="text-lg font-medium mb-4">Sprint Burndown</h2>
              <SprintBurndownChart />
            </div>
            <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
              <h2 className="text-lg font-medium mb-4">Team Velocity</h2>
              <VelocityChart />
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
    </AppLayout>
  );
};

export default Index;
