
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Task, TaskPriority, useProject } from '@/contexts/ProjectContext';
import Avatar from '@/components/ui/Avatar';
import { MessageSquare, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
          </div>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 mt-2">{task.description}</p>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {assignee && (
            <Avatar src={assignee.avatar} name={assignee.name} size="sm" />
          )}
        </div>
        <div className="flex items-center gap-3 text-gray-500">
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
