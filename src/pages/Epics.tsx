
import React, { useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { useProject, Epic, Task } from '@/contexts/ProjectContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { format, differenceInDays } from 'date-fns';
import { CalendarRange, Plus, ChevronRight, Calendar, MoreVertical, Edit, Trash2, ArrowRightCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const EpicsPage = () => {
  const { 
    currentProject, 
    addEpic, 
    getEpics, 
    getTasksByEpic, 
    updateEpic, 
    assignTaskToEpic 
  } = useProject();
  
  const [isNewEpicModalOpen, setIsNewEpicModalOpen] = useState(false);
  const [isEditEpicModalOpen, setIsEditEpicModalOpen] = useState(false);
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);
  const [newEpicData, setNewEpicData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'active' as ('active' | 'completed'),
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  if (!currentProject) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">No Project Selected</h2>
            <p className="text-gray-500 mb-4">Please select a project from the dashboard</p>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  const epics = getEpics(currentProject.id);
  
  const handleCreateEpic = () => {
    if (!newEpicData.title) {
      toast({
        title: "Epic title is required",
        variant: "destructive",
      });
      return;
    }
    
    addEpic(currentProject.id, {
      title: newEpicData.title,
      description: newEpicData.description,
      status: newEpicData.status,
      startDate: newEpicData.startDate ? new Date(newEpicData.startDate).toISOString() : undefined,
      endDate: newEpicData.endDate ? new Date(newEpicData.endDate).toISOString() : undefined,
    });
    
    setNewEpicData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'active',
    });
    
    setIsNewEpicModalOpen(false);
    
    toast({
      title: "Epic created",
      description: "New epic has been created successfully",
    });
  };
  
  const handleEditEpic = () => {
    if (selectedEpic) {
      updateEpic(currentProject.id, selectedEpic.id, {
        title: newEpicData.title,
        description: newEpicData.description,
        status: newEpicData.status,
        startDate: newEpicData.startDate ? new Date(newEpicData.startDate).toISOString() : undefined,
        endDate: newEpicData.endDate ? new Date(newEpicData.endDate).toISOString() : undefined,
      });
      
      setIsEditEpicModalOpen(false);
      
      toast({
        title: "Epic updated",
        description: "Epic has been updated successfully",
      });
    }
  };
  
  const handleSelectEpicForEdit = (epic: Epic) => {
    setSelectedEpic(epic);
    setNewEpicData({
      title: epic.title,
      description: epic.description,
      startDate: epic.startDate ? new Date(epic.startDate).toISOString().substring(0, 10) : '',
      endDate: epic.endDate ? new Date(epic.endDate).toISOString().substring(0, 10) : '',
      status: epic.status,
    });
    setIsEditEpicModalOpen(true);
  };

  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Epics</h1>
          <p className="text-gray-500">Manage and track large user stories</p>
        </div>
        
        <Dialog open={isNewEpicModalOpen} onOpenChange={setIsNewEpicModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              New Epic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Epic</DialogTitle>
              <DialogDescription>
                Epics are large bodies of work that can be broken down into smaller tasks.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Epic title"
                  value={newEpicData.title}
                  onChange={(e) => setNewEpicData({ ...newEpicData, title: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the epic"
                  value={newEpicData.description}
                  onChange={(e) => setNewEpicData({ ...newEpicData, description: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newEpicData.startDate}
                    onChange={(e) => setNewEpicData({ ...newEpicData, startDate: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newEpicData.endDate}
                    onChange={(e) => setNewEpicData({ ...newEpicData, endDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={newEpicData.status}
                  onChange={(e) => setNewEpicData({ ...newEpicData, status: e.target.value as 'active' | 'completed' })}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewEpicModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateEpic}>Create Epic</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Epics</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {epics.length === 0 ? (
            <div className="text-center p-12 border rounded-md border-dashed">
              <CalendarRange className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Epics Created</h3>
              <p className="text-gray-500 mb-4">Create your first epic to organize larger bodies of work</p>
              <Button onClick={() => setIsNewEpicModalOpen(true)}>
                <Plus size={16} className="mr-2" />
                Create First Epic
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {epics.map((epic) => (
                <EpicCard 
                  key={epic.id} 
                  epic={epic} 
                  tasks={getTasksByEpic(currentProject.id, epic.id)} 
                  onEdit={() => handleSelectEpicForEdit(epic)}
                  projectId={currentProject.id}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {epics.filter(epic => epic.status === 'active').map((epic) => (
              <EpicCard 
                key={epic.id} 
                epic={epic} 
                tasks={getTasksByEpic(currentProject.id, epic.id)} 
                onEdit={() => handleSelectEpicForEdit(epic)}
                projectId={currentProject.id}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {epics.filter(epic => epic.status === 'completed').map((epic) => (
              <EpicCard 
                key={epic.id} 
                epic={epic} 
                tasks={getTasksByEpic(currentProject.id, epic.id)} 
                onEdit={() => handleSelectEpicForEdit(epic)}
                projectId={currentProject.id}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Edit Epic Dialog */}
      <Dialog open={isEditEpicModalOpen} onOpenChange={setIsEditEpicModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Epic</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                placeholder="Epic title"
                value={newEpicData.title}
                onChange={(e) => setNewEpicData({ ...newEpicData, title: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Describe the epic"
                value={newEpicData.description}
                onChange={(e) => setNewEpicData({ ...newEpicData, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={newEpicData.startDate}
                  onChange={(e) => setNewEpicData({ ...newEpicData, startDate: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={newEpicData.endDate}
                  onChange={(e) => setNewEpicData({ ...newEpicData, endDate: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <select 
                id="edit-status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={newEpicData.status}
                onChange={(e) => setNewEpicData({ ...newEpicData, status: e.target.value as 'active' | 'completed' })}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditEpicModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEditEpic}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

// Epic Card Component
interface EpicCardProps {
  epic: Epic;
  tasks: Task[];
  onEdit: () => void;
  projectId: string;
}

const EpicCard: React.FC<EpicCardProps> = ({ epic, tasks, onEdit, projectId }) => {
  const { assignTaskToEpic } = useProject();
  const navigate = useNavigate();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  
  const progress = tasks.length > 0
    ? (tasks.filter(task => task.status === 'done').length / tasks.length) * 100
    : 0;
  
  const handleNavigateToTasks = () => {
    navigate(`/board?epicId=${epic.id}`);
  };

  // This function is needed for the taskId/projectId check
  const handleAssignToEpic = (taskId: string) => {
    // Make sure we filter tasks by projectId to avoid issues
    if (taskId && projectId) {
      assignTaskToEpic(projectId, taskId, epic.id);
      setIsAssignDialogOpen(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{epic.title}</CardTitle>
          <div className="flex gap-2">
            <Badge variant={epic.status === 'active' ? 'secondary' : 'outline'}>
              {epic.status === 'active' ? 'Active' : 'Completed'}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit size={14} className="mr-2" />
                  Edit Epic
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAssignDialogOpen(true)}>
                  <ArrowRightCircle size={14} className="mr-2" />
                  Assign Tasks
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-500 mb-4">{epic.description}</p>
        
        {(epic.startDate || epic.endDate) && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Calendar size={14} className="mr-2" />
            {epic.startDate && (
              <span>{format(new Date(epic.startDate), 'MMM d, yyyy')}</span>
            )}
            {epic.startDate && epic.endDate && <span className="mx-2">-</span>}
            {epic.endDate && (
              <span>{format(new Date(epic.endDate), 'MMM d, yyyy')}</span>
            )}
            {epic.startDate && epic.endDate && (
              <Badge variant="outline" className="ml-2">
                {differenceInDays(new Date(epic.endDate), new Date(epic.startDate))} days
              </Badge>
            )}
          </div>
        )}
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Tasks ({tasks.length})</h4>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={handleNavigateToTasks}>
              View All
              <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
          <div className="mt-2">
            {tasks.length > 0 ? (
              <ScrollArea className="h-24">
                <div className="space-y-1">
                  {tasks.slice(0, 5).map((task) => (
                    <div 
                      key={task.id} 
                      className="text-sm p-2 rounded hover:bg-gray-100 cursor-pointer flex justify-between"
                      onClick={() => navigate(`/board?task=${task.id}`)}
                    >
                      <span className="truncate">{task.title}</span>
                      <Badge 
                        variant="outline" 
                        className={`ml-2 ${
                          task.status === 'done' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : task.status === 'in-progress' 
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-sm text-gray-500 text-center py-6">
                No tasks assigned to this epic
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={handleNavigateToTasks}
        >
          <Plus size={14} className="mr-2" />
          Add Tasks to Epic
        </Button>
      </CardFooter>
      
      {/* Task Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Tasks to Epic</DialogTitle>
            <DialogDescription>
              Select tasks to include in this epic.
            </DialogDescription>
          </DialogHeader>
          
          {/* Task assignment UI would go here */}
          <div className="text-sm text-gray-500 text-center py-6">
            To assign tasks to this epic, please use the task detail modal in the board view.
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EpicsPage;
