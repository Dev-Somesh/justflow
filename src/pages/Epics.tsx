
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
  Star
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

const Epics = () => {
  const { currentProject, getEpics, getTasksByEpic, addEpic } = useProject();
  const [openEpics, setOpenEpics] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEpic, setNewEpic] = useState({
    name: '',
    description: '',
    color: '#8B5CF6',
    status: 'active' as const
  });
  
  const epics = currentProject ? getEpics(currentProject.id) : [];
  
  const toggleEpic = (epicId: string) => {
    setOpenEpics(prev => 
      prev.includes(epicId) 
        ? prev.filter(id => id !== epicId) 
        : [...prev, epicId]
    );
  };
  
  const handleSubmitNewEpic = () => {
    if (!currentProject || !newEpic.name) return;
    
    addEpic(currentProject.id, newEpic);
    setNewEpic({
      name: '',
      description: '',
      color: '#8B5CF6',
      status: 'active'
    });
    setIsDialogOpen(false);
  };
  
  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Epics & Roadmap</h1>
          <p className="text-gray-500">Manage and organize work by epic</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitNewEpic}>
                Create Epic
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
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
            <Button onClick={() => setIsDialogOpen(true)}>
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
                      <p className="mb-4 text-gray-600">{epic.description}</p>
                      
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Tasks ({totalTasks})</h4>
                        {epicTasks.length === 0 ? (
                          <p className="text-gray-500 text-sm">No tasks in this epic yet</p>
                        ) : (
                          <div className="space-y-2">
                            {epicTasks.map((task) => (
                              <div 
                                key={task.id} 
                                className="p-3 bg-gray-50 rounded-md flex justify-between items-center"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
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
                                  <p className="font-medium mt-1">{task.title}</p>
                                </div>
                                {task.dueDate && (
                                  <div className="text-xs text-gray-500">
                                    Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <Button variant="outline" size="sm" className="mt-4">
                          <Plus size={14} className="mr-1" />
                          Add Task to Epic
                        </Button>
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
