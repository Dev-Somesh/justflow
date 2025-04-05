
import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useProject } from '@/contexts/ProjectContext';
import { ChartContainer } from '@/components/ui/chart';

const VelocityChart = () => {
  const { currentProject, tasks } = useProject();
  
  // Generate velocity data based on actual tasks and sprints
  const velocityData = useMemo(() => {
    if (!currentProject || tasks.length === 0) {
      // Return sample data if no project or tasks
      return [
        { name: 'Sprint 1', planned: 25, completed: 20 },
        { name: 'Sprint 2', planned: 28, completed: 23 },
        { name: 'Sprint 3', planned: 24, completed: 24 },
        { name: 'Sprint 4', planned: 30, completed: 28 },
        { name: 'Sprint 5', planned: 32, completed: 30 },
      ];
    }
    
    // Get all tasks with sprints - filter out undefined tasks and ensure they have sprintId
    const tasksBySprint = tasks.filter(task => task && task.sprintId);
    
    // Get all sprints in the project
    const sprints = currentProject.sprints || [];
    
    if (sprints.length === 0 || tasksBySprint.length === 0) {
      // Return empty state with a note
      return [
        { name: 'No Sprint Data', planned: 0, completed: 0 }
      ];
    }
    
    // Generate data for each sprint
    return sprints.map(sprint => {
      if (!sprint) return { name: 'Unknown Sprint', planned: 0, completed: 0 };
      
      // Get all tasks for this sprint
      const sprintTasks = tasks.filter(task => task && task.sprintId === sprint.id);
      
      // Calculate points planned
      const planned = sprintTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
      
      // Calculate points completed (tasks with status done)
      const completed = sprintTasks
        .filter(task => task && task.status === 'done')
        .reduce((sum, task) => sum + (task.storyPoints || 0), 0);
      
      return {
        name: sprint.name || `Sprint ${sprint.id}`,
        planned,
        completed,
      };
    });
  }, [currentProject, tasks]);
  
  // If no tasks or project, show a message
  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md">
        <p className="text-gray-500">No project data available</p>
      </div>
    );
  }
  
  // Show a disclaimer if there's no real data
  const showDisclaimer = !tasks.length || !tasks.some(task => task && task.sprintId);
  
  const chartConfig = {
    planned: { label: "Planned Points", color: "#8884d8" },
    completed: { label: "Completed Points", color: "#82ca9d" },
  };
  
  return (
    <>
      {showDisclaimer && (
        <div className="mb-4 p-2 bg-blue-50 text-blue-700 text-xs rounded">
          Note: This chart shows {tasks.length === 0 ? "sample data" : "minimal data"} for demonstration purposes. 
          Real velocity metrics will be calculated as your team completes sprints and tasks.
        </div>
      )}
      <ChartContainer config={chartConfig} className="h-[300px]">
        <BarChart data={velocityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'Story Points', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="planned" name="Planned Points" fill="#8884d8" />
          <Bar dataKey="completed" name="Completed Points" fill="#82ca9d" />
        </BarChart>
      </ChartContainer>
    </>
  );
};

export default VelocityChart;
