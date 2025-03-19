
import React from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UserAvatar } from '@/components/ui/UserAvatar';

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
                  <UserAvatar user={member.user} size="sm" />
                  <div>
                    <p className="font-medium text-sm">{member.user.name}</p>
                    <p className="text-xs text-gray-500">{member.user.role}</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p>{member.assignedTasks} tasks</p>
                  <p>{member.totalStoryPoints} story points</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Workload</span>
                  <span>{Math.round(member.totalStoryPoints / maxStoryPoints * 100)}%</span>
                </div>
                <Progress
                  value={(member.totalStoryPoints / maxStoryPoints) * 100}
                  className="h-2"
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Estimated Time</span>
                  <span>{member.estimatedHours} hours</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ 
                      width: `${Math.min(100, (member.estimatedHours / 40) * 100)}%` // 40h = 100%
                    }}
                  />
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
