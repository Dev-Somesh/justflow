
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useProject } from '@/contexts/ProjectContext';

const VelocityChart = () => {
  const { currentProject } = useProject();
  
  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md">
        <p className="text-gray-500">No project data available</p>
      </div>
    );
  }
  
  // For a real application, this would be calculated from actual sprint history
  // For demo purposes, we'll generate some mock data
  const velocityData = [
    { name: 'Sprint 1', planned: 25, completed: 20 },
    { name: 'Sprint 2', planned: 28, completed: 23 },
    { name: 'Sprint 3', planned: 24, completed: 24 },
    { name: 'Sprint 4', planned: 30, completed: 28 },
    { name: 'Sprint 5', planned: 32, completed: 30 },
  ];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={velocityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: 'Story Points', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="planned" name="Planned Points" fill="#8884d8" />
        <Bar dataKey="completed" name="Completed Points" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VelocityChart;
