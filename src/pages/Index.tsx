
import React, { useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { Button } from '@/components/ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  BarChart3,
  LucideGitPullRequest,
  CalendarDays,
  Target,
  Star,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import SprintBurndownChart from '@/components/dashboard/SprintBurndownChart';
import VelocityChart from '@/components/dashboard/VelocityChart';
import TeamWorkloadView from '@/components/dashboard/TeamWorkloadView';
import RecentActivityWidget from '@/components/dashboard/RecentActivityWidget';
import InfoTooltip from '@/components/ui/InfoTooltip';

const Index = () => {
  const { projects, setCurrentProject, currentProject } = useProject();
  const navigate = useNavigate();

  const handleProjectClick = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      navigate('/board');
    }
  };
  
  // Calculate statistics only for the current project
  const projectTasks = currentProject ? currentProject.tasks : [];
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(task => task.status === 'done').length;
  const inProgressTasks = projectTasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = projectTasks.filter(task => task.status === 'todo').length;
  const highPriorityTasks = projectTasks.filter(task => task.priority === 'high').length;
  
  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  // Calculate story points statistics
  const totalStoryPoints = projectTasks.reduce((total, task) => total + (task.storyPoints || 0), 0);
  const completedStoryPoints = projectTasks
    .filter(task => task.status === 'done')
    .reduce((total, task) => total + (task.storyPoints || 0), 0);
  
  // Get active sprint for current project
  const currentSprint = currentProject 
    ? currentProject.sprints.find(sprint => sprint.status === 'active')
    : null;
  
  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Project metrics and management overview</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/team')}>
            <Users className="h-4 w-4 mr-2" />
            Team
          </Button>
          <Button onClick={() => navigate('/epics')}>
            View Epics & Roadmap
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="relative overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tasks</p>
                <h3 className="text-2xl font-bold">{totalTasks}</h3>
              </div>
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
          <div 
            className="absolute inset-0 cursor-pointer hover:bg-black/5 transition-colors"
            onClick={() => navigate('/board')}
          />
        </Card>
        
        <Card className="relative overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <h3 className="text-2xl font-bold">{completedTasks}</h3>
                <p className="text-xs text-gray-500">{completionPercentage}% of total</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
          <div 
            className="absolute inset-0 cursor-pointer hover:bg-black/5 transition-colors"
            onClick={() => navigate('/board?status=done')}
          />
        </Card>
        
        <Card className="relative overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <h3 className="text-2xl font-bold">{inProgressTasks}</h3>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
          <div 
            className="absolute inset-0 cursor-pointer hover:bg-black/5 transition-colors"
            onClick={() => navigate('/board?status=in-progress')}
          />
        </Card>
        
        <Card className="relative overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">High Priority</p>
                <h3 className="text-2xl font-bold">{highPriorityTasks}</h3>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
          <div 
            className="absolute inset-0 cursor-pointer hover:bg-black/5 transition-colors"
            onClick={() => navigate('/board?priority=high')}
          />
        </Card>
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Advanced Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Story Points</span>
                  <InfoTooltip 
                    content={
                      <div>
                        <p className="font-medium mb-1">What are Story Points?</p>
                        <p>Story points are a unit of measure for expressing the overall effort required to fully implement a product backlog item.</p>
                        <p className="mt-2">Common point values follow the Fibonacci sequence: 1, 2, 3, 5, 8, 13, etc.</p>
                      </div>
                    } 
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-3xl font-bold">{totalStoryPoints}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-3xl font-bold">{completedStoryPoints}</p>
                    <p className="text-xs text-gray-500">
                      {totalStoryPoints > 0 
                        ? Math.round((completedStoryPoints / totalStoryPoints) * 100) 
                        : 0}% completed
                    </p>
                  </div>
                </div>
              </CardContent>
              <div 
                className="absolute inset-0 cursor-pointer hover:bg-black/5 transition-colors"
                onClick={() => navigate('/board')}
              />
            </Card>
            
            <Card className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <LucideGitPullRequest className="h-5 w-5 text-purple-500" />
                  <span>Current Sprint</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentSprint ? (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{currentSprint.name}</h3>
                      <Badge>Active</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{currentSprint.goal}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {format(new Date(currentSprint.startDate), 'MMM d')} - {format(new Date(currentSprint.endDate), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {currentProject 
                          ? currentProject.tasks.filter(t => t.sprintId === currentSprint.id).length 
                          : 0} tasks
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No active sprint</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate('/board')}>
                      Start New Sprint
                    </Button>
                  </div>
                )}
              </CardContent>
              <div 
                className="absolute inset-0 cursor-pointer hover:bg-black/5 transition-colors"
                onClick={() => navigate('/board')}
              />
            </Card>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sprint Burndown</CardTitle>
              </CardHeader>
              <CardContent>
                <SprintBurndownChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Team Velocity</CardTitle>
              </CardHeader>
              <CardContent>
                <VelocityChart />
              </CardContent>
            </Card>
          </div>

          {/* Projects */}
          <div>
            <h2 className="text-lg font-medium mb-4">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onClick={() => handleProjectClick(project.id)} 
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column - Activity & Team */}
        <div className="space-y-6">
          {/* Recent Activity Widget */}
          {currentProject && (
            <RecentActivityWidget projectId={currentProject.id} limit={8} />
          )}
          
          {/* Team Workload Summary */}
          {currentProject && (
            <TeamWorkloadView projectId={currentProject.id} />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
