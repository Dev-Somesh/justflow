
import React, { useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import KanbanBoard from '@/components/board/KanbanBoard';
import TaskModal from '@/components/modals/TaskModal';
import NewTaskModal from '@/components/modals/NewTaskModal';
import { Button } from '@/components/ui/button';
import { useProject, TaskStatus } from '@/contexts/ProjectContext';
import { Plus } from 'lucide-react';

const Board = () => {
  const { currentProject } = useProject();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('todo');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  
  if (!currentProject) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">No Project Selected</h2>
            <p className="text-gray-500 mb-4">Please select a project from the dashboard</p>
            <Button onClick={() => window.location.href = '/'}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskModalOpen(true);
  };
  
  const handleAddTask = (status: TaskStatus) => {
    setNewTaskStatus(status);
    setIsNewTaskModalOpen(true);
  };
  
  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{currentProject.name}</h1>
          <p className="text-gray-500">{currentProject.description}</p>
        </div>
        <Button onClick={() => handleAddTask('todo')}>
          <Plus size={16} className="mr-2" />
          Add Task
        </Button>
      </div>
      
      <KanbanBoard 
        projectId={currentProject.id} 
        onTaskClick={handleTaskClick}
        onAddTask={handleAddTask}
      />
      
      {/* Task Details Modal */}
      <TaskModal 
        projectId={currentProject.id}
        taskId={selectedTaskId}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
      
      {/* New Task Modal */}
      <NewTaskModal 
        projectId={currentProject.id}
        initialStatus={newTaskStatus}
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
      />
    </AppLayout>
  );
};

export default Board;
