
import React, { useState, useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { formatDuration } from '@/lib/timeUtils';
import { format } from 'date-fns';
import { Clock, Edit, Play, Save, Trash2, X } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import UserAvatar from '@/components/ui/UserAvatar';

interface TimeTrackerProps {
  projectId: string;
  taskId: string;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ projectId, taskId }) => {
  const { getTaskById, addTimeRecord, getUserById, updateTask } = useProject();
  const task = getTaskById(taskId);
  const [isAddingTime, setIsAddingTime] = useState(false);
  const [hours, setHours] = useState('1');
  const [minutes, setMinutes] = useState('0');
  const [note, setNote] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  
  if (!task) return null;
  
  // Calculate total time spent
  const totalMinutes = task.timeRecords.reduce((sum, record) => sum + record.duration, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  
  // Handle manual time entry
  const handleManualTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const hoursNum = parseInt(hours) || 0;
      const minutesNum = parseInt(minutes) || 0;
      const totalMinutes = (hoursNum * 60) + minutesNum;
      
      if (totalMinutes <= 0) {
        return; // Don't save zero time
      }
      
      // Add the time record
      addTimeRecord(projectId, taskId, {
        userId: 'user-1', // Using a default user for now
        duration: totalMinutes,
        note,
        createdAt: new Date().toISOString(),
      });
      
      // Reset the form
      setHours('1');
      setMinutes('0');
      setNote('');
      setIsAddingTime(false);
    } catch (error) {
      console.error('Error adding time record:', error);
    }
  };
  
  // Handle time record deletion
  const handleDeleteRecord = () => {
    if (!recordToDelete) return;
    
    try {
      // Filter out the record to delete
      const updatedRecords = task.timeRecords.filter(record => record.id !== recordToDelete);
      
      // Update the task with the new time records
      updateTask(projectId, taskId, {
        timeRecords: updatedRecords,
      });
      
      // Close the dialog
      setDeleteModalOpen(false);
      setRecordToDelete(null);
    } catch (error) {
      console.error('Error deleting time record:', error);
    }
  };
  
  // Handle time record deletion confirmation
  const confirmDelete = (recordId: string) => {
    setRecordToDelete(recordId);
    setDeleteModalOpen(true);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Time Tracking</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsAddingTime(!isAddingTime)}
        >
          {isAddingTime ? (
            <>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" />
              Log Time
            </>
          )}
        </Button>
      </div>
      
      {isAddingTime && (
        <form onSubmit={handleManualTimeSubmit} className="space-y-4 border rounded-md p-3 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[100px]">
              <label className="text-xs text-gray-500 mb-1 block">Hours</label>
              <Input
                type="number"
                min="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex-1 min-w-[100px]">
              <label className="text-xs text-gray-500 mb-1 block">Minutes</label>
              <Input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Note (optional)</label>
            <Input
              placeholder="What did you work on?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-9"
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" size="sm">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </form>
      )}
      
      <div className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-md">
        <Clock className="h-4 w-4 mr-2" />
        <span className="text-sm">Total time: </span>
        <span className="font-semibold ml-1">
          {totalHours}h {remainingMinutes}m
        </span>
      </div>
      
      {task.timeRecords.length > 0 ? (
        <div className="space-y-2 mt-2">
          {task.timeRecords.map((record) => {
            const user = getUserById(record.userId);
            const hours = Math.floor(record.duration / 60);
            const minutes = record.duration % 60;
            
            return (
              <div key={record.id} className="border rounded-md p-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {user && (
                      <UserAvatar 
                        src={user.avatar} 
                        name={user.name} 
                        size="sm" 
                      />
                    )}
                    <div>
                      <div className="font-medium">{user?.name || 'Unknown user'}</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(record.createdAt), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">
                      {hours}h {minutes}m
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 ml-2 text-red-500 hover:text-red-700"
                      onClick={() => confirmDelete(record.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {record.note && (
                  <div className="mt-2 text-sm text-gray-600">
                    {record.note}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-4">
          No time records yet. Start logging your time!
        </div>
      )}
      
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Time Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this time record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRecord} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TimeTracker;
