
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Task, TaskPriority, useProject } from '@/contexts/ProjectContext';
import UserAvatar from '@/components/ui/UserAvatar';
import { MessageSquare, Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow, isPast, format } from 'date-fns';
import { Badge } from "@/components/ui/badge";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const priorityColors: Record<TaskPriority, string> = {
  high: 'bg-priority-high',
  medium: 'bg-priority-medium',
  low: 'bg-priority-low',
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
  
  return (
    <Card 
      className="mb-3 cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2 mb-2">
          <div className={`w-1 h-full min-h-[20px] rounded-full ${priorityColors[task.priority]}`} />
          <div className="flex-1">
            <h3 className="font-medium text-sm line-clamp-2">{task.title}</h3>
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
          <div className={`flex items-center gap-1 text-xs mt-2 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
            <Calendar size={12} />
            <span>Due: {format(new Date(task.dueDate!), 'MMM d')}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {assignee && (
            <UserAvatar src={assignee.avatar} name={assignee.name} size="sm" />
          )}
        </div>
        <div className="flex items-center gap-3 text-gray-500">
          {totalTimeTracked > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <Clock size={12} />
              <span>{hours}h {minutes}m</span>
            </div>
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
