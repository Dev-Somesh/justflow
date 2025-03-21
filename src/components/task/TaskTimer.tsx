
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, PauseCircle, StopCircle, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useProject } from '@/contexts/ProjectContext';

interface TaskTimerProps {
  projectId: string;
  taskId: string;
  onTimeRecorded?: () => void;
}

const TaskTimer: React.FC<TaskTimerProps> = ({ projectId, taskId, onTimeRecorded }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { addTimeRecord, tasks } = useProject();
  const { toast } = useToast();
  
  const task = tasks.find(t => t.id === taskId);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);
  
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleStart = () => {
    setIsRunning(true);
    setStartTime(new Date());
    toast({
      title: "Timer started",
      description: `Tracking time for: ${task?.title || 'Unknown task'}`,
    });
  };
  
  const handlePause = () => {
    setIsRunning(false);
    toast({
      title: "Timer paused",
      description: `You've tracked ${formatTime(elapsedTime)} so far`,
    });
  };
  
  const handleStop = () => {
    setIsRunning(false);
    
    if (startTime && elapsedTime > 0) {
      // Convert seconds to minutes for the API
      const durationInMinutes = Math.round(elapsedTime / 60);
      
      // Record the time
      addTimeRecord(projectId, taskId, {
        userId: 'user-1', // Default to first user for demo
        startTime: startTime.toISOString(),
        endTime: new Date().toISOString(),
        duration: durationInMinutes,
        note: `Time tracked: ${formatTime(elapsedTime)}`,
      });
      
      toast({
        title: "Time recorded",
        description: `Recorded ${formatTime(elapsedTime)} for this task`,
      });
      
      // Reset timer
      setElapsedTime(0);
      setStartTime(null);
      
      // Call callback if provided
      if (onTimeRecorded) {
        onTimeRecorded();
      }
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Task Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-center">
          <div className="text-3xl font-mono font-bold">{formatTime(elapsedTime)}</div>
          <div className="text-xs text-gray-500 mt-1">
            {isRunning ? "Timer running" : "Timer stopped"}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-2 pt-0">
        {!isRunning ? (
          <Button onClick={handleStart} variant="outline" size="sm" className="gap-1">
            <PlayCircle className="h-4 w-4 text-green-500" />
            Start
          </Button>
        ) : (
          <Button onClick={handlePause} variant="outline" size="sm" className="gap-1">
            <PauseCircle className="h-4 w-4 text-amber-500" />
            Pause
          </Button>
        )}
        <Button 
          onClick={handleStop} 
          variant="outline" 
          size="sm" 
          className="gap-1"
          disabled={!isRunning && elapsedTime === 0}
        >
          <StopCircle className="h-4 w-4 text-red-500" />
          Stop & Save
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskTimer;
