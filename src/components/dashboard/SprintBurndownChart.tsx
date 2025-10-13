
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { useProject } from '@/contexts/ProjectContext';
import { addDays, format, parseISO, differenceInDays } from 'date-fns';

const SprintBurndownChart = () => {
  const { currentProject } = useProject();
  
  // Find active sprint
  const activeSprint = currentProject?.sprints.find(sprint => sprint.status === 'active');
  
  if (!activeSprint || !currentProject) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md">
        <div className="text-center px-4">
          <p className="text-gray-700 font-medium mb-2">No active sprint available</p>
          <p className="text-gray-500 text-sm">To see a burndown chart:</p>
          <ul className="text-gray-500 text-sm mt-2 space-y-1 list-disc list-inside">
            <li>Create or activate a sprint in your project</li>
            <li>Assign tasks with story points to the sprint</li>
            <li>Move tasks to Done as your team completes work</li>
          </ul>
        </div>
      </div>
    );
  }
  
  // Get sprint tasks
  const sprintTasks = currentProject.tasks.filter(task => task && task.sprintId === activeSprint.id);
  
  // Calculate total story points
  const totalStoryPoints = sprintTasks.reduce((total, task) => total + (task.storyPoints || 0), 0);
  
  // Generate burndown data
  const startDate = parseISO(activeSprint.startDate);
  const endDate = parseISO(activeSprint.endDate);
  const sprintDays = differenceInDays(endDate, startDate) + 1;
  
  // Generate ideal line
  const idealBurndown: Array<{ date: string; ideal: number | null; actual: number | null; }> = [];
  const pointsPerDay = totalStoryPoints / sprintDays;
  
  for (let i = 0; i <= sprintDays; i++) {
    const date = addDays(startDate, i);
    const remaining = totalStoryPoints - (pointsPerDay * i);
    
    idealBurndown.push({
      date: format(date, 'MMM dd'),
      ideal: Math.max(0, Number(remaining.toFixed(1))),
      actual: getActualBurndown(date, sprintTasks, totalStoryPoints),
    });
  }
  
  return (
    <div role="img" aria-label="Sprint burndown chart" aria-describedby="burndown-desc">
      <span id="burndown-desc" className="sr-only">
        The sprint burndown shows remaining story points over time compared to the ideal line.
      </span>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={idealBurndown} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'Story Points Remaining', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <ReferenceLine x={format(new Date(), 'MMM dd')} stroke="red" label="Today" />
          <Line type="monotone" dataKey="ideal" stroke="#8884d8" name="Ideal Burndown" />
          <Line type="monotone" dataKey="actual" stroke="#82ca9d" name="Actual Burndown" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Helper function to simulate actual burndown data
import type { Task } from '@/contexts/ProjectContext';
const getActualBurndown = (date: Date, tasks: Task[], totalPoints: number) => {
  // This would normally be based on actual task completion dates
  // For now, we'll simulate data based on the current date
  const today = new Date();
  
  if (date > today) {
    return null; // No data for future dates
  }
  
  // Make sure we have tasks and the first task has createdAt
  if (!tasks.length || !tasks[0] || !tasks[0].createdAt) {
    return totalPoints; // Return total points if no tasks or no createdAt
  }
  
  // Simple simulation of progress over time
  const daysPassed = differenceInDays(date, new Date(tasks[0].createdAt));
  const completedTasks = tasks.filter(task => 
    task && task.status === 'done' && task.createdAt && new Date(task.createdAt) <= date
  );
  
  const completedPoints = completedTasks.reduce(
    (sum, task) => sum + (task.storyPoints || 0), 
    0
  );
  
  const randomVariation = Math.random() * 5 - 2.5; // Random variation for demo
  const remaining = Math.max(
    0, 
    totalPoints - completedPoints + randomVariation
  );
  
  return Number(remaining.toFixed(1));
};

export default SprintBurndownChart;
