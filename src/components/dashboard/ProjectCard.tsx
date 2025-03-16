
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Avatar from '@/components/ui/Avatar';
import { Project, useProject } from '@/contexts/ProjectContext';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const { getUserById } = useProject();
  
  // Calculate progress
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(task => task.status === 'done').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Get unique assignees
  const assigneeIds = [...new Set(project.tasks.map(task => task.assigneeId).filter(Boolean))];
  const assignees = assigneeIds.map(id => getUserById(id!)).filter(Boolean);
  
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{project.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
        
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Tasks</span>
            <span>{completedTasks} / {totalTasks}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="bg-gray-100 rounded p-2 text-center">
              <div className="text-xs text-gray-500">To Do</div>
              <div className="font-medium">{project.tasks.filter(t => t.status === 'todo').length}</div>
            </div>
            <div className="bg-gray-100 rounded p-2 text-center">
              <div className="text-xs text-gray-500">In Progress</div>
              <div className="font-medium">{project.tasks.filter(t => t.status === 'in-progress').length}</div>
            </div>
            <div className="bg-gray-100 rounded p-2 text-center">
              <div className="text-xs text-gray-500">Done</div>
              <div className="font-medium">{project.tasks.filter(t => t.status === 'done').length}</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="flex -space-x-2">
          {assignees.slice(0, 3).map((user) => (
            <div key={user!.id} className="border-2 border-white rounded-full">
              <Avatar src={user!.avatar} name={user!.name} size="sm" />
            </div>
          ))}
          {assignees.length > 3 && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 border-2 border-white text-xs font-medium">
              +{assignees.length - 3}
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500">
          Updated {new Date().toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
