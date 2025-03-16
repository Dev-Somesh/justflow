
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from '@/components/ui/UserAvatar';
import { Task, TaskPriority, TaskStatus, Comment, useProject } from '@/contexts/ProjectContext';
import { format } from 'date-fns';
import { Calendar, MessageSquare } from 'lucide-react';

interface TaskModalProps {
  projectId: string;
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const TaskModal: React.FC<TaskModalProps> = ({ projectId, taskId, isOpen, onClose }) => {
  const { projects, users, getUserById, addComment, updateTaskStatus } = useProject();
  const [newComment, setNewComment] = useState('');
  
  const project = projects.find(p => p.id === projectId);
  const task = project?.tasks.find(t => t.id === taskId);
  
  if (!task || !project) {
    return null;
  }
  
  const assignee = task.assigneeId ? getUserById(task.assigneeId) : undefined;
  
  const handleStatusChange = (status: string) => {
    updateTaskStatus(projectId, task.id, status as TaskStatus);
  };
  
  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    
    addComment(projectId, task.id, {
      userId: users[0].id, // Current user
      content: newComment,
    });
    
    setNewComment('');
  };
  
  const priorityColor = {
    low: 'bg-priority-low',
    medium: 'bg-priority-medium',
    high: 'bg-priority-high',
  }[task.priority];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-5 rounded-sm ${priorityColor}`}></div>
              <span>{task.title}</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Task Details */}
          <div className="grid gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <label className="text-sm font-medium mb-1 block text-gray-500">Status</label>
                <Select 
                  defaultValue={task.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/3">
                <label className="text-sm font-medium mb-1 block text-gray-500">Priority</label>
                <div className="rounded-md border border-input px-3 py-2 text-sm flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${priorityColor}`}></div>
                  <span className="capitalize">{task.priority}</span>
                </div>
              </div>
              
              <div className="w-full md:w-1/3">
                <label className="text-sm font-medium mb-1 block text-gray-500">Assignee</label>
                <div className="rounded-md border border-input px-3 py-1 flex items-center gap-2">
                  {assignee ? (
                    <>
                      <UserAvatar src={assignee.avatar} name={assignee.name} size="sm" />
                      <span className="text-sm truncate">{assignee.name}</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">Unassigned</span>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-500">Created</label>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={14} />
                <span>{format(new Date(task.createdAt), 'PPp')}</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-500">Description</label>
              <div className="rounded-md border border-input bg-gray-50 p-3 text-sm">
                {task.description || "No description provided."}
              </div>
            </div>
          </div>
          
          {/* Comments */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={16} />
              <h3 className="font-medium">Comments</h3>
            </div>
            
            <div className="space-y-4 mb-4">
              {task.comments.length === 0 ? (
                <p className="text-sm text-gray-500">No comments yet.</p>
              ) : (
                task.comments.map((comment: Comment) => {
                  const commentUser = getUserById(comment.userId);
                  return (
                    <div key={comment.id} className="flex gap-3">
                      <UserAvatar 
                        src={commentUser?.avatar} 
                        name={commentUser?.name || 'User'} 
                        size="sm" 
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{commentUser?.name}</span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(comment.createdAt), 'PPp')}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="flex gap-3">
              <UserAvatar 
                src={users[0].avatar} 
                name={users[0].name} 
                size="sm" 
              />
              <div className="flex-1">
                <Textarea
                  placeholder="Add a comment..."
                  className="min-h-[80px]"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="mt-2 flex justify-end">
                  <Button onClick={handleAddComment}>Comment</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
