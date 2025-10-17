import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  BarChart3,
  Activity,
  Zap,
  ArrowRight,
  Filter,
  Search,
  Bell,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { cn } from '@/lib/utils';

interface ModernDashboardProps {
  className?: string;
  projects?: any[];
  tasks?: any[];
  onFilterClick?: () => void;
  onQuickAddClick?: () => void;
  onCreateProjectClick?: () => void;
}

const ModernDashboard: React.FC<ModernDashboardProps> = ({ 
  className, 
  projects = [], 
  tasks = [], 
  onFilterClick,
  onQuickAddClick,
  onCreateProjectClick 
}) => {
  const navigate = useNavigate();
  const { currentProject, setCurrentProject } = useProject();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Default handlers if not provided
  const handleFilterClick = onFilterClick || (() => {
    // TODO: Implement filter modal or dropdown
  });
  
  const handleQuickAddClick = onQuickAddClick || (() => {
    // TODO: Implement quick add modal
  });
  
  const handleCreateProjectClick = onCreateProjectClick || (() => {
    navigate('/settings'); // Navigate to settings where project creation might be
  });
  
  // Use passed data or fallback to API calls
  const apiProjects = projects.length > 0 ? projects : [];
  const apiTasks = tasks.length > 0 ? tasks : [];

  // Calculate comprehensive stats
  const totalTasks = apiTasks.length;
  const completedTasks = apiTasks.filter(t => t.status === 'done').length;
  const inProgressTasks = apiTasks.filter(t => t.status === 'in-progress').length;
  const todoTasks = apiTasks.filter(t => t.status === 'todo').length;
  const overdueTasks = apiTasks.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date() && t.status !== 'done';
  }).length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const highPriorityTasks = apiTasks.filter(t => t.priority === 'high').length;
  const urgentTasks = apiTasks.filter(t => t.priority === 'urgent').length;

  // Recent activity (mock data for now)
  const recentActivity = [
    { id: 1, type: 'task_completed', user: 'John Doe', action: 'completed task', target: 'Fix authentication bug', time: '2 minutes ago', avatar: '/avatars/john.jpg' },
    { id: 2, type: 'task_created', user: 'Jane Smith', action: 'created task', target: 'Add dark mode', time: '15 minutes ago', avatar: '/avatars/jane.jpg' },
    { id: 3, type: 'comment_added', user: 'Bob Johnson', action: 'commented on', target: 'Update API documentation', time: '1 hour ago', avatar: '/avatars/bob.jpg' },
    { id: 4, type: 'task_assigned', user: 'Alice Brown', action: 'assigned task', target: 'Design new dashboard', time: '2 hours ago', avatar: '/avatars/alice.jpg' },
  ];

  const quickActions = [
    { label: 'New Task', icon: Plus, action: () => navigate('/board?action=create') },
    { label: 'New Sprint', icon: Target, action: () => navigate('/cycles?action=create') },
    { label: 'New Module', icon: BarChart3, action: () => navigate('/modules?action=create') },
    { label: 'New Page', icon: Activity, action: () => navigate('/pages?action=create') },
  ];

  // Loading state is handled by parent component (Index.tsx)
  // This component assumes data is already loaded when rendered

  const StatCard = ({ title, value, change, icon: Icon, trend, color = 'blue' }: {
    title: string;
    value: string | number;
    change?: string;
    icon: React.ElementType;
    trend?: 'up' | 'down' | 'neutral';
    color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
    };

    return (
      <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
              {change && (
                <div className="flex items-center mt-2">
                  {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
                  {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500 mr-1" />}
                  <span className={cn(
                    "text-sm font-medium",
                    trend === 'up' ? "text-green-600" : trend === 'down' ? "text-red-600" : "text-gray-600"
                  )}>
                    {change}
                  </span>
                </div>
              )}
            </div>
            <div className={cn("p-3 rounded-lg border", colorClasses[color])}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // No loading state needed since data is passed directly from parent

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleFilterClick}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" onClick={handleQuickAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          change="+12% from last week"
          icon={Target}
          trend="up"
          color="blue"
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          change={`${completionRate}% completion rate`}
          icon={CheckCircle2}
          trend="up"
          color="green"
        />
        <StatCard
          title="In Progress"
          value={inProgressTasks}
          change="Active tasks"
          icon={Activity}
          trend="neutral"
          color="yellow"
        />
        <StatCard
          title="Overdue"
          value={overdueTasks}
          change={overdueTasks > 0 ? "Needs attention" : "All on track"}
          icon={AlertCircle}
          trend={overdueTasks > 0 ? "down" : "up"}
          color={overdueTasks > 0 ? "red" : "green"}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Overview */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Project Overview</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        // TODO: Implement project overview menu functionality
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {apiProjects.length > 0 ? (
                    <div className="space-y-4">
                      {apiProjects.slice(0, 3).map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Target className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{project.name}</h3>
                              <p className="text-sm text-gray-500">{project.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{project.status}</Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate('/board')}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                      <p className="text-gray-500 mb-4">Get started by creating your first project</p>
                      <Button onClick={handleCreateProjectClick}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Project
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start h-auto p-4"
                        onClick={action.action}
                      >
                        <action.icon className="h-5 w-5 mr-3" />
                        <span className="font-medium">{action.label}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Project Completion</span>
                  <span className="text-sm font-medium text-gray-900">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{todoTasks}</div>
                    <div className="text-sm text-gray-500">To Do</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{inProgressTasks}</div>
                    <div className="text-sm text-gray-500">In Progress</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                    <div className="text-sm text-gray-500">Completed</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apiProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary">{project.status}</Badge>
                  </div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>12 tasks</span>
                      <span>Due in 5 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.avatar} />
                      <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">To Do</span>
                    </div>
                    <span className="text-sm font-medium">{todoTasks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">In Progress</span>
                    </div>
                    <span className="text-sm font-medium">{inProgressTasks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Completed</span>
                    </div>
                    <span className="text-sm font-medium">{completedTasks}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Priority Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Urgent</span>
                    </div>
                    <span className="text-sm font-medium">{urgentTasks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">High Priority</span>
                    </div>
                    <span className="text-sm font-medium">{highPriorityTasks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-sm">Overdue</span>
                    </div>
                    <span className="text-sm font-medium">{overdueTasks}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModernDashboard;
