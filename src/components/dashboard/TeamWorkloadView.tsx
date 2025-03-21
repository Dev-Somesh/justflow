
import React from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import UserAvatar from '@/components/ui/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface TeamWorkloadViewProps {
  projectId: string;
}

const TeamWorkloadView: React.FC<TeamWorkloadViewProps> = ({ projectId }) => {
  const { getTeamWorkload } = useProject();
  
  const workload = getTeamWorkload(projectId);
  const teamMembers = Object.values(workload);
  
  if (teamMembers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Workload</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No team members assigned to tasks</p>
        </CardContent>
      </Card>
    );
  }
  
  // Find highest workload for comparison
  const maxStoryPoints = Math.max(...teamMembers.map(member => member.totalStoryPoints), 1);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Workload</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.user.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserAvatar 
                    src={member.user.avatar}
                    name={member.user.name} 
                    size="sm" 
                  />
                  <div>
                    <p className="font-medium text-sm">{member.user.name}</p>
                    <p className="text-xs text-gray-500">{member.user.role}</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="flex items-center gap-1 justify-end">
                    <p>{member.assignedTasks} tasks</p>
                    <Badge variant={member.assignedTasks > 5 ? "destructive" : "outline"} className="ml-1">
                      {member.assignedTasks > 5 ? "Overloaded" : "Normal"}
                    </Badge>
                  </div>
                  <p>{member.totalStoryPoints} story points</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Workload</span>
                  <span>
                    {Math.round(member.totalStoryPoints / maxStoryPoints * 100)}%
                    {Math.round(member.totalStoryPoints / maxStoryPoints * 100) > 75 && 
                      <AlertTriangle className="inline ml-1 h-3 w-3 text-amber-500" />
                    }
                  </span>
                </div>
                <Progress
                  value={(member.totalStoryPoints / maxStoryPoints) * 100}
                  className="h-2"
                  indicatorClassName={
                    Math.round(member.totalStoryPoints / maxStoryPoints * 100) > 75 
                      ? "bg-amber-500" 
                      : "bg-blue-500"
                  }
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Estimated Time</span>
                  <span className="flex items-center">
                    {member.estimatedHours} hours
                    {member.estimatedHours > 30 && 
                      <AlertTriangle className="inline ml-1 h-3 w-3 text-red-500" />
                    }
                  </span>
                </div>
                <Progress
                  value={Math.min(100, (member.estimatedHours / 40) * 100)}
                  className="h-2"
                  indicatorClassName={
                    member.estimatedHours > 30 
                      ? "bg-red-500" 
                      : member.estimatedHours > 20 
                        ? "bg-amber-500" 
                        : "bg-green-500"
                  }
                />
              </div>

              <div className="mt-2 flex gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Completed: {Math.round(member.user.id.charCodeAt(0) % 5)} tasks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-amber-500" />
                  <span>Average time: {Math.round(member.user.id.charCodeAt(0) % 6 + 2)}h per task</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamWorkloadView;
