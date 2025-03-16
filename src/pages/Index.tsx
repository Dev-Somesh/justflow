
import React, { useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { Button } from '@/components/ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  BarChart3
} from 'lucide-react';

const Index = () => {
  const { projects, setCurrentProject, tasks } = useProject();
  const navigate = useNavigate();

  const handleProjectClick = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      navigate('/board');
    }
  };
  
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  
  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-gray-500">Manage and track your project tasks</p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tasks</p>
                <h3 className="text-2xl font-bold">{totalTasks}</h3>
              </div>
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
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
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <h3 className="text-2xl font-bold">{inProgressTasks}</h3>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">High Priority</p>
                <h3 className="text-2xl font-bold">{highPriorityTasks}</h3>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Task Status Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Task Status Overview</h2>
        <div className="flex gap-3">
          <Badge variant="status-todo" className="gap-1">
            To Do <span className="bg-white bg-opacity-20 ml-1 px-1 rounded-sm">{todoTasks}</span>
          </Badge>
          <Badge variant="status-in-progress" className="gap-1">
            In Progress <span className="bg-white bg-opacity-20 ml-1 px-1 rounded-sm">{inProgressTasks}</span>
          </Badge>
          <Badge variant="status-done" className="gap-1">
            Done <span className="bg-white bg-opacity-20 ml-1 px-1 rounded-sm">{completedTasks}</span>
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onClick={() => handleProjectClick(project.id)} 
          />
        ))}
      </div>
    </AppLayout>
  );
};

export default Index;
