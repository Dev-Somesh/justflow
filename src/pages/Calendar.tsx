
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import AppLayout from '@/components/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useProject } from '@/contexts/ProjectContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  AlertCircle,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ListTodo,
  Users
} from 'lucide-react';
import UserAvatar from '@/components/ui/UserAvatar';
import { format, addMonths, subMonths, isToday, isSameDay, isBefore } from 'date-fns';

const CalendarPage = () => {
  const { tasks, users, getUserById } = useProject();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();

  // Get tasks with due dates
  const tasksWithDueDate = tasks.filter(task => task.dueDate);
  
  // Function to get tasks by date (due date or creation date)
  const getTasksByDate = (day: Date) => {
    return tasks.filter(task => {
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        return isSameDay(dueDate, day);
      } else {
        const createdDate = new Date(task.createdAt);
        return isSameDay(createdDate, day);
      }
    });
  };

  // Custom day content to show tasks count
  const renderDayContent = (day: Date) => {
    const dayTasks = getTasksByDate(day);
    const isPastDue = dayTasks.some(task => 
      task.dueDate && task.status !== 'done' && isBefore(new Date(task.dueDate), new Date())
    );
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div>
          {day.getDate()}
          {dayTasks.length > 0 && (
            <div className={`absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[10px] text-white rounded-full ${isPastDue ? 'bg-red-500' : 'bg-blue-500'}`}>
              {dayTasks.length}
            </div>
          )}
        </div>
      </div>
    );
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/board?task=${taskId}`);
  };

  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-gray-500">View your tasks in a calendar layout</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/board')}>
            <ListTodo className="h-4 w-4 mr-2" />
            Board View
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Task Calendar</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-medium">
                {format(currentMonth, 'MMMM yyyy')}
              </div>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              components={{
                DayContent: ({ date }) => renderDayContent(date),
              }}
              modifiers={{
                today: (date) => isToday(date),
                hasTasks: (date) => getTasksByDate(date).length > 0,
                overdue: (date) => getTasksByDate(date).some(task => 
                  task.dueDate && task.status !== 'done' && isBefore(new Date(task.dueDate), new Date())
                ),
              }}
              modifiersStyles={{
                hasTasks: { fontWeight: 'bold' },
                overdue: { color: 'var(--color-red)' }
              }}
            />
          </CardContent>
          <CardFooter className="pt-0 border-t flex justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Tasks</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Overdue</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setDate(new Date())}>
              Today
            </Button>
          </CardFooter>
        </Card>

        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {date && date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {date && getTasksByDate(date).length > 0 ? (
                <div className="space-y-3">
                  {getTasksByDate(date).map(task => {
                    const isPastDue = task.dueDate && 
                      task.status !== 'done' && 
                      isBefore(new Date(task.dueDate), new Date());
                    
                    const assignee = task.assigneeId ? getUserById(task.assigneeId) : undefined;
                    
                    return (
                      <div 
                        key={task.id} 
                        className="p-3 rounded-md border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors"
                        onClick={() => handleTaskClick(task.id)}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{task.title}</h3>
                          <Badge variant={task.status === 'done' ? 'outline' : isPastDue ? 'destructive' : 'secondary'}>
                            {task.status === 'done' ? 'Completed' : isPastDue ? 'Overdue' : 'Pending'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                        
                        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1">
                                      <CalendarDays className="h-3.5 w-3.5" />
                                      <span>Due: {format(new Date(task.dueDate), 'MMM d')}</span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )}
                          
                          {assignee && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <UserAvatar src={assignee.avatar} name={assignee.name} size="sm" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Assigned to: {assignee.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No tasks scheduled for this day</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasksWithDueDate.length > 0 ? (
                <div className="space-y-2">
                  {tasksWithDueDate
                    .filter(task => task.status !== 'done')
                    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                    .slice(0, 5)
                    .map(task => (
                      <div 
                        key={task.id}
                        className="flex items-center justify-between p-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50 rounded-sm"
                        onClick={() => handleTaskClick(task.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            isBefore(new Date(task.dueDate!), new Date()) 
                              ? 'bg-red-500' 
                              : 'bg-amber-500'
                          }`}></div>
                          <span className="text-sm">{task.title}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(new Date(task.dueDate!), 'MMM d')}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No upcoming deadlines</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CalendarPage;
