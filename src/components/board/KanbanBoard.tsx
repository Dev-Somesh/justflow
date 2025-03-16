
import React, { useState } from 'react';
import { useProject, TaskStatus, TaskFilters } from '@/contexts/ProjectContext';
import TaskCard from './TaskCard';
import TaskFiltersComponent from './TaskFilters';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KanbanBoardProps {
  projectId: string;
  onTaskClick: (taskId: string) => void;
  onAddTask: (status: TaskStatus) => void;
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
  onAddTask 
}) => {
  const { getTasksByStatus, updateTaskStatus, filterTasks } = useProject();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<TaskFilters>({});

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

    // Update task status
    updateTaskStatus(
      projectId,
      draggableId,
      destination.droppableId as TaskStatus
    );
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
                      {tasks.map((task, index) => (
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
                      ))}
                      {tasks.length === 0 && (
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
