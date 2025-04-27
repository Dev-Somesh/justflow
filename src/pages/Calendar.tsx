
import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/components/layouts/AppLayout';
import { useProject } from '@/contexts/ProjectContext';
import { format, isSameDay, addDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import UserAvatar from '@/components/ui/UserAvatar';
import { AlertCircle, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

const CalendarPage: React.FC = () => {
  const { currentProject, tasks, getSprints } = useProject();
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'upcoming'>('day');
  
  // Get all sprints
  const sprints = currentProject ? getSprints(currentProject.id) : [];
  
  // Tasks with due dates
  const tasksWithDueDates = useMemo(() => {
    if (!currentProject) return [];
    
    return tasks
      .filter(task => task.dueDate)
      .sort((a, b) => {
        return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
      });
  }, [currentProject, tasks]);
  
  // Tasks due today
  const todayTasks = useMemo(() => {
    return tasksWithDueDates.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
  }, [tasksWithDueDates, date]);
  
  // Tasks due in the next 7 days
  const upcomingTasks = useMemo(() => {
    const today = startOfDay(new Date());
    const nextWeek = endOfDay(addDays(today, 7));
    
    return tasksWithDueDates.filter(task => {
      const dueDate = new Date(task.dueDate!);
      return isWithinInterval(dueDate, { start: today, end: nextWeek }) && 
             !isSameDay(dueDate, date);
    });
  }, [tasksWithDueDates, date]);
  
  // Group tasks by sprint
  const tasksBySprintId = useMemo(() => {
    const result: Record<string, typeof tasksWithDueDates> = {};
    
    // Add a special category for tasks without a sprint
    result['none'] = [];
    
    // Initialize with all sprints
    sprints.forEach(sprint => {
      result[sprint.id] = [];
    });
    
    // Group tasks
    const taskList = view === 'day' ? todayTasks : upcomingTasks;
    taskList.forEach(task => {
      if (task.sprintId) {
        if (result[task.sprintId]) {
          result[task.sprintId].push(task);
        } else {
          // If sprint doesn't exist in our map yet
          result[task.sprintId] = [task];
        }
      } else {
        // Tasks without sprint
        result['none'].push(task);
      }
    });
    
    return result;
  }, [sprints, todayTasks, upcomingTasks, view]);
  
  // Get task status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'todo':
        return <Badge variant="outline">To Do</Badge>;
      case 'in-progress':
        return <Badge className="bg-plane-blue">In Progress</Badge>;
      case 'done':
        return <Badge className="bg-green-500">Done</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get priority indicator styling
  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'high':
        return <div className="w-2 h-full bg-priority-high rounded-l-sm absolute left-0 top-0"></div>;
      case 'medium':
        return <div className="w-2 h-full bg-priority-medium rounded-l-sm absolute left-0 top-0"></div>;
      case 'low':
        return <div className="w-2 h-full bg-priority-low rounded-l-sm absolute left-0 top-0"></div>;
      default:
        return null;
    }
  };
  
  // If no project is selected
  if (!currentProject) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <CalendarIcon size={48} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Project Selected</h2>
          <p className="text-gray-500">Select a project to view calendar tasks</p>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-gray-500">Track tasks and deadlines</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>View tasks by date</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
              // Highlight dates with tasks
              modifiers={{
                highlighted: tasksWithDueDates.map(task => new Date(task.dueDate!))
              }}
              modifiersClassNames={{
                highlighted: "bg-primary/10"
              }}
            />
            
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">
                Selected: <span className="font-medium">{format(date, 'PPP')}</span>
              </p>
              <Badge variant="outline">{todayTasks.length} tasks</Badge>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="day" onValueChange={(value) => setView(value as 'day' | 'upcoming')}>
            <TabsList className="mb-4">
              <TabsTrigger value="day">Today's Tasks</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Tasks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="day" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tasks for {format(date, 'PPPP')}</CardTitle>
                  <CardDescription>
                    {todayTasks.length === 0 ? 
                      'No tasks due on this day' : 
                      `${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} due`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(tasksBySprintId).map(([sprintId, sprintTasks]) => {
                      // Skip if no tasks in this sprint
                      if (sprintTasks.length === 0) return null;
                      
                      // Get sprint name
                      const sprint = sprints.find(s => s.id === sprintId);
                      const sprintName = sprint ? sprint.name : 'No Sprint';
                      
                      return (
                        <div key={sprintId} className="space-y-3">
                          <h3 className="font-medium text-sm text-gray-500">{sprintName}</h3>
                          
                          <div className="space-y-2">
                            {sprintTasks.map(task => (
                              <div 
                                key={task.id} 
                                className="border rounded-md p-3 relative hover:shadow-sm transition-shadow"
                              >
                                {getPriorityIndicator(task.priority)}
                                <div className="pl-3">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium">{task.title}</h4>
                                    {getStatusBadge(task.status)}
                                  </div>
                                  
                                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                    {task.description || 'No description'}
                                  </p>
                                  
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1">
                                      {task.assigneeId ? (
                                        <UserAvatar 
                                          name="User" 
                                          size="sm" 
                                          className="h-6 w-6" 
                                        />
                                      ) : (
                                        <span className="text-xs text-gray-500">Unassigned</span>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <div className="text-xs text-gray-500">
                                        {task.storyPoints} pts
                                      </div>
                                      <div className="bg-gray-100 text-xs rounded px-2 py-1">
                                        {format(new Date(task.dueDate!), 'MMM d')}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    
                    {todayTasks.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                        <CheckCircle2 className="h-12 w-12 mb-2 opacity-30" />
                        <p>No tasks due today</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="upcoming" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Tasks</CardTitle>
                  <CardDescription>
                    Tasks due in the next 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(tasksBySprintId).map(([sprintId, sprintTasks]) => {
                      // Skip if no tasks in this sprint
                      if (sprintTasks.length === 0) return null;
                      
                      // Get sprint name
                      const sprint = sprints.find(s => s.id === sprintId);
                      const sprintName = sprint ? sprint.name : 'No Sprint';
                      
                      return (
                        <div key={sprintId} className="space-y-3">
                          <h3 className="font-medium text-sm text-gray-500">{sprintName}</h3>
                          
                          <div className="space-y-2">
                            {sprintTasks.map(task => (
                              <div 
                                key={task.id} 
                                className="border rounded-md p-3 relative hover:shadow-sm transition-shadow"
                              >
                                {getPriorityIndicator(task.priority)}
                                <div className="pl-3">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium">{task.title}</h4>
                                    {getStatusBadge(task.status)}
                                  </div>
                                  
                                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                    {task.description || 'No description'}
                                  </p>
                                  
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1">
                                      {task.assigneeId ? (
                                        <UserAvatar 
                                          name="User" 
                                          size="sm" 
                                          className="h-6 w-6" 
                                        />
                                      ) : (
                                        <span className="text-xs text-gray-500">Unassigned</span>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <div className="text-xs text-gray-500">
                                        {task.storyPoints} pts
                                      </div>
                                      <div className="bg-gray-100 text-xs rounded px-2 py-1 font-medium">
                                        {format(new Date(task.dueDate!), 'MMM d')}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    
                    {upcomingTasks.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                        <CheckCircle2 className="h-12 w-12 mb-2 opacity-30" />
                        <p>No upcoming tasks in the next 7 days</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default CalendarPage;
