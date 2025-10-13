
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import KanbanBoard from '@/components/board/KanbanBoard';
import TaskModal from '@/components/modals/TaskModal';
import NewTaskModal from '@/components/modals/NewTaskModal';
import { Button } from '@/components/ui/button';
import { useProject, TaskStatus } from '@/contexts/ProjectContext';
import { Plus, Filter, SlidersHorizontal, AlarmClockOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import SprintSelector from '@/components/sprint/SprintSelector';
import StoryPointsInfo from '@/components/dashboard/StoryPointsInfo';
import { useToast } from '@/hooks/use-toast';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const Board = () => {
  const { toast } = useToast();
  const { currentProject, tasks } = useProject();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('todo');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<{
    priority?: string;
    status?: string;
    assignee?: string;
    taskId?: string;
    sprintId?: string;
  }>({});
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Process URL query parameters for filtering
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      type BoardFilters = {
        priority?: string;
        status?: string;
        assignee?: string;
        taskId?: string;
        sprintId?: string;
      };
      const filters: BoardFilters = {};
      
      if (params.has('priority')) filters.priority = params.get('priority');
      if (params.has('status')) filters.status = params.get('status');
      if (params.has('assignee')) filters.assignee = params.get('assignee');
      if (params.has('sprint')) filters.sprintId = params.get('sprint');
      if (params.has('task')) {
        filters.taskId = params.get('task');
        const task = tasks.find(t => t.id === params.get('task'));
        if (task) {
          setSelectedTaskId(task.id);
          setIsTaskModalOpen(true);
        }
      }
      
      setActiveFilters(filters);
    } catch (err) {
      setError("Failed to load filters. Please refresh the page.");
    }
  }, [location.search, tasks]);
  
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
  
  const handleTaskClick = (taskId: string) => {
    try {
      setSelectedTaskId(taskId);
      setIsTaskModalOpen(true);
      
      // Update URL without triggering page reload
      const url = new URL(window.location.href);
      url.searchParams.set('task', taskId);
      window.history.pushState({}, '', url);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to open task details. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleAddTask = (status: TaskStatus) => {
    try {
      setNewTaskStatus(status);
      setIsNewTaskModalOpen(true);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to open the new task form. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTaskCreated = () => {
    setIsNewTaskModalOpen(false);
    toast({
      title: "Task created",
      description: "Your new task has been successfully created.",
    });
  };
  
  const handleCloseTaskModal = () => {
    try {
      setIsTaskModalOpen(false);
      
      // Remove task parameter from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('task');
      window.history.pushState({}, '', url);
    } catch (err) {
      // Still try to close the modal even if URL update fails
      setIsTaskModalOpen(false);
    }
  };
  
  const handleSprintChange = (sprintId: string | null) => {
    // Update URL with sprint filter
    const url = new URL(window.location.href);
    if (sprintId) {
      url.searchParams.set('sprint', sprintId);
    } else {
      url.searchParams.delete('sprint');
    }
    window.history.pushState({}, '', url);
    
    // Update filters
    setActiveFilters(prev => ({
      ...prev,
      sprintId: sprintId || undefined
    }));
  };
  
  const clearFilters = () => {
    navigate('/board');
    setActiveFilters({});
  };
  
  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{currentProject.name}</h1>
          <p className="text-gray-500">{currentProject.description}</p>
        </div>
        <div className="flex gap-2">
          {Object.keys(activeFilters).length > 0 && (
            <Button variant="outline" onClick={clearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
          <Button onClick={() => handleAddTask('todo')}>
            <Plus size={16} className="mr-2" />
            Add Task
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlarmClockOff className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3">
          <KanbanBoard 
            projectId={currentProject.id} 
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
            filters={activeFilters}
          />
        </div>
        <div className="space-y-6">
          <SprintSelector 
            projectId={currentProject.id}
            onSprintChange={handleSprintChange}
            selectedSprintId={activeFilters.sprintId}
          />
          <StoryPointsInfo />
        </div>
      </div>
      
      {/* Task Details Modal */}
      <TaskModal 
        projectId={currentProject.id}
        taskId={selectedTaskId}
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
      />
      
      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <ErrorBoundary>
          <NewTaskModal 
            projectId={currentProject.id}
            initialStatus={newTaskStatus}
            isOpen={isNewTaskModalOpen}
            onClose={() => setIsNewTaskModalOpen(false)}
            onSuccess={handleTaskCreated}
          />
        </ErrorBoundary>
      )}
    </AppLayout>
  );
};

export default Board;
