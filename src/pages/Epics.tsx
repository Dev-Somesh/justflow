import React, { useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { useProject, Epic, Task } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  CalendarDays,
  Star,
  Edit,
  Check,
  X,
  Clock,
  Users,
  Tag
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

const Epics = () => {
  const { 
    currentProject, 
    getEpics, 
    getTasksByEpic, 
    addEpic, 
    updateEpic, 
    tasks: allTasks, 
    addTaskToEpic, 
    filterTasks 
  } = useProject();
  
  const [openEpics, setOpenEpics] = useState<string[]>([]);
  const [isNewEpicDialogOpen, setIsNewEpicDialogOpen] = useState(false);
  const [isEditEpicDialogOpen, setIsEditEpicDialogOpen] = useState(false);
  const [isAssignTaskDialogOpen, setIsAssignTaskDialogOpen] = useState(false);
  const [currentEditingEpic, setCurrentEditingEpic] = useState<Epic | null>(null);
  const [currentEpicForTasks, setCurrentEpicForTasks] = useState<string>('');
  
  const [newEpic, setNewEpic] = useState({
    name: '',
    description: '',
    color: '#8B5CF6',
    status: 'active' as const
  });
  
  const [editEpicData, setEditEpicData] = useState({
    name: '',
    description: '',
    color: '',
    status: 'active' as 'active' | 'completed'
  });
  
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  
  const epics = currentProject ? getEpics(currentProject.id) : [];
  
  const toggleEpic = (epicId: string) => {
    setOpenEpics(prev => 
      prev.includes(epicId) 
        ? prev.filter(id => id !== epicId) 
        : [...prev, epicId]
    );
  };
  
  const handleSubmitNewEpic = () => {
    if (!currentProject || !newEpic.name) {
      toast({
        title: "Error",
        description: "Epic name is required",
        variant: "destructive"
      });
      return;
    }
    
    addEpic(currentProject.id, newEpic);
    setNewEpic({
      name: '',
      description: '',
      color: '#8B5CF6',
      status: 'active'
    });
    setIsNewEpicDialogOpen(false);
    
    toast({
      title: "Epic created",
      description: "New epic has been created successfully"
    });
  };
  
  const handleEditEpic = (epic: Epic) => {
    setCurrentEditingEpic(epic);
    setEditEpicData({
      name: epic.name,
      description: epic.description,
      color: epic.color,
      status: epic.status
    });
    setIsEditEpicDialogOpen(true);
  };
  
  const handleUpdateEpic = () => {
    if (!currentProject || !currentEditingEpic || !editEpicData.name) {
      toast({
        title: "Error",
        description: "Epic name is required",
        variant: "destructive"
      });
      return;
    }
    
    updateEpic(currentProject.id, currentEditingEpic.id, editEpicData);
    setIsEditEpicDialogOpen(false);
    setCurrentEditingEpic(null);
    
    toast({
      title: "Epic updated",
      description: "Epic has been updated successfully"
    });
  };
  
  const handleOpenAssignTaskDialog = (epicId: string) => {
    setCurrentEpicForTasks(epicId);
    setSelectedTaskId('');
    setIsAssignTaskDialogOpen(true);
  };
  
  const handleAssignTask = () => {
    if (!currentProject || !selectedTaskId || !currentEpicForTasks) {
      toast({
        title: "Error",
        description: "Please select a task to assign",
        variant: "destructive"
      });
      return;
    }
    
    addTaskToEpic(currentProject.id, selectedTaskId, currentEpicForTasks);
    setIsAssignTaskDialogOpen(false);
    
    toast({
      title: "Task assigned",
      description: "Task has been assigned to the epic successfully"
    });
  };
  
  const getAvailableTasks = () => {
    if (!currentProject) return [];
    
    return allTasks.filter(task => 
      task.epicId !== currentEpicForTasks && 
      task.projectId === currentProject.id
    );
  };
  
  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Epics & Roadmap</h1>
          <p className="text-gray-500">Manage and organize work by epic</p>
        </div>
        <Dialog open={isNewEpicDialogOpen} onOpenChange={setIsNewEpicDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              New Epic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Epic</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name
                </label>
                <Input
                  id="name"
                  value={newEpic.name}
                  onChange={(e) => setNewEpic({ ...newEpic, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="description" className="text-right self-start">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={newEpic.description}
                  onChange={(e) => setNewEpic({ ...newEpic, description: e.target.value })}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="color" className="text-right">
                  Color
                </label>
                <div className="col-span-3 flex items-center gap-2">
                  <input
                    type="color"
                    id="color"
                    value={newEpic.color}
                    onChange={(e) => setNewEpic({ ...newEpic, color: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <span className="text-sm">{newEpic.color}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="status" className="text-right">
                  Status
                </label>
                <Select
                  value={newEpic.status}
                  onValueChange={(value) => setNewEpic({ ...newEpic, status: value as 'active' | 'completed' })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewEpicDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitNewEpic}>
                Create Epic
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Dialog open={isEditEpicDialogOpen} onOpenChange={setIsEditEpicDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Epic</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-name" className="text-right">
                Name
              </label>
              <Input
                id="edit-name"
                value={editEpicData.name}
                onChange={(e) => setEditEpicData({ ...editEpicData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-description" className="text-right self-start">
                Description
              </label>
              <Textarea
                id="edit-description"
                value={editEpicData.description}
                onChange={(e) => setEditEpicData({ ...editEpicData, description: e.target.value })}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-color" className="text-right">
                Color
              </label>
              <div className="col-span-3 flex items-center gap-2">
                <input
                  type="color"
                  id="edit-color"
                  value={editEpicData.color}
                  onChange={(e) => setEditEpicData({ ...editEpicData, color: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <span className="text-sm">{editEpicData.color}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-status" className="text-right">
                Status
              </label>
              <Select
                value={editEpicData.status}
                onValueChange={(value: 'active' | 'completed') => setEditEpicData({ ...editEpicData, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditEpicDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEpic}>
              Update Epic
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAssignTaskDialogOpen} onOpenChange={setIsAssignTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Task to Epic</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <label htmlFor="task-select" className="block text-sm font-medium mb-1">
                Select Task
              </label>
              <Select
                value={selectedTaskId}
                onValueChange={setSelectedTaskId}
              >
                <SelectTrigger id="task-select">
                  <SelectValue placeholder="Select a task" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableTasks().map(task => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedTaskId && getAvailableTasks().find(t => t.id === selectedTaskId) && (
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium">Task Details</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {getAvailableTasks().find(t => t.id === selectedTaskId)?.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={`status-${getAvailableTasks().find(t => t.id === selectedTaskId)?.status}` as any}>
                    {getAvailableTasks().find(t => t.id === selectedTaskId)?.status}
                  </Badge>
                  <Badge variant={`priority-${getAvailableTasks().find(t => t.id === selectedTaskId)?.priority}` as any}>
                    {getAvailableTasks().find(t => t.id === selectedTaskId)?.priority}
                  </Badge>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignTask} disabled={!selectedTaskId}>
              Assign Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {!currentProject ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No project selected</p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Dashboard
          </Button>
        </div>
      ) : epics.length === 0 ? (
        <Card className="border-dashed border-2 p-10">
          <div className="text-center">
            <h3 className="font-medium text-lg mb-2">No epics yet</h3>
            <p className="text-gray-500 mb-4">Create your first epic to start organizing work</p>
            <Button onClick={() => setIsNewEpicDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              Create First Epic
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {epics.map((epic) => {
            const epicTasks = currentProject ? getTasksByEpic(currentProject.id, epic.id) : [];
            const isOpen = openEpics.includes(epic.id);
            const completedTasks = epicTasks.filter(t => t.status === 'done').length;
            const totalTasks = epicTasks.length;
            const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            const totalStoryPoints = epicTasks.reduce((total, task) => total + (task.storyPoints || 0), 0);
            const completedStoryPoints = epicTasks
              .filter(task => task.status === 'done')
              .reduce((total, task) => total + (task.storyPoints || 0), 0);
            
            return (
              <Card key={epic.id}>
                <Collapsible open={isOpen} onOpenChange={() => toggleEpic(epic.id)}>
                  <div className="border-b border-gray-100">
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: epic.color }}
                          />
                          <h3 className="font-medium">{epic.name}</h3>
                          <Badge variant="outline" className="ml-2">
                            {epic.status === 'active' ? 'Active' : 'Completed'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-gray-500 mr-2">
                            <CalendarDays size={14} />
                            <span>{format(new Date(epic.createdAt), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500 mr-2">
                            <Star size={14} />
                            <span>{completedStoryPoints}/{totalStoryPoints} pts</span>
                          </div>
                          <div className="w-20 bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-green-500 h-2.5 rounded-full" 
                              style={{ width: `${completionPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">{completionPercentage}%</span>
                          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-4">
                        <p className="text-gray-600">{epic.description}</p>
                        <Button variant="ghost" size="sm" onClick={() => handleEditEpic(epic)}>
                          <Edit size={14} className="mr-1" />
                          Edit Epic
                        </Button>
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Tasks ({totalTasks})</h4>
                          <Button variant="outline" size="sm" onClick={() => handleOpenAssignTaskDialog(epic.id)}>
                            <Plus size={14} className="mr-1" />
                            Add Task to Epic
                          </Button>
                        </div>
                        
                        {epicTasks.length === 0 ? (
                          <p className="text-gray-500 text-sm p-4 text-center bg-gray-50 rounded-md">No tasks in this epic yet</p>
                        ) : (
                          <div className="space-y-2">
                            {epicTasks.map((task) => (
                              <div 
                                key={task.id} 
                                className="p-3 bg-gray-50 rounded-md"
                              >
                                <div className="flex justify-between">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge 
                                      variant={`status-${task.status}` as any} 
                                      className="text-xs"
                                    >
                                      {task.status}
                                    </Badge>
                                    <Badge 
                                      variant={`priority-${task.priority}` as any} 
                                      className="text-xs"
                                    >
                                      {task.priority}
                                    </Badge>
                                    {task.storyPoints && (
                                      <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">
                                        {task.storyPoints} pts
                                      </span>
                                    )}
                                  </div>
                                  {task.dueDate && (
                                    <div className="flex items-center text-xs text-gray-500">
                                      <Clock size={12} className="mr-1" />
                                      {format(new Date(task.dueDate), 'MMM d, yyyy')}
                                    </div>
                                  )}
                                </div>
                                <h5 className="font-medium mb-1">{task.title}</h5>
                                <p className="text-sm text-gray-600 mb-2">{task.description.substring(0, 100)}{task.description.length > 100 && '...'}</p>
                                
                                <div className="flex justify-between items-center mt-2">
                                  {task.assigneeId ? (
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <Users size={12} />
                                      <span>{task.assigneeId}</span>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-gray-400">Unassigned</span>
                                  )}
                                  
                                  {task.labels && task.labels.length > 0 && (
                                    <div className="flex gap-1">
                                      {task.labels.map(label => (
                                        <div 
                                          key={label.id} 
                                          className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded"
                                          style={{ backgroundColor: `${label.color}20` }}
                                        >
                                          <div 
                                            className="w-2 h-2 rounded-full" 
                                            style={{ backgroundColor: label.color }}
                                          />
                                          <span>{label.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};

export default Epics;
