
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useProject, UserWorkload } from '@/contexts/ProjectContext';
import UserAvatar from '@/components/ui/UserAvatar';

interface TeamWorkloadViewProps {
  projectId: string;
}

const TeamWorkloadView: React.FC<TeamWorkloadViewProps> = ({ projectId }) => {
  const { getTeamWorkload, users } = useProject();
  
  // Get workload data
  const workloadData = getTeamWorkload(projectId);
  
  // Convert to array for rendering
  const workloadArray = Object.values(workloadData);
  
  if (workloadArray.length === 0) {
    return (
      <div className="text-gray-500 p-4 text-center border rounded-md">
        No team members with assigned tasks
      </div>
    );
  }
  
  // Calculate max capacity for visualization (default to 40 hours)
  const maxCapacity = 40;
  
  return (
    <div className="space-y-4">
      {workloadArray.map((workload: UserWorkload) => {
        // Safety check to ensure workload.user exists
        if (!workload.user) return null;
        
        const capacityPercent = Math.min(100, (workload.estimatedHours / maxCapacity) * 100);
        
        // Determine color based on capacity
        let progressColor = "bg-emerald-500";
        if (capacityPercent > 80) {
          progressColor = "bg-red-500";
        } else if (capacityPercent > 50) {
          progressColor = "bg-amber-500";
        }
        
        return (
          <div key={workload.user.id} className="flex items-center gap-4 border-b pb-4">
            <UserAvatar src={workload.user.avatar} name={workload.user.name} size="md" />
            
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <div>
                  <div className="font-medium">{workload.user.name}</div>
                  <div className="text-xs text-gray-500">{workload.user.role}</div>
                </div>
                <div className="text-sm">
                  {workload.assignedTasks} tasks ({workload.totalStoryPoints} pts)
                </div>
              </div>
              
              <div className="w-full">
                <div className="flex justify-between text-xs mb-1">
                  <span>Estimated hours: {workload.estimatedHours}</span>
                  <span>{Math.round(capacityPercent)}%</span>
                </div>
                <Progress 
                  value={capacityPercent} 
                  className={`h-2 ${progressColor} bg-gray-200`} 
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamWorkloadView;
