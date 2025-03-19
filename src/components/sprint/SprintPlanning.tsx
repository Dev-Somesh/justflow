
import React, { useState } from 'react';
import { useProject, Sprint, Task } from '@/contexts/ProjectContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  MoveRight,
  Check,
  X,
  AlertTriangle,
  CalendarRange
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface SprintPlanningProps {
  projectId: string;
  sprintId?: string; // If provided, edit mode, otherwise create mode
}

const SprintPlanning: React.FC<SprintPlanningProps> = ({ 
  projectId,
  sprintId
}) => {
  const { 
    getSprints, 
    getTasksBySprint, 
    getTasksByStatus, 
    getSprintCapacity, 
    addTaskToSprint,
    getUserById 
  } = useProject();
  
  const sprints = getSprints(projectId);
  const currentSprint = sprintId ? sprints.find(s => s.id === sprintId) : null;
  const sprintTasks = currentSprint ? getTasksBySprint(projectId, currentSprint.id) : [];
  
  const backlogTasks = getTasksByStatus(projectId, 'todo')
    .filter(task => !task.sprintId);
  
  // Sprint capacity info
  const capacity = currentSprint 
    ? getSprintCapacity(projectId, currentSprint.id)
    : { totalStoryPoints: 0, assignedStoryPoints: 0, remainingCapacity: 0 };
  
  // State for selected task to add to sprint
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  
  const handleAddToSprint = (taskId: string) => {
    if (!currentSprint) return;
    
    addTaskToSprint(projectId, taskId, currentSprint.id);
    setSelectedTaskIds(prev => prev.filter(id => id !== taskId));
  };
  
  const toggleTaskSelection = (taskId: string) => {
    setSelectedTaskIds(prev => 
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };
  
  const handleAddSelectedToSprint = () => {
    if (!currentSprint || selectedTaskIds.length === 0) return;
    
    selectedTaskIds.forEach(taskId => {
      addTaskToSprint(projectId, taskId, currentSprint.id);
    });
    
    setSelectedTaskIds([]);
  };
  
  const getStoryPointsSum = (tasks: Task[]) => {
    return tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
  };
  
  // Calculate if sprint is overloaded
  const isSprintOverloaded = capacity.assignedStoryPoints > capacity.totalStoryPoints;
  
  if (!currentSprint) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sprint Planning</CardTitle>
          <CardDescription>Select a sprint to start planning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sprints.map(sprint => (
              <Button key={sprint.id} variant="outline" className="w-full justify-start">
                <CalendarRange className="mr-2 h-4 w-4" />
                {sprint.name}
                <Badge 
                  variant={`sprint-${sprint.status}` as any} 
                  className="ml-auto"
                >
                  {sprint.status}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{currentSprint.name} Planning</CardTitle>
              <CardDescription>{currentSprint.goal}</CardDescription>
            </div>
            <Badge variant={`sprint-${currentSprint.status}` as any}>
              {currentSprint.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Duration:</span>
                <span className="text-sm">
                  {format(new Date(currentSprint.startDate), 'MMM dd')} - {format(new Date(currentSprint.endDate), 'MMM dd, yyyy')}
                </span>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span>Sprint Capacity</span>
                  <span className={isSprintOverloaded ? "text-red-500 font-bold" : ""}>
                    {capacity.assignedStoryPoints} / {capacity.totalStoryPoints} story points
                  </span>
                </div>
                <Progress 
                  value={(capacity.assignedStoryPoints / capacity.totalStoryPoints) * 100} 
                  className={`h-2 ${isSprintOverloaded ? "bg-red-200" : ""}`}
                  indicatorClassName={isSprintOverloaded ? "bg-red-500" : undefined}
                />
              </div>
              
              {isSprintOverloaded && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Sprint is overloaded by {capacity.assignedStoryPoints - capacity.totalStoryPoints} story points</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Backlog Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Backlog Tasks</CardTitle>
            <CardDescription>
              {backlogTasks.length} tasks • {getStoryPointsSum(backlogTasks)} story points
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto">
            {backlogTasks.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No tasks in the backlog
              </p>
            ) : (
              <div className="space-y-3">
                {backlogTasks.map(task => {
                  const isSelected = selectedTaskIds.includes(task.id);
                  
                  return (
                    <div 
                      key={task.id} 
                      className={`p-3 border rounded-md transition-colors ${
                        isSelected ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => toggleTaskSelection(task.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => toggleTaskSelection(task.id)}
                            className="rounded"
                          />
                          <span className="font-medium">{task.title}</span>
                        </div>
                        <Badge variant={`priority-${task.priority}` as any} className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                      
                      <div className="ml-6 text-sm text-gray-500 mb-2 line-clamp-2">
                        {task.description}
                      </div>
                      
                      <div className="ml-6 flex flex-wrap gap-2">
                        {task.storyPoints && (
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                            {task.storyPoints} points
                          </span>
                        )}
                        
                        {task.assigneeId && (
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {getUserById(task.assigneeId)?.name}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button 
              className="ml-auto" 
              onClick={handleAddSelectedToSprint}
              disabled={selectedTaskIds.length === 0}
            >
              Add Selected Tasks <MoveRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        {/* Sprint Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sprint Tasks</CardTitle>
            <CardDescription>
              {sprintTasks.length} tasks • {getStoryPointsSum(sprintTasks)} story points
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto">
            {sprintTasks.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No tasks added to this sprint yet
              </p>
            ) : (
              <div className="space-y-3">
                {sprintTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="p-3 border rounded-md bg-white"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-1 gap-2">
                        <span className="font-medium">{task.title}</span>
                      </div>
                      <div className="flex gap-1">
                        <Badge variant={`priority-${task.priority}` as any} className="text-xs">
                          {task.priority}
                        </Badge>
                        <Badge variant={`status-${task.status}` as any} className="text-xs">
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-2">
                      {task.description.substring(0, 100)}
                      {task.description.length > 100 ? '...' : ''}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {task.storyPoints && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          {task.storyPoints} points
                        </span>
                      )}
                      
                      {task.assigneeId && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          {getUserById(task.assigneeId)?.name}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SprintPlanning;
