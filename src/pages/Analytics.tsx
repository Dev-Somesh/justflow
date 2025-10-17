import React, { useState } from 'react';
import { EnhancedAnalytics } from '@/components/features/analytics/EnhancedAnalytics';
import EnhancedAppLayout from '@/components/layouts/EnhancedAppLayout';

// Mock analytics data
const mockAnalyticsData = {
  overview: {
    total_issues: 156,
    completed_issues: 89,
    in_progress_issues: 34,
    overdue_issues: 8,
    total_cycles: 12,
    active_cycles: 3,
    completed_cycles: 9,
    total_modules: 8,
    active_modules: 5,
    completed_modules: 3,
    team_velocity: 24,
    completion_rate: 78,
    average_cycle_time: 12
  },
  velocity: [
    { date: '2024-01-01', completed: 15, planned: 20, actual: 15 },
    { date: '2024-01-08', completed: 18, planned: 20, actual: 18 },
    { date: '2024-01-15', completed: 22, planned: 20, actual: 22 },
    { date: '2024-01-22', completed: 19, planned: 20, actual: 19 },
    { date: '2024-01-29', completed: 25, planned: 20, actual: 25 },
    { date: '2024-02-05', completed: 21, planned: 20, actual: 21 },
    { date: '2024-02-12', completed: 24, planned: 20, actual: 24 },
    { date: '2024-02-19', completed: 20, planned: 20, actual: 20 }
  ],
  burndown: [
    { date: '2024-01-01', remaining: 100, ideal: 100, actual: 100 },
    { date: '2024-01-02', remaining: 95, ideal: 90, actual: 95 },
    { date: '2024-01-03', remaining: 88, ideal: 80, actual: 88 },
    { date: '2024-01-04', remaining: 82, ideal: 70, actual: 82 },
    { date: '2024-01-05', remaining: 75, ideal: 60, actual: 75 },
    { date: '2024-01-06', remaining: 68, ideal: 50, actual: 68 },
    { date: '2024-01-07', remaining: 60, ideal: 40, actual: 60 },
    { date: '2024-01-08', remaining: 52, ideal: 30, actual: 52 },
    { date: '2024-01-09', remaining: 43, ideal: 20, actual: 43 },
    { date: '2024-01-10', remaining: 35, ideal: 10, actual: 35 },
    { date: '2024-01-11', remaining: 26, ideal: 0, actual: 26 },
    { date: '2024-01-12', remaining: 18, ideal: 0, actual: 18 },
    { date: '2024-01-13', remaining: 10, ideal: 0, actual: 10 },
    { date: '2024-01-14', remaining: 2, ideal: 0, actual: 2 },
    { date: '2024-01-15', remaining: 0, ideal: 0, actual: 0 }
  ],
  priority_distribution: [
    { priority: 'urgent', count: 8, percentage: 5, color: '#EF4444' },
    { priority: 'high', count: 24, percentage: 15, color: '#F97316' },
    { priority: 'medium', count: 89, percentage: 57, color: '#EAB308' },
    { priority: 'low', count: 35, percentage: 23, color: '#22C55E' }
  ],
  state_distribution: [
    { state: 'completed', count: 89, percentage: 57, color: '#22C55E' },
    { state: 'in_progress', count: 34, percentage: 22, color: '#3B82F6' },
    { state: 'todo', count: 25, percentage: 16, color: '#6B7280' },
    { state: 'cancelled', count: 8, percentage: 5, color: '#EF4444' }
  ],
  assignee_performance: [
    {
      assignee: 'John Doe',
      completed: 28,
      in_progress: 5,
      overdue: 2,
      efficiency: 85
    },
    {
      assignee: 'Jane Smith',
      completed: 24,
      in_progress: 8,
      overdue: 1,
      efficiency: 78
    },
    {
      assignee: 'Bob Johnson',
      completed: 22,
      in_progress: 6,
      overdue: 3,
      efficiency: 82
    },
    {
      assignee: 'Alice Brown',
      completed: 15,
      in_progress: 4,
      overdue: 2,
      efficiency: 75
    }
  ],
  cycle_performance: [
    {
      cycle: 'Sprint 1 - Foundation',
      planned_issues: 20,
      completed_issues: 18,
      completion_rate: 90,
      days_remaining: 0
    },
    {
      cycle: 'Sprint 2 - Features',
      planned_issues: 18,
      completed_issues: 15,
      completion_rate: 83,
      days_remaining: 0
    },
    {
      cycle: 'Sprint 3 - Integration',
      planned_issues: 22,
      completed_issues: 19,
      completion_rate: 86,
      days_remaining: 0
    },
    {
      cycle: 'Sprint 4 - Testing',
      planned_issues: 16,
      completed_issues: 12,
      completion_rate: 75,
      days_remaining: 2
    },
    {
      cycle: 'Sprint 5 - Polish',
      planned_issues: 14,
      completed_issues: 8,
      completion_rate: 57,
      days_remaining: 5
    }
  ],
  module_progress: [
    {
      module: 'User Authentication',
      total_issues: 12,
      completed_issues: 10,
      progress: 83,
      days_remaining: 3
    },
    {
      module: 'Dashboard & Analytics',
      total_issues: 18,
      completed_issues: 12,
      progress: 67,
      days_remaining: 7
    },
    {
      module: 'API Integration',
      total_issues: 8,
      completed_issues: 3,
      progress: 38,
      days_remaining: 12
    },
    {
      module: 'Mobile App',
      total_issues: 15,
      completed_issues: 6,
      progress: 40,
      days_remaining: 10
    }
  ],
  time_tracking: [
    { date: '2024-01-01', logged_hours: 32, estimated_hours: 40, efficiency: 80 },
    { date: '2024-01-08', logged_hours: 38, estimated_hours: 40, efficiency: 95 },
    { date: '2024-01-15', logged_hours: 35, estimated_hours: 40, efficiency: 88 },
    { date: '2024-01-22', logged_hours: 42, estimated_hours: 40, efficiency: 105 },
    { date: '2024-01-29', logged_hours: 36, estimated_hours: 40, efficiency: 90 },
    { date: '2024-02-05', logged_hours: 39, estimated_hours: 40, efficiency: 98 },
    { date: '2024-02-12', logged_hours: 37, estimated_hours: 40, efficiency: 93 },
    { date: '2024-02-19', logged_hours: 41, estimated_hours: 40, efficiency: 103 }
  ]
};

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const handleTimeRangeChange = (range: '7d' | '30d' | '90d' | '1y') => {
    setTimeRange(range);
  };

  return (
    <EnhancedAppLayout>
      <div className="p-6">
        <EnhancedAnalytics
          data={mockAnalyticsData}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
        />
      </div>
    </EnhancedAppLayout>
  );
};

export default Analytics;
