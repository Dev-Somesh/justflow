
import React, { useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserAvatar from '@/components/ui/UserAvatar';
import { Badge } from '@/components/ui/badge';
import TeamWorkloadView from '@/components/dashboard/TeamWorkloadView';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  Clock, 
  BarChart3, 
  Users, 
  Calendar, 
  PieChart,
  Check,
  AlertTriangle,
  Mail,
  Phone,
  User,
  Edit,
  Archive,
  Trash2,
  Briefcase,
  UserCog,
  CheckCircle,
  X
} from 'lucide-react';

const Team = () => {
  const { users, currentProject, getUserWorkload, tasks } = useProject();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isUserEditOpen, setIsUserEditOpen] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<Record<string, number>>({
    'user-1': 85,
    'user-2': 60,
    'user-3': 90,
  });
  const { toast } = useToast();
  
  const selectedUserData = users.find(u => u.id === selectedUser);
  const userTasks = tasks.filter(t => t.assigneeId === selectedUser);
  
  const handleViewProfile = (userId: string) => {
    setSelectedUser(userId);
    setIsUserProfileOpen(true);
  };
  
  const handleEditUser = () => {
    setIsUserProfileOpen(false);
    setIsUserEditOpen(true);
  };
  
  const handleDeleteUser = () => {
    toast({
      title: "User deleted",
      description: `User ${selectedUserData?.name} has been removed from the system.`,
      variant: "destructive",
    });
    setIsUserProfileOpen(false);
  };
  
  const handleDeactivateUser = () => {
    toast({
      title: "User deactivated",
      description: `User ${selectedUserData?.name} has been deactivated.`,
    });
    setIsUserProfileOpen(false);
  };
  
  const handleSaveUser = () => {
    toast({
      title: "User updated",
      description: `User ${selectedUserData?.name}'s profile has been updated.`,
    });
    setIsUserEditOpen(false);
  };
  
  const getPerformanceRating = (userId: string) => {
    // In a real application, this would come from actual performance metrics
    const ratings: Record<string, { score: number; metrics: any }> = {
      'user-1': { 
        score: 4.5, 
        metrics: {
          taskCompletion: 95,
          onTime: 90,
          quality: 85,
        } 
      },
      'user-2': { 
        score: 3.8, 
        metrics: {
          taskCompletion: 80,
          onTime: 75,
          quality: 85,
        } 
      },
      'user-3': { 
        score: 4.2, 
        metrics: {
          taskCompletion: 90,
          onTime: 85,
          quality: 80,
        } 
      },
    };
    
    return ratings[userId] || { score: 0, metrics: {} };
  };

  const formatTimeString = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  const calculateCompletedTasks = (userId: string) => {
    return tasks.filter(t => t.assigneeId === userId && t.status === 'done').length;
  };
  
  const calculateTotalTrackedTime = (userId: string) => {
    return tasks
      .filter(t => t.assigneeId === userId)
      .reduce((total, task) => {
        return total + task.timeRecords
          .filter(record => record.userId === userId)
          .reduce((sum, record) => sum + record.duration, 0);
      }, 0);
  };
  
  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-gray-500">Manage your team members and their workload</p>
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
              
              const completedTasks = calculateCompletedTasks(user.id);
              const totalTrackedTime = calculateTotalTrackedTime(user.id);
              
              return (
                <Card key={user.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold">
                        {user.name}
                      </CardTitle>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                    <CardDescription>{user.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <UserAvatar src={user.avatar} name={user.name} size="lg" />
                      <div className="space-y-3 flex-1">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Current workload</span>
                            <span>{Math.min(workload.assignedTasks * 10, 100)}%</span>
                          </div>
                          <Progress value={Math.min(workload.assignedTasks * 10, 100)} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Assigned tasks:</span>
                            <span className="ml-1 font-medium">{workload.assignedTasks}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Completed:</span>
                            <span className="ml-1 font-medium">{completedTasks}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Story points:</span>
                            <span className="ml-1 font-medium">{workload.totalStoryPoints}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Total time:</span>
                            <span className="ml-1 font-medium">{formatTimeString(totalTrackedTime)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-gray-50">
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => handleViewProfile(user.id)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="workload">
          {currentProject && (
            <Card>
              <CardHeader>
                <CardTitle>Team Workload Distribution</CardTitle>
                <CardDescription>
                  Visualize how work is distributed across team members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TeamWorkloadView projectId={currentProject.id} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Team Availability</CardTitle>
              <CardDescription>
                Current team member availability for new tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {users.map(user => {
                  const availability = availabilityData[user.id] || 0;
                  
                  return (
                    <div key={user.id} className="flex items-center space-x-4">
                      <UserAvatar src={user.avatar} name={user.name} size="sm" />
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{user.name}</span>
                          <span>{availability}% Available</span>
                        </div>
                        <Progress value={availability} className="h-2" />
                      </div>
                      <div className="flex items-center">
                        {availability > 70 ? (
                          <Badge className="bg-green-500">Available</Badge>
                        ) : availability > 30 ? (
                          <Badge className="bg-yellow-500">Limited</Badge>
                        ) : (
                          <Badge className="bg-red-500">Busy</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                toast({
                  title: "Availabilities updated",
                  description: "Team member availabilities have been refreshed",
                });
              }}>
                Refresh Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Metrics</CardTitle>
              <CardDescription>
                Individual and team performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {users.map(user => {
                  const performance = getPerformanceRating(user.id);
                  
                  return (
                    <div key={user.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-3">
                          <UserAvatar src={user.avatar} name={user.name} size="sm" />
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 rounded-md px-2 py-1">
                          <span className="font-bold">{performance.score.toFixed(1)}</span>
                          <span className="text-gray-500 text-sm">/5</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Task Completion</div>
                          <div className="flex items-center gap-2">
                            <Progress value={performance.metrics.taskCompletion} className="h-2" />
                            <span className="text-sm font-medium">{performance.metrics.taskCompletion}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-500 mb-1">On-Time Delivery</div>
                          <div className="flex items-center gap-2">
                            <Progress value={performance.metrics.onTime} className="h-2" />
                            <span className="text-sm font-medium">{performance.metrics.onTime}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Quality</div>
                          <div className="flex items-center gap-2">
                            <Progress value={performance.metrics.quality} className="h-2" />
                            <span className="text-sm font-medium">{performance.metrics.quality}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-sm">
                        <div className="flex gap-4">
                          <div>
                            <span className="text-gray-500">Completed tasks:</span>
                            <span className="font-medium ml-1">{calculateCompletedTasks(user.id)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Time logged:</span>
                            <span className="font-medium ml-1">{formatTimeString(calculateTotalTrackedTime(user.id))}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t">
              <div className="text-sm text-gray-500">
                Performance period: Last 30 days
              </div>
              <Select defaultValue="30">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* User Profile Sheet */}
      <Sheet open={isUserProfileOpen} onOpenChange={setIsUserProfileOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>User Profile</SheetTitle>
            <SheetDescription>
              View and manage user details
            </SheetDescription>
          </SheetHeader>
          
          {selectedUserData && (
            <div className="py-4 space-y-6">
              <div className="flex flex-col items-center space-y-3">
                <UserAvatar src={selectedUserData.avatar} name={selectedUserData.name} size="lg" />
                <div className="text-center">
                  <h3 className="text-xl font-bold">{selectedUserData.name}</h3>
                  <Badge variant="outline" className="mt-1">{selectedUserData.role}</Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{selectedUserData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <span>Department: Engineering</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Assigned Tasks</h4>
                {userTasks.length > 0 ? (
                  <div className="space-y-2">
                    {userTasks.slice(0, 5).map(task => (
                      <div key={task.id} className="flex justify-between p-2 border rounded-md text-sm">
                        <span>{task.title}</span>
                        <Badge variant={
                          task.status === 'done' ? 'outline' : 
                          task.status === 'in-progress' ? 'default' : 
                          'secondary'
                        }>
                          {task.status === 'done' ? 'Completed' : 
                           task.status === 'in-progress' ? 'In Progress' : 
                           'To Do'}
                        </Badge>
                      </div>
                    ))}
                    {userTasks.length > 5 && (
                      <div className="text-center text-sm text-gray-500">
                        +{userTasks.length - 5} more tasks
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No tasks assigned</div>
                )}
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Performance</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Completed tasks</span>
                      <span>{calculateCompletedTasks(selectedUserData.id)}</span>
                    </div>
                    <Progress value={calculateCompletedTasks(selectedUserData.id) / Math.max(userTasks.length, 1) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Time logged</span>
                      <span>{formatTimeString(calculateTotalTrackedTime(selectedUserData.id))}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <SheetFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between mt-4 border-t pt-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEditUser}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeactivateUser}>
                <Archive className="h-4 w-4 mr-1" />
                Deactivate
              </Button>
            </div>
            <Button variant="destructive" size="sm" onClick={handleDeleteUser}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Edit User Modal */}
      <Dialog open={isUserEditOpen} onOpenChange={setIsUserEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Edit User
            </DialogTitle>
          </DialogHeader>
          
          {selectedUserData && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-center">
                <UserAvatar src={selectedUserData.avatar} name={selectedUserData.name} size="lg" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={selectedUserData.name} />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={selectedUserData.email} />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue="+1 (555) 123-4567" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue={selectedUserData.role}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="UI Designer">UI Designer</SelectItem>
                    <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select defaultValue="Engineering">
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="QA">Quality Assurance</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" defaultValue="Backend developer with 5 years of experience in building scalable applications." />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="active" defaultChecked />
                <Label htmlFor="active">Active account</Label>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsUserEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Team;
