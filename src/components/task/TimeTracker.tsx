import React, { useState, useEffect } from 'react';
import { TimeRecord, User } from '@/contexts/ProjectContext';
import { formatDuration } from '@/lib/timeUtils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, Play, Pause, Save } from 'lucide-react';

export interface TimeTrackerProps {
  projectId: string;
  taskId: string;
  timeRecords?: TimeRecord[];
  onAddTimeRecord: (timeRecord: Omit<TimeRecord, 'id'>) => void;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({
  projectId,
  taskId,
  timeRecords = [],
  onAddTimeRecord,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [note, setNote] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  
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
    try {
      const durationInMinutes = Math.round(seconds / 60);
      
      onAddTimeRecord({
        userId: 'user-1', // Current user ID
        duration: durationInMinutes,
        note,
        createdAt: new Date().toISOString(),
        startTime: startTime?.toISOString(),
        endTime: new Date().toISOString(),
      });
      
      setSeconds(0);
      setNote('');
      setIsRunning(false);
      setStartTime(null);
    } catch (error) {
      console.error('Failed to save time record:', error);
    }
  };
  
  const getTotalTime = () => {
    return timeRecords.reduce((total, record) => total + record.duration, 0);
  };
  
  return (
    <div className="space-y-6">
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
      
      <div>
        <h3 className="text-lg font-medium mb-3">Time Records</h3>
        {timeRecords.length === 0 ? (
          <p className="text-sm text-gray-500">No time records yet.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeRecords.map(record => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{record.duration} min</TableCell>
                    <TableCell>{record.note || '-'}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={1} className="font-bold">Total</TableCell>
                  <TableCell className="font-bold">{getTotalTime()} min</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </div>
  );
};

export default TimeTracker;
