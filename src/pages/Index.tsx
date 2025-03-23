
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

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { projects, setCurrentProject } = useProject();
  
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
  
  // Function to handle project selection
  const handleProjectClick = () => {
    if (firstProject) {
      setCurrentProject(firstProject.id); // Fix: Pass the project ID instead of the project object
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
            <ProjectCard project={firstProject} onClick={handleProjectClick} />
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
