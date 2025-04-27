import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProject } from '@/contexts/ProjectContext';
import { Play, Pause, Save, Timer } from 'lucide-react';
import { formatDuration } from '@/lib/timeUtils';

interface TaskTimerProps {
  projectId: string;
  taskId: string;
  onSave?: () => void;
}

const TaskTimer: React.FC<TaskTimerProps> = ({ projectId, taskId, onSave }) => {
  const { addTimeRecord, getUserById, selectedUser } = useProject();
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [note, setNote] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [savedTime, setSavedTime] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);
  
  const handleToggleTimer = () => {
    if (!isRunning) {
      setStartTime(new Date());
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };
  
  const handleSave = () => {
    if (!selectedUser) return;
    
    try {
      const durationInMinutes = Math.round(seconds / 60);
      setSavedTime(prevSaved => prevSaved + seconds);
      
      addTimeRecord(projectId, taskId, {
        userId: selectedUser,
        duration: durationInMinutes,
        note,
        createdAt: new Date().toISOString(),
      });
      
      setSeconds(0);
      setNote('');
      setIsRunning(false);
      if (onSave) onSave();
    } catch (error) {
      console.error('Failed to save time record:', error);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Timer className="h-4 w-4 text-gray-500" />
          <div className="text-2xl font-mono">{formatDuration(seconds)}</div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant={isRunning ? "destructive" : "default"}
            onClick={handleToggleTimer}
            size="sm"
            className="flex-1 sm:flex-none"
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Start
              </>
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleSave}
            disabled={seconds === 0}
            size="sm"
            className="flex-1 sm:flex-none"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
      
      <div>
        <Input
          placeholder="Add a note about what you worked on"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default TaskTimer;
