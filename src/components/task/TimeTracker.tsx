
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, StopCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TimeRecord } from '@/contexts/ProjectContext';
import { formatDistance } from 'date-fns';

interface TimeTrackerProps {
  taskId: string;
  projectId: string;
  userId: string;
  timeRecords: TimeRecord[];
  onAddTimeRecord: (record: Omit<TimeRecord, 'id'>) => void;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ 
  taskId, 
  projectId, 
  userId, 
  timeRecords,
  onAddTimeRecord 
}) => {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0); // seconds
  const [note, setNote] = useState('');
  
  // Calculate total time spent
  const totalTimeInMinutes = timeRecords.reduce((total, record) => total + record.duration, 0);
  const totalHours = Math.floor(totalTimeInMinutes / 60);
  const totalMinutes = totalTimeInMinutes % 60;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(diffInSeconds);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, startTime]);
  
  const formatElapsedTime = () => {
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleStartTracking = () => {
    const now = new Date();
    setStartTime(now);
    setIsTracking(true);
    setElapsedTime(0);
  };
  
  const handlePauseTracking = () => {
    setIsTracking(false);
  };
  
  const handleResumeTracking = () => {
    if (startTime) {
      const pausedDuration = Math.floor(elapsedTime);
      const adjustedStartTime = new Date();
      adjustedStartTime.setSeconds(adjustedStartTime.getSeconds() - pausedDuration);
      setStartTime(adjustedStartTime);
      setIsTracking(true);
    }
  };
  
  const handleStopTracking = () => {
    if (startTime) {
      const endTime = new Date();
      const durationInMinutes = Math.ceil(elapsedTime / 60); // Round up to nearest minute
      
      onAddTimeRecord({
        userId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: durationInMinutes,
        note: note.trim() || undefined,
      });
      
      setIsTracking(false);
      setStartTime(null);
      setElapsedTime(0);
      setNote('');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Time Tracking</h3>
        <div className="text-sm">
          Total: <span className="font-medium">{totalHours}h {totalMinutes}m</span>
        </div>
      </div>
      
      {isTracking || elapsedTime > 0 ? (
        <div className="space-y-4">
          <div className="border rounded-md p-3 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">
                {startTime && `Started ${formatDistance(startTime, new Date(), { addSuffix: true })}`}
              </div>
              <div className="text-lg font-mono font-semibold">
                {formatElapsedTime()}
              </div>
            </div>
            
            <Input
              placeholder="What are you working on? (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mb-3"
            />
            
            <div className="flex justify-end gap-2">
              {isTracking ? (
                <Button onClick={handlePauseTracking} variant="outline" size="sm">
                  <Pause className="mr-1 h-4 w-4" />
                  Pause
                </Button>
              ) : (
                <Button onClick={handleResumeTracking} variant="outline" size="sm">
                  <Play className="mr-1 h-4 w-4" />
                  Resume
                </Button>
              )}
              
              <Button onClick={handleStopTracking} variant="default" size="sm">
                <StopCircle className="mr-1 h-4 w-4" />
                Stop
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button onClick={handleStartTracking} className="w-full">
          <Play className="mr-2 h-4 w-4" />
          Start Tracking
        </Button>
      )}
      
      {timeRecords.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Recent time entries</h4>
          <div className="space-y-2">
            {timeRecords.slice(0, 5).map((record) => (
              <div key={record.id} className="text-sm border rounded-md p-2">
                <div className="flex justify-between">
                  <span>{new Date(record.startTime).toLocaleDateString()}</span>
                  <span className="font-medium">
                    {Math.floor(record.duration / 60)}h {record.duration % 60}m
                  </span>
                </div>
                {record.note && (
                  <p className="text-gray-500 text-xs mt-1">{record.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTracker;
