
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InfoTooltip from '@/components/ui/InfoTooltip';

interface SprintSelectorProps {
  projectId: string;
  onSprintSelect?: (sprintId: string) => void;
}

const SprintSelector: React.FC<SprintSelectorProps> = ({ projectId, onSprintSelect }) => {
  const { getSprints, getCurrentSprint, addSprint } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  const [newSprintData, setNewSprintData] = useState({
    name: '',
    goal: '',
    startDate: '',
    endDate: '',
    status: 'planning' as 'planning' | 'active' | 'completed',
  });

  const sprints = getSprints(projectId);
  const currentSprint = getCurrentSprint(projectId);

  const handleCreate = () => {
    if (!newSprintData.name || !newSprintData.startDate || !newSprintData.endDate) {
      return;
    }

    addSprint(projectId, {
      name: newSprintData.name,
      goal: newSprintData.goal,
      startDate: new Date(newSprintData.startDate).toISOString(),
      endDate: new Date(newSprintData.endDate).toISOString(),
      status: newSprintData.status,
    });

    setIsOpen(false);
    setNewSprintData({
      name: '',
      goal: '',
      startDate: '',
      endDate: '',
      status: 'planning',
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Active Sprint</h3>
          <InfoTooltip 
            content={
              <div>
                <p className="font-medium mb-1">About Sprints</p>
                <p>Sprints are time-boxed periods (usually 1-4 weeks) where teams complete a set amount of work.</p>
                <p className="mt-2">Create a sprint to organize your tasks and track progress over time.</p>
              </div>
            } 
          />
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Calendar className="h-4 w-4" />
              New Sprint
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Sprint</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="sprint-name">Name</Label>
                <Input
                  id="sprint-name"
                  placeholder="Sprint name"
                  value={newSprintData.name}
                  onChange={(e) => setNewSprintData({ ...newSprintData, name: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sprint-goal">Goal</Label>
                <Textarea
                  id="sprint-goal"
                  placeholder="Sprint goal"
                  value={newSprintData.goal}
                  onChange={(e) => setNewSprintData({ ...newSprintData, goal: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newSprintData.startDate}
                    onChange={(e) => setNewSprintData({ ...newSprintData, startDate: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newSprintData.endDate}
                    onChange={(e) => setNewSprintData({ ...newSprintData, endDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newSprintData.status}
                  onValueChange={(value) => setNewSprintData({ ...newSprintData, status: value as any })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleCreate}>Create Sprint</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {currentSprint ? (
        <div className="p-4 border rounded-md">
          <div className="font-medium">{currentSprint.name}</div>
          <p className="text-sm text-gray-500 mt-1">{currentSprint.goal}</p>
          <div className="mt-2 text-xs text-gray-500">
            {new Date(currentSprint.startDate).toLocaleDateString()} - {new Date(currentSprint.endDate).toLocaleDateString()}
          </div>
        </div>
      ) : (
        <div className="text-center p-4 border rounded-md border-dashed">
          <p className="text-gray-500">No active sprint</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => setIsOpen(true)}
          >
            Create Sprint
          </Button>
        </div>
      )}
      
      {sprints.length > 0 && (
        <div className="mt-4">
          <Label htmlFor="select-sprint">Change Sprint</Label>
          <Select
            onValueChange={(sprintId) => onSprintSelect && onSprintSelect(sprintId)}
            defaultValue={currentSprint?.id}
          >
            <SelectTrigger id="select-sprint">
              <SelectValue placeholder="Select a sprint" />
            </SelectTrigger>
            <SelectContent>
              {sprints.map((sprint) => (
                <SelectItem key={sprint.id} value={sprint.id}>
                  {sprint.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default SprintSelector;
