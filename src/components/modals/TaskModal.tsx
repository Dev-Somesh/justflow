
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import UserAvatar from '@/components/ui/UserAvatar';
import TimeTracker from '@/components/task/TimeTracker';
import { Task, TaskPriority, TaskStatus, Comment, TimeRecord, useProject } from '@/contexts/ProjectContext';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MessageSquare, Tag, Clock, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const { 
    projects, 
    users, 
    availableLabels,
    getUserById, 
    addComment, 
    updateTaskStatus,
    addLabelToTask,
    removeLabelFromTask,
    addTimeRecord,
    updateTaskDueDate
  } = useProject();
  
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  
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
  
  const handleAddLabel = (labelId: string) => {
    addLabelToTask(projectId, task.id, labelId);
  };
  
  const handleRemoveLabel = (labelId: string) => {
    removeLabelFromTask(projectId, task.id, labelId);
  };
  
  const handleAddTimeRecord = (timeRecord: Omit<TimeRecord, 'id'>) => {
    addTimeRecord(projectId, task.id, timeRecord);
  };
  
  const handleDueDateChange = (date: Date | undefined) => {
    updateTaskDueDate(projectId, task.id, date?.toISOString());
  };
  
  const priorityColor = {
    low: 'bg-priority-low',
    medium: 'bg-priority-medium',
    high: 'bg-priority-high',
  }[task.priority];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-5 rounded-sm ${priorityColor}`}></div>
              <span>{task.title}</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="timeTracking">Time Tracking</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
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
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <label className="text-sm font-medium mb-1 block text-gray-500">Created</label>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarIcon size={14} />
                    <span>{format(new Date(task.createdAt), 'PPp')}</span>
                  </div>
                </div>
                
                <div className="w-full md:w-1/2">
                  <label className="text-sm font-medium mb-1 block text-gray-500">Due Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left border border-input font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {task.dueDate ? (
                          format(new Date(task.dueDate), "PPP")
                        ) : (
                          <span>Set due date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-2 flex justify-between items-center border-b">
                        <span className="text-sm font-medium">Due date</span>
                        {task.dueDate && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDueDateChange(undefined)}
                            className="h-8 px-2"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                      <Calendar
                        mode="single"
                        selected={task.dueDate ? new Date(task.dueDate) : undefined}
                        onSelect={handleDueDateChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block text-gray-500">Labels</label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {task.labels.map(label => (
                    <Badge 
                      key={label.id} 
                      style={{ backgroundColor: label.color }} 
                      className="text-white"
                    >
                      {label.name}
                      <X 
                        className="ml-1 h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveLabel(label.id)} 
                      />
                    </Badge>
                  ))}
                  {task.labels.length === 0 && (
                    <span className="text-sm text-gray-500">No labels</span>
                  )}
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-1">
                      <Tag className="mr-2 h-3.5 w-3.5" />
                      Add Label
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2">
                    <div className="space-y-2">
                      {availableLabels
                        .filter(label => !task.labels.some(l => l.id === label.id))
                        .map(label => (
                          <div 
                            key={label.id}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                            onClick={() => handleAddLabel(label.id)}
                          >
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: label.color }}
                            />
                            <span className="text-sm">{label.name}</span>
                          </div>
                        ))}
                      {availableLabels.length === task.labels.length && (
                        <div className="text-sm text-gray-500 p-2">All labels added</div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block text-gray-500">Description</label>
                <div className="rounded-md border border-input bg-gray-50 p-3 text-sm">
                  {task.description || "No description provided."}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comments">
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
          </TabsContent>
          
          <TabsContent value="timeTracking">
            <TimeTracker
              taskId={task.id}
              projectId={projectId}
              userId={users[0].id} // Current user
              timeRecords={task.timeRecords}
              onAddTimeRecord={handleAddTimeRecord}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
