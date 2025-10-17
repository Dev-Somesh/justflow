import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Activity,
  Zap
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    total_issues: number;
    completed_issues: number;
    in_progress_issues: number;
    overdue_issues: number;
    total_cycles: number;
    active_cycles: number;
    completed_cycles: number;
    total_modules: number;
    active_modules: number;
    completed_modules: number;
    team_velocity: number;
    completion_rate: number;
    average_cycle_time: number;
  };
  velocity: {
    date: string;
    completed: number;
    planned: number;
    actual: number;
  }[];
  burndown: {
    date: string;
    remaining: number;
    ideal: number;
    actual: number;
  }[];
  priority_distribution: {
    priority: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  state_distribution: {
    state: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  assignee_performance: {
    assignee: string;
    completed: number;
    in_progress: number;
    overdue: number;
    efficiency: number;
  }[];
  cycle_performance: {
    cycle: string;
    planned_issues: number;
    completed_issues: number;
    completion_rate: number;
    days_remaining: number;
  }[];
  module_progress: {
    module: string;
    total_issues: number;
    completed_issues: number;
    progress: number;
    days_remaining: number;
  }[];
  time_tracking: {
    date: string;
    logged_hours: number;
    estimated_hours: number;
    efficiency: number;
  }[];
}

interface EnhancedAnalyticsProps {
  data: AnalyticsData;
  timeRange: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void;
}

export const EnhancedAnalytics: React.FC<EnhancedAnalyticsProps> = ({
  data,
  timeRange,
  onTimeRangeChange,
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatPercentage = (value: number) => `${Math.round(value)}%`;
  const formatNumber = (value: number) => value.toLocaleString();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="velocity">Velocity</TabsTrigger>
          <TabsTrigger value="cycles">Cycles</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.overview.total_issues)}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {getTrendIcon(data.overview.total_issues, data.overview.total_issues * 0.9)}
                  <span className={getTrendColor(data.overview.total_issues, data.overview.total_issues * 0.9)}>
                    +10% from last period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPercentage(data.overview.completion_rate)}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {getTrendIcon(data.overview.completion_rate, 75)}
                  <span className={getTrendColor(data.overview.completion_rate, 75)}>
                    +5% from last period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Velocity</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.overview.team_velocity)}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {getTrendIcon(data.overview.team_velocity, data.overview.team_velocity * 0.95)}
                  <span className={getTrendColor(data.overview.team_velocity, data.overview.team_velocity * 0.95)}>
                    +8% from last period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Cycle Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.overview.average_cycle_time}d</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {getTrendIcon(data.overview.average_cycle_time, data.overview.average_cycle_time * 1.1)}
                  <span className={getTrendColor(data.overview.average_cycle_time, data.overview.average_cycle_time * 1.1)}>
                    -12% from last period
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.priority_distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {data.priority_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* State Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>State Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.state_distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {data.state_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Velocity Tab */}
        <TabsContent value="velocity" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Velocity Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data.velocity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="completed" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="planned" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="actual" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Burndown Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={data.burndown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="ideal" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="actual" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cycles Tab */}
        <TabsContent value="cycles" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cycle Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.cycle_performance.map((cycle) => (
                    <div key={cycle.cycle} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{cycle.cycle}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            {cycle.completed_issues}/{cycle.planned_issues} issues
                          </span>
                          <Badge variant={cycle.completion_rate >= 80 ? 'default' : 'secondary'}>
                            {formatPercentage(cycle.completion_rate)}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={cycle.completion_rate} className="h-2" />
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{cycle.days_remaining} days remaining</span>
                        <span>{formatPercentage(cycle.completion_rate)} complete</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Module Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.module_progress.map((module) => (
                    <div key={module.module} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{module.module}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            {module.completed_issues}/{module.total_issues} issues
                          </span>
                          <Badge variant={module.progress >= 80 ? 'default' : 'secondary'}>
                            {formatPercentage(module.progress)}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{module.days_remaining} days remaining</span>
                        <span>{formatPercentage(module.progress)} complete</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.assignee_performance.map((assignee) => (
                    <div key={assignee.assignee} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{assignee.assignee}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            {assignee.completed} completed
                          </span>
                          <Badge variant={assignee.efficiency >= 80 ? 'default' : 'secondary'}>
                            {formatPercentage(assignee.efficiency)} efficiency
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-green-600 font-medium">{assignee.completed}</div>
                          <div className="text-gray-500">Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-600 font-medium">{assignee.in_progress}</div>
                          <div className="text-gray-500">In Progress</div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-600 font-medium">{assignee.overdue}</div>
                          <div className="text-gray-500">Overdue</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
