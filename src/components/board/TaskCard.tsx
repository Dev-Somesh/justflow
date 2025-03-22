
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Task, TaskPriority, useProject } from '@/contexts/ProjectContext';
import UserAvatar from '@/components/ui/UserAvatar';
import { MessageSquare, Calendar, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow, isPast, format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const priorityColors: Record<TaskPriority, string> = {
  high: 'bg-priority-high',
  medium: 'bg-priority-medium',
  low: 'bg-priority-low',
};

const priorityLabels: Record<TaskPriority, string> = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { getUserById } = useProject();
  const assignee = task.assigneeId ? getUserById(task.assigneeId) : undefined;
  
  // Calculate total time tracked for this task
  const totalTimeTracked = task.timeRecords.reduce((total, record) => total + record.duration, 0);
  const hours = Math.floor(totalTimeTracked / 60);
  const minutes = totalTimeTracked % 60;
  
  // Format due date and check if overdue
  const isDueDateSet = Boolean(task.dueDate);
  const isOverdue = isDueDateSet && isPast(new Date(task.dueDate!));
  
  // Calculate story points display
  const hasStoryPoints = task.storyPoints !== undefined && task.storyPoints > 0;
  
  return (
    <Card 
      className="mb-3 cursor-pointer hover:shadow-md transition-shadow border border-gray-200 group"
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2 mb-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`w-1 h-full min-h-[20px] rounded-full ${priorityColors[task.priority]}`} />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{priorityLabels[task.priority]}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-sm line-clamp-2">{task.title}</h3>
              {hasStoryPoints && (
                <Badge variant="outline" className="ml-1 bg-gray-100 text-gray-700 text-xs">
                  {task.storyPoints} {task.storyPoints === 1 ? 'point' : 'points'}
                </Badge>
              )}
            </div>
            {task.labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {task.labels.map(label => (
                  <Badge key={label.id} style={{ backgroundColor: label.color }} variant="outline" className="text-[10px] h-4 px-1 text-white">
                    {label.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 mt-2">{task.description}</p>
        
        {isDueDateSet && (
          <div className="flex items-center gap-1 text-xs mt-2">
            {isOverdue ? (
              <div className="flex items-center gap-1 text-red-500 font-medium">
                <AlertCircle size={12} />
                <span>Overdue: {format(new Date(task.dueDate!), 'MMM d')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-500">
                <Calendar size={12} />
                <span>Due: {format(new Date(task.dueDate!), 'MMM d')}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {assignee ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <UserAvatar src={assignee.avatar} name={assignee.name} size="sm" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{assignee.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="w-6 h-6 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 group-hover:border-gray-400 transition-colors">
              +
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-gray-500">
          {totalTimeTracked > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs">
                    <Clock size={12} />
                    <span>{hours}h {minutes}m</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Time tracked: {hours} hours and {minutes} minutes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {task.comments.length > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <MessageSquare size={12} />
              <span>{task.comments.length}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs">
            <Calendar size={12} />
            <span>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
