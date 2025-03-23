
import React, { useState, useEffect } from 'react';
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
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { TaskPriority, TaskStatus, useProject } from '@/contexts/ProjectContext';
import { CalendarIcon, Tag, Target, Sprint } from "lucide-react";
import { format } from "date-fns";

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
  const { users, availableLabels, addTask, getEpics, getSprints, addLabelToTask } = useProject();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeId, setAssigneeId] = useState<string | undefined>(undefined);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [storyPoints, setStoryPoints] = useState<number | undefined>(undefined);
  const [selectedEpicId, setSelectedEpicId] = useState<string | undefined>(undefined);
  const [selectedSprintId, setSelectedSprintId] = useState<string | undefined>(undefined);
  
  const epics = getEpics(projectId);
  const sprints = getSprints(projectId);
  
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setAssigneeId(undefined);
    setSelectedLabels([]);
    setDueDate(undefined);
    setStoryPoints(undefined);
    setSelectedEpicId(undefined);
    setSelectedSprintId(undefined);
  };
  
  const handleSubmit = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }
    
    // Create the new task
    const newTask = {
      id: `task-${Date.now()}`, // This will be overwritten by the context
      title,
      description,
      priority,
      status: initialStatus,
      assigneeId,
      dueDate: dueDate?.toISOString(),
      storyPoints,
      epicId: selectedEpicId,
      sprintId: selectedSprintId,
    };
    
    try {
      // Add the task
      addTask(projectId, newTask);
      
      // Add labels to the new task
      const newTaskId = `task-${Date.now()}`; // This is an approximation, the actual ID might be different
      selectedLabels.forEach(labelId => {
        addLabelToTask(projectId, newTaskId, labelId);
      });
      
      toast({
        title: "Success",
        description: "Task created successfully",
      });
      
      handleClose();
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleLabelToggle = (labelId: string) => {
    setSelectedLabels(prev => 
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const storyPointsOptions = [1, 2, 3, 5, 8, 13, 21];
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Due Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Set due date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Story Points</label>
              <Select
                value={storyPoints?.toString()}
                onValueChange={(value) => setStoryPoints(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select story points" />
                </SelectTrigger>
                <SelectContent>
                  {storyPointsOptions.map(points => (
                    <SelectItem key={points} value={points.toString()}>
                      {points}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Epic</label>
              <Select
                value={selectedEpicId}
                onValueChange={setSelectedEpicId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select epic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {epics.map(epic => (
                    <SelectItem key={epic.id} value={epic.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: epic.color }}
                        />
                        {epic.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Sprint</label>
              <Select
                value={selectedSprintId}
                onValueChange={setSelectedSprintId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sprint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {sprints.map(sprint => (
                    <SelectItem key={sprint.id} value={sprint.id}>
                      <div className="flex items-center gap-2">
                        {sprint.name} ({sprint.status})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Labels</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Tag className="mr-2 h-4 w-4" />
                  {selectedLabels.length > 0 
                    ? `${selectedLabels.length} label${selectedLabels.length > 1 ? 's' : ''} selected` 
                    : 'Select labels'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2">
                <div className="space-y-2">
                  {availableLabels.map(label => (
                    <div 
                      key={label.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                      onClick={() => handleLabelToggle(label.id)}
                    >
                      <div className="flex items-center h-4 w-4">
                        <input
                          type="checkbox"
                          checked={selectedLabels.includes(label.id)}
                          onChange={() => {}}
                          className="h-4 w-4"
                        />
                      </div>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: label.color }}
                      />
                      <span className="text-sm">{label.name}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            {selectedLabels.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedLabels.map(labelId => {
                  const label = availableLabels.find(l => l.id === labelId);
                  if (!label) return null;
                  return (
                    <Badge 
                      key={label.id} 
                      style={{ backgroundColor: label.color }} 
                      className="text-white"
                    >
                      {label.name}
                    </Badge>
                  );
                })}
              </div>
            )}
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
