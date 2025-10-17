import React, { useState } from 'react';
import { CyclesList } from '@/components/features/cycles/CyclesList';
import { Cycle } from '@/types/cycle';
import EnhancedAppLayout from '@/components/layouts/EnhancedAppLayout';

// Mock data for development
const mockCycles: Cycle[] = [
  {
    id: '1',
    name: 'Sprint 1 - Foundation',
    description: 'Initial development sprint focusing on core features',
    start_date: '2024-01-01',
    end_date: '2024-01-15',
    owned_by: { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', display_name: 'John Doe', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_by: { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', display_name: 'John Doe', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    project: 'project-1',
    workspace: 'workspace-1',
    is_completed: false,
    is_started: true,
    progress: 75,
    total_issues: 12,
    completed_issues: 9,
    started_issues: 2,
    unstarted_issues: 1,
    backlog_issues: 0,
    cancelled_issues: 0,
    total_estimate: 40,
    completed_estimate: 30,
    started_estimate: 5,
    unstarted_estimate: 5,
    backlog_estimate: 0,
    cancelled_estimate: 0,
    sort_order: 1,
    view_props: {
      filters: {},
      display_filters: {
        group_by: 'state',
        order_by: 'created_at',
        group_by_order: 'asc',
        order_by_order: 'desc',
        sub_issue: false,
        show_empty_groups: true
      },
      display_properties: {
        assignee: true,
        created_on: true,
        due_date: true,
        key: true,
        labels: true,
        priority: true,
        state: true,
        sub_issue_count: true,
        attachment_count: true,
        link_count: true,
        estimate: true
      }
    }
  },
  {
    id: '2',
    name: 'Sprint 2 - Features',
    description: 'Feature development and enhancement sprint',
    start_date: '2024-01-16',
    end_date: '2024-01-30',
    owned_by: { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', display_name: 'Jane Smith', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_by: { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', display_name: 'Jane Smith', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    project: 'project-1',
    workspace: 'workspace-1',
    is_completed: false,
    is_started: false,
    progress: 0,
    total_issues: 8,
    completed_issues: 0,
    started_issues: 0,
    unstarted_issues: 8,
    backlog_issues: 0,
    cancelled_issues: 0,
    total_estimate: 32,
    completed_estimate: 0,
    started_estimate: 0,
    unstarted_estimate: 32,
    backlog_estimate: 0,
    cancelled_estimate: 0,
    sort_order: 2,
    view_props: {
      filters: {},
      display_filters: {
        group_by: 'state',
        order_by: 'created_at',
        group_by_order: 'asc',
        order_by_order: 'desc',
        sub_issue: false,
        show_empty_groups: true
      },
      display_properties: {
        assignee: true,
        created_on: true,
        due_date: true,
        key: true,
        labels: true,
        priority: true,
        state: true,
        sub_issue_count: true,
        attachment_count: true,
        link_count: true,
        estimate: true
      }
    }
  },
  {
    id: '3',
    name: 'Sprint 0 - Planning',
    description: 'Project planning and setup sprint',
    start_date: '2023-12-15',
    end_date: '2023-12-31',
    owned_by: { id: '3', first_name: 'Bob', last_name: 'Johnson', email: 'bob@example.com', display_name: 'Bob Johnson', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_by: { id: '3', first_name: 'Bob', last_name: 'Johnson', email: 'bob@example.com', display_name: 'Bob Johnson', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    project: 'project-1',
    workspace: 'workspace-1',
    is_completed: true,
    is_started: true,
    progress: 100,
    total_issues: 5,
    completed_issues: 5,
    started_issues: 0,
    unstarted_issues: 0,
    backlog_issues: 0,
    cancelled_issues: 0,
    total_estimate: 20,
    completed_estimate: 20,
    started_estimate: 0,
    unstarted_estimate: 0,
    backlog_estimate: 0,
    cancelled_estimate: 0,
    sort_order: 3,
    view_props: {
      filters: {},
      display_filters: {
        group_by: 'state',
        order_by: 'created_at',
        group_by_order: 'asc',
        order_by_order: 'desc',
        sub_issue: false,
        show_empty_groups: true
      },
      display_properties: {
        assignee: true,
        created_on: true,
        due_date: true,
        key: true,
        labels: true,
        priority: true,
        state: true,
        sub_issue_count: true,
        attachment_count: true,
        link_count: true,
        estimate: true
      }
    }
  }
];

const Cycles: React.FC = () => {
  const [cycles, setCycles] = useState<Cycle[]>(mockCycles);
  const [selectedCycle, setSelectedCycle] = useState<Cycle | null>(null);

  const handleCycleSelect = (cycle: Cycle) => {
    setSelectedCycle(cycle);
  };

  const handleCreateCycle = () => {
    // TODO: Implement create cycle functionality
  };

  const handleUpdateCycle = (cycle: Cycle) => {
    setCycles(prev => prev.map(c => c.id === cycle.id ? cycle : c));
  };

  const handleDeleteCycle = (cycleId: string) => {
    setCycles(prev => prev.filter(c => c.id !== cycleId));
  };

  const handleStartCycle = (cycleId: string) => {
    setCycles(prev => prev.map(c =>
      c.id === cycleId ? { ...c, is_started: true } : c
    ));
  };

  const handleCompleteCycle = (cycleId: string) => {
    setCycles(prev => prev.map(c =>
      c.id === cycleId ? { ...c, is_completed: true, progress: 100 } : c
    ));
  };

  return (
    <EnhancedAppLayout>
      <div className="p-6">
        <CyclesList
          cycles={cycles}
          onCycleSelect={handleCycleSelect}
          onCreateCycle={handleCreateCycle}
          onUpdateCycle={handleUpdateCycle}
          onDeleteCycle={handleDeleteCycle}
          onStartCycle={handleStartCycle}
          onCompleteCycle={handleCompleteCycle}
        />
      </div>
    </EnhancedAppLayout>
  );
};

export default Cycles;
