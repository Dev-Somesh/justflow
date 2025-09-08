import React from 'react';
import NewTaskModal from './NewTaskModal';
import { useToast } from '@/hooks/use-toast';

interface NewTaskModalWrapperProps {
  projectId: string;
  initialStatus: 'todo' | 'in-progress' | 'done';
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: () => void;
}

const NewTaskModalWrapper: React.FC<NewTaskModalWrapperProps> = ({
  projectId,
  initialStatus,
  isOpen,
  onClose,
  onTaskCreated
}) => {
  const { toast } = useToast();

  const handleClose = () => {
    onClose();
  };

  const handleSuccess = () => {
    toast({
      title: "Task created",
      description: "Your new task has been successfully created.",
    });
    onTaskCreated?.();
    onClose();
  };

  return (
    <NewTaskModal
      projectId={projectId}
      initialStatus={initialStatus}
      isOpen={isOpen}
      onClose={handleClose}
    />
  );
};

export default NewTaskModalWrapper;