
import React, { useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserAvatar from '@/components/ui/UserAvatar';
import { Badge } from '@/components/ui/badge';
import TeamWorkloadView from '@/components/dashboard/TeamWorkloadView';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, BarChart3, Users, Calendar, PieChart } from 'lucide-react';

const Team = () => {
  const { users, currentProject, getUserWorkload } = useProject();
  const [selectedView, setSelectedView] = useState<'list' | 'workload'>('list');
  
  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-gray-500">Manage your team members and their workload</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select defaultValue={selectedView} onValueChange={(value) => setSelectedView(value as 'list' | 'workload')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="list">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Team Members</span>
                </div>
              </SelectItem>
              <SelectItem value="workload">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Workload</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Team Members</span>
          </TabsTrigger>
          <TabsTrigger value="workload" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Workload</span>
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Availability</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="members">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {users.map(user => {
              const workload = currentProject 
                ? getUserWorkload(currentProject.id, user.id)
                : { assignedTasks: 0, totalStoryPoints: 0, estimatedHours: 0 };
              
              return (
                <Card key={user.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {user.name}
                    </CardTitle>
                    <Badge variant="outline">{user.role}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <UserAvatar src={user.avatar} name={user.name} size="lg" />
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <BarChart3 className="h-3 w-3" />
                            {workload.assignedTasks} tasks
                          </Badge>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {workload.estimatedHours} hours
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="workload">
          {currentProject && (
            <TeamWorkloadView projectId={currentProject.id} />
          )}
        </TabsContent>
        
        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Team Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">This feature will be coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">This feature will be coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Team;
