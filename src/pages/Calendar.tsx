
import React, { useState } from 'react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import AppLayout from '@/components/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProject } from '@/contexts/ProjectContext';

const Calendar = () => {
  const { tasks } = useProject();
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Count tasks for each date to show as part of the calendar
  const getDayTasks = (day: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate.getDate() === day.getDate() && 
             taskDate.getMonth() === day.getMonth() && 
             taskDate.getFullYear() === day.getFullYear();
    });
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-gray-500">View your tasks in a calendar layout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle>Task Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                hasTasks: (date) => getDayTasks(date).length > 0,
              }}
              modifiersStyles={{
                hasTasks: { 
                  fontWeight: 'bold', 
                  textDecoration: 'underline', 
                  color: 'var(--plane-purple)'
                }
              }}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
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
            {date && getDayTasks(date).length > 0 ? (
              <div className="space-y-3">
                {getDayTasks(date).map(task => (
                  <div key={task.id} className="p-3 rounded-md border border-gray-200">
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{task.description.substring(0, 100)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tasks scheduled for this day</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Calendar;
