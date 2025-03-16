
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
import { TaskPriority, TaskStatus, useProject } from '@/contexts/ProjectContext';
import { toast } from "sonner";

interface NewTaskModalProps {
  projectId: string;
  initialStatus: TaskStatus;
  isOpen: boolean;
  onClose: () => void;
}

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const NewTaskModal: React.FC<NewTaskModalProps> = ({ 
  projectId, 
  initialStatus, 
  isOpen, 
  onClose 
}) => {
  const { users, addTask } = useProject();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeId, setAssigneeId] = useState<string | undefined>(undefined);
  
  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    addTask(projectId, {
      title,
      description,
      priority,
      status: initialStatus,
      assigneeId,
    });
    
    toast.success("Task created successfully");
    handleClose();
  };
  
  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setAssigneeId(undefined);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <Select 
                value={priority} 
                onValueChange={(value) => setPriority(value as TaskPriority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Assignee</label>
              <Select 
                value={assigneeId} 
                onValueChange={setAssigneeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskModal;
