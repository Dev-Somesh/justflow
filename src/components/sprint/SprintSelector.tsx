
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProject } from '@/contexts/ProjectContext';
import { Timer, Plus, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface SprintSelectorProps {
  projectId: string;
  onSprintChange?: (sprintId: string | null) => void;
  selectedSprintId?: string;
}

const SprintSelector: React.FC<SprintSelectorProps> = ({ 
  projectId, 
  onSprintChange,
  selectedSprintId 
}) => {
  const { getSprints } = useProject();
  const sprints = getSprints(projectId);
  
  const activeSprint = sprints.find(sprint => sprint.status === 'active');
  const selectedSprint = selectedSprintId 
    ? sprints.find(sprint => sprint.id === selectedSprintId) 
    : activeSprint;

  const handleSprintChange = (value: string) => {
    if (value === 'all') {
      onSprintChange?.(null);
    } else {
      onSprintChange?.(value);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Timer className="h-5 w-5 mr-2 text-gray-500" />
            <span>Sprint</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select 
          value={selectedSprintId || 'all'} 
          onValueChange={handleSprintChange}
        >
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="All Sprints" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sprints</SelectItem>
            {sprints.map((sprint) => (
              <SelectItem key={sprint.id} value={sprint.id}>
                {sprint.name} - {sprint.status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedSprint ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{selectedSprint.name}</h4>
              <Badge variant={
                selectedSprint.status === 'active' ? 'default' : 
                selectedSprint.status === 'completed' ? 'outline' : 'secondary'
              }>
                {selectedSprint.status}
              </Badge>
            </div>
            
            {selectedSprint.startDate && selectedSprint.endDate && (
              <div className="text-sm text-gray-500">
                {format(new Date(selectedSprint.startDate), 'MMM d')} - {format(new Date(selectedSprint.endDate), 'MMM d, yyyy')}
              </div>
            )}
            
            <div className="text-sm text-gray-500">
              {selectedSprint.goal || 'No sprint goal set'}
            </div>
            
            <Button variant="outline" size="sm" className="w-full mt-2">
              <span className="flex-1 text-left">View Sprint Details</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>No active sprint</p>
            <Button variant="outline" size="sm" className="mt-2">
              Create Sprint
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SprintSelector;
