
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { useProject, Epic } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { AlignLeft, Calendar, Plus } from 'lucide-react';

const Epics: React.FC = () => {
  const { 
    currentProject, 
    addEpic, 
    getEpics, 
    getTasksByEpic, 
    updateEpic, 
    assignTaskToEpic 
  } = useProject();
  const [epics, setEpics] = useState<Epic[]>([]);
  
  useEffect(() => {
    if (currentProject) {
      setEpics(getEpics(currentProject.id));
    }
  }, [currentProject, getEpics]);

  // Function to handle creating a new epic (to be implemented)
  const handleCreateEpic = () => {
    if (!currentProject) return;
    
    // This is just a placeholder
    const newEpic: Omit<Epic, 'id'> = {
      name: 'New Epic',
      description: 'Description for the new epic',
      projectId: currentProject.id,
      status: 'planning',
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      taskIds: [],
      color: '#8884d8',
    };
    
    addEpic(currentProject.id, newEpic);
  };

  // If no project is selected
  if (!currentProject) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">No Project Selected</h2>
            <p className="text-gray-500 mb-4">Please select a project first</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Epics</h1>
          <p className="text-gray-500">Manage and track your project epics</p>
        </div>
        <Button onClick={handleCreateEpic}>
          <Plus className="h-4 w-4 mr-2" />
          New Epic
        </Button>
      </div>

      {epics.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <AlignLeft className="h-10 w-10 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">No Epics Yet</h3>
            <p className="text-center text-gray-500 mb-4">
              Epics help you organize related tasks into larger initiatives
            </p>
            <Button onClick={handleCreateEpic}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Epic
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {epics.map(epic => {
            const epicTasks = getTasksByEpic(epic.id);
            const completedTasks = epicTasks.filter(task => task.status === 'done').length;
            const progress = epicTasks.length > 0 
              ? Math.round((completedTasks / epicTasks.length) * 100) 
              : 0;
            
            return (
              <Card key={epic.id} className="overflow-hidden">
                <div 
                  className="h-2" 
                  style={{ backgroundColor: epic.color }}
                ></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{epic.name}</CardTitle>
                    <Badge>{epic.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{epic.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress: {progress}%</span>
                      <span>
                        {completedTasks}/{epicTasks.length} tasks
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {format(new Date(epic.startDate), 'MMM d')} - {format(new Date(epic.endDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};

export default Epics;
