import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import UserAvatar from '@/components/ui/UserAvatar';
import { useProject } from '@/contexts/ProjectContext';

interface RecentActivityWidgetProps {
  projectId: string;
  limit?: number;
}

type ActivityType = 'comment' | 'status_change' | 'time_record' | 'task_created';

interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  taskId: string;
  timestamp: string;
  details: {
    [key: string]: any;
  };
}

const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({ 
  projectId, 
  limit = 5 
}) => {
  const { users, tasks, getUserById } = useProject();
  
  // Generate mock activities based on existing tasks data
  const getMockActivities = (): Activity[] => {
    const activities: Activity[] = [];
    
    // Create activities from tasks
    tasks.forEach(task => {
      if (!task) return; // Skip if task is undefined
      
      // Comments as activities
      if (task.comments && Array.isArray(task.comments)) {
        task.comments.forEach(comment => {
          if (!comment) return; // Skip if comment is undefined
          
          activities.push({
            id: `activity-comment-${comment.id}`,
            type: 'comment',
            userId: comment.userId,
            taskId: task.id,
            timestamp: comment.createdAt,
            details: {
              content: comment.content
            }
          });
        });
      }
      
      // Time records as activities
      if (task.timeRecords && Array.isArray(task.timeRecords)) {
        task.timeRecords.forEach(record => {
          if (!record) return; // Skip if record is undefined
          
          activities.push({
            id: `activity-time-${record.id}`,
            type: 'time_record',
            userId: record.userId,
            taskId: task.id,
            timestamp: record.createdAt,
            details: {
              duration: record.duration,
              note: record.note
            }
          });
        });
      }
      
      // Task creation as activity (make sure task has createdAt)
      if (task.createdAt) {
        activities.push({
          id: `activity-create-${task.id}`,
          type: 'task_created',
          userId: task.assigneeId || 'user-1',
          taskId: task.id,
          timestamp: task.createdAt,
          details: {
            title: task.title,
            priority: task.priority
          }
        });
      }
      
      // Mock status change for demo (only for done tasks)
      if (task.status === 'done' && task.createdAt) {
        activities.push({
          id: `activity-status-${task.id}`,
          type: 'status_change',
          userId: task.assigneeId || 'user-1',
          taskId: task.id,
          timestamp: new Date(new Date(task.createdAt).getTime() + 86400000).toISOString(), // 1 day after creation
          details: {
            from: 'in-progress',
            to: 'done'
          }
        });
      }
    });
    
    // Sort by timestamp descending
    return activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, limit);
  };
  
  const activities = getMockActivities();
  
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'status_change':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'time_record':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'task_created':
        return <BarChart3 className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getActivityText = (activity: Activity) => {
    const task = tasks.find(t => t && t.id === activity.taskId);
    const user = getUserById(activity.userId);
    
    switch (activity.type) {
      case 'comment':
        return `${user?.name || 'Someone'} commented on "${task?.title || 'a task'}"`;
      case 'status_change':
        return `${user?.name || 'Someone'} marked "${task?.title || 'a task'}" as ${activity.details.to}`;
      case 'time_record':
        return `${user?.name || 'Someone'} logged ${Math.round(activity.details.duration / 60)} hours on "${task?.title || 'a task'}"`;
      case 'task_created':
        return `${user?.name || 'Someone'} created task "${task?.title || 'Unknown'}"`;
      default:
        return 'Unknown activity';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              activities.map(activity => {
                const user = getUserById(activity.userId);
                return (
                  <div key={activity.id} className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {user ? (
                        <UserAvatar 
                          src={user.avatar} 
                          name={user.name} 
                          size="sm" 
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{user?.name || 'Unknown user'}</span>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getActivityIcon(activity.type)}
                          <span className="capitalize">{activity.type.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      <p className="text-sm">{getActivityText(activity)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentActivityWidget;
