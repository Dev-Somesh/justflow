
import React, { useState } from 'react';
import { useProject, TaskStatus, TaskFilters, TaskPriority } from '@/contexts/ProjectContext';
import TaskCard from './TaskCard';
import TaskFiltersComponent from './TaskFilters';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, RefreshCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface KanbanBoardProps {
  projectId: string;
  onTaskClick: (taskId: string) => void;
  onAddTask: (status: TaskStatus) => void;
  filters?: {
    priority?: string;
    status?: string;
    assignee?: string;
    taskId?: string;
  };
}

interface ColumnConfig {
  id: TaskStatus;
  title: string;
  color: string;
}

const columns: ColumnConfig[] = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-200' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-plane-blue' },
  { id: 'done', title: 'Done', color: 'bg-green-500' },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  projectId, 
  onTaskClick,
  onAddTask,
  filters = {} 
}) => {
  const { toast } = useToast();
  const { getTasksByStatus, updateTaskStatus, filterTasks } = useProject();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<TaskFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Apply external filters when they change
  React.useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const newFilters: TaskFilters = {};
      
      // Validate the priority is a valid TaskPriority before setting it
      if (filters.priority && ['low', 'medium', 'high'].includes(filters.priority)) {
        newFilters.priority = [filters.priority as TaskPriority];
      }
      
      if (filters.status) newFilters.status = [filters.status as TaskStatus];
      if (filters.assignee) newFilters.assigneeId = [filters.assignee];
      
      setActiveFilters(newFilters);
    } else {
      setActiveFilters({});
    }
  }, [filters]);

  const handleFilterChange = (query: string, filters: TaskFilters) => {
    setSearchQuery(query);
    setActiveFilters(filters);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Show loading feedback
    setIsLoading(true);

    try {
      // Update task status
      updateTaskStatus(
        projectId,
        draggableId,
        destination.droppableId as TaskStatus
      );
      
      // Show success toast
      toast({
        title: "Task updated",
        description: `Task moved to ${destination.droppableId.replace('-', ' ')}`,
      });
    } catch (error) {
      console.error("Failed to update task status:", error);
      setHasError(true);
      
      // Show error toast
      toast({
        title: "Failed to update task",
        description: "There was an error updating the task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    // Refresh data by triggering a re-render
    setActiveFilters({...activeFilters});
    
    toast({
      title: "Refreshing board",
      description: "Attempting to reload board data...",
    });
  };

  // Get tasks for each column, applying filters if any
  const getFilteredTasksByStatus = (status: TaskStatus) => {
    if (searchQuery || Object.keys(activeFilters).length > 0) {
      return filterTasks(projectId, searchQuery, { 
        ...activeFilters, 
        status: [status] 
      });
    }
    return getTasksByStatus(projectId, status);
  };

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Failed to load board data</h3>
        <p className="text-gray-500 mb-4 text-center max-w-md">
          There was an error loading the board. This could be due to a connection issue or server error.
        </p>
        <Button onClick={handleRetry} className="flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <TaskFiltersComponent 
        projectId={projectId} 
        onFilterChange={handleFilterChange} 
      />
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => {
            const tasks = getFilteredTasksByStatus(column.id);
            
            return (
              <div key={column.id} className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                    <h3 className="font-medium">{column.title}</h3>
                    <span className="text-sm text-gray-500 ml-1">({tasks.length})</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => onAddTask(column.id)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="bg-gray-50 rounded-md p-3 min-h-[300px] flex-1"
                    >
                      {isLoading ? (
                        // Loading skeletons
                        [...Array(3)].map((_, index) => (
                          <Card key={`skeleton-${index}`} className="mb-3 border border-gray-200">
                            <CardContent className="p-3">
                              <div className="flex items-start gap-2 mb-2">
                                <Skeleton className="w-1 h-16 rounded-full" />
                                <div className="flex-1">
                                  <Skeleton className="h-4 w-3/4 mb-2" />
                                  <Skeleton className="h-4 w-1/2" />
                                </div>
                              </div>
                              <Skeleton className="h-3 w-full mt-2" />
                              <Skeleton className="h-3 w-4/5 mt-1" />
                              
                              <div className="flex justify-between items-center mt-4">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <div className="flex gap-2">
                                  <Skeleton className="h-4 w-10" />
                                  <Skeleton className="h-4 w-8" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskCard 
                                  task={task} 
                                  onClick={() => onTaskClick(task.id)} 
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {!isLoading && tasks.length === 0 && (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-sm text-gray-400">No tasks</p>
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </>
  );
};

export default KanbanBoard;
