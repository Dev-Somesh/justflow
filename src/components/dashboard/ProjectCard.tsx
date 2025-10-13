
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import UserAvatar from '@/components/ui/UserAvatar';
import { Project, useProject } from '@/contexts/ProjectContext';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { format, isAfter, isBefore, differenceInDays } from 'date-fns';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, responsive } from '@/utils/theme';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  ctaLabel?: string;
  onCtaClick?: () => void;
  density?: 'default' | 'compact';
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, ctaLabel, onCtaClick, density = 'default' }) => {
  const { getUserById } = useProject();
  const isCompact = density === 'compact';
  const navigate = useNavigate();
  
  // Calculate progress
  const totalTasks = project.tasks ? project.tasks.length : 0;
  const completedTasks = project.tasks ? project.tasks.filter(task => task && task.status === 'done').length : 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Get unique assignees - make sure to filter out undefined tasks and assignees
  const assigneeIds = project.tasks ? 
    [...new Set(project.tasks
      .filter(task => task && task.assigneeId)
      .map(task => task.assigneeId))] 
    : [];
  
  const assignees = assigneeIds.map(id => id ? getUserById(id) : null).filter(Boolean);
  
  // Get active sprint if any
  const activeSprint = project.sprints ? project.sprints.find(sprint => sprint && sprint.status === 'active') : undefined;
  
  // Calculate sprint status if active
  let sprintStatus: {color: string, label: string} | null = null;
  
  if (activeSprint) {
    const today = new Date();
    const startDate = new Date(activeSprint.startDate);
    const endDate = new Date(activeSprint.endDate);
    
    if (isBefore(today, startDate)) {
      sprintStatus = { color: 'bg-blue-400', label: 'Not Started' };
    } else if (isAfter(today, endDate)) {
      sprintStatus = { color: 'bg-red-400', label: 'Overdue' };
    } else {
      const totalDays = differenceInDays(endDate, startDate) || 1;
      const daysElapsed = differenceInDays(today, startDate) || 0;
      const progressPercentage = Math.min(Math.round((daysElapsed / totalDays) * 100), 100);
      
      if (progressPercentage > 75) {
        sprintStatus = { color: 'bg-amber-400', label: 'Ending Soon' };
      } else {
        sprintStatus = { color: 'bg-green-400', label: 'In Progress' };
      }
    }
  }

  // Count high priority tasks - ensure task is defined before checking priority
  const highPriorityTasks = project.tasks ? 
    project.tasks.filter(task => task && task.priority === 'high').length : 0;
  
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
      onClick={onClick}
    >
      <CardHeader className={cn("pb-2", isCompact && "pb-1")}>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{project.name}</CardTitle>
          {activeSprint && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className={`${sprintStatus?.color} text-white`}>
                    Sprint
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sprint: {activeSprint.name} ({sprintStatus?.label})</p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(activeSprint.startDate), 'MMM d')} - {format(new Date(activeSprint.endDate), 'MMM d')}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      <CardContent className={cn("pb-2", isCompact && "pb-1")}>
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
              <div className="font-medium">
                {project.tasks ? project.tasks.filter(t => t && t.status === 'todo').length : 0}
              </div>
            </div>
            <div className="bg-gray-100 rounded p-2 text-center">
              <div className="text-xs text-gray-500">In Progress</div>
              <div className="font-medium">
                {project.tasks ? project.tasks.filter(t => t && t.status === 'in-progress').length : 0}
              </div>
            </div>
            <div className="bg-gray-100 rounded p-2 text-center">
              <div className="text-xs text-gray-500">Done</div>
              <div className="font-medium">
                {project.tasks ? project.tasks.filter(t => t && t.status === 'done').length : 0}
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional metrics section */}
        <div className="mt-4 flex flex-wrap gap-2">
          {highPriorityTasks > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); navigate('/board?priority=high'); }}
              className="bg-red-50 text-red-600 rounded-full px-2 py-1 text-xs flex items-center hover:bg-red-100"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              {highPriorityTasks} high priority
            </button>
          )}
          {activeSprint && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); navigate(`/board?sprint=${activeSprint.id}`); }}
              className="bg-blue-50 text-blue-600 rounded-full px-2 py-1 text-xs flex items-center hover:bg-blue-100"
            >
              <Clock className="h-3 w-3 mr-1" />
              {format(new Date(activeSprint.endDate), 'MMM d')}
            </button>
          )}
          {progress < 100 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); navigate('/board?status=in-progress'); }}
              className="bg-amber-50 text-amber-700 rounded-full px-2 py-1 text-xs flex items-center hover:bg-amber-100"
            >
              <Clock className="h-3 w-3 mr-1" />
              Needs attention
            </button>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="flex -space-x-2">
          {assignees.slice(0, 3).map((user) => (
            <div key={user!.id} className="border-2 border-white rounded-full">
              <UserAvatar src={user!.avatar} name={user!.name} size="sm" />
            </div>
          ))}
          {assignees.length > 3 && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 border-2 border-white text-xs font-medium">
              +{assignees.length - 3}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500 hidden sm:flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {format(new Date(), 'MMM d, yyyy')}
          </div>
          {ctaLabel && (
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onCtaClick && onCtaClick(); }}>
              {ctaLabel}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
