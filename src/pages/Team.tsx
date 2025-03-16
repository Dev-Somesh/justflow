
import React from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserAvatar from '@/components/ui/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { useProject } from '@/contexts/ProjectContext';

const Team = () => {
  const { users } = useProject();

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <p className="text-gray-500">Manage your team and collaborators</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <Card key={user.id} className="overflow-hidden">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-4">
                <UserAvatar 
                  src={user.avatar} 
                  name={user.name} 
                  size="lg" 
                />
                <div>
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{user.role}</Badge>
                {user.id === "user1" && (
                  <Badge variant="default" className="bg-plane-purple">Admin</Badge>
                )}
              </div>
              <div className="text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Assigned tasks</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Completed</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">In progress</span>
                  <span className="font-medium">4</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
};

export default Team;
