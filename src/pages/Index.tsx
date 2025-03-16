
import React, { useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { Button } from '@/components/ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { projects, setCurrentProject } = useProject();
  const navigate = useNavigate();

  const handleProjectClick = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      navigate('/board');
    }
  };
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-gray-500">Manage and track your project tasks</p>
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
