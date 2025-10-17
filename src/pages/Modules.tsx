import React, { useState } from 'react';
import { ModulesList } from '@/components/features/modules/ModulesList';
import { Module } from '@/types/module';
import EnhancedAppLayout from '@/components/layouts/EnhancedAppLayout';

// Mock data for development
const mockModules: Module[] = [
  {
    id: '1',
    name: 'User Authentication',
    description: 'Complete user authentication system with login, registration, and password reset',
    lead: { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', display_name: 'John Doe', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    members: [
      { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', display_name: 'John Doe', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', display_name: 'Jane Smith', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' }
    ],
    created_by: { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', display_name: 'John Doe', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    project: 'project-1',
    workspace: 'workspace-1',
    start_date: '2024-01-01',
    target_date: '2024-01-25',
    is_archived: false,
    is_favorite: true,
    sort_order: 1,
    total_issues: 8,
    completed_issues: 6,
    started_issues: 1,
    unstarted_issues: 1,
    backlog_issues: 0,
    cancelled_issues: 0,
    total_estimate: 24,
    completed_estimate: 18,
    started_estimate: 3,
    unstarted_estimate: 3,
    backlog_estimate: 0,
    cancelled_estimate: 0,
    progress: 75,
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
    name: 'Dashboard & Analytics',
    description: 'Main dashboard with analytics and reporting features',
    lead: { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', display_name: 'Jane Smith', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    members: [
      { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', display_name: 'Jane Smith', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: '3', first_name: 'Bob', last_name: 'Johnson', email: 'bob@example.com', display_name: 'Bob Johnson', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' }
    ],
    created_by: { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', display_name: 'Jane Smith', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z',
    project: 'project-1',
    workspace: 'workspace-1',
    start_date: '2024-01-05',
    target_date: '2024-02-15',
    is_archived: false,
    is_favorite: false,
    sort_order: 2,
    total_issues: 12,
    completed_issues: 3,
    started_issues: 4,
    unstarted_issues: 5,
    backlog_issues: 0,
    cancelled_issues: 0,
    total_estimate: 40,
    completed_estimate: 10,
    started_estimate: 15,
    unstarted_estimate: 15,
    backlog_estimate: 0,
    cancelled_estimate: 0,
    progress: 25,
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
    name: 'API Integration',
    description: 'Third-party API integrations and webhooks',
    lead: { id: '3', first_name: 'Bob', last_name: 'Johnson', email: 'bob@example.com', display_name: 'Bob Johnson', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    members: [
      { id: '3', first_name: 'Bob', last_name: 'Johnson', email: 'bob@example.com', display_name: 'Bob Johnson', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' }
    ],
    created_by: { id: '3', first_name: 'Bob', last_name: 'Johnson', email: 'bob@example.com', display_name: 'Bob Johnson', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    project: 'project-1',
    workspace: 'workspace-1',
    start_date: '2024-01-20',
    target_date: '2024-03-01',
    is_archived: false,
    is_favorite: false,
    sort_order: 3,
    total_issues: 6,
    completed_issues: 0,
    started_issues: 0,
    unstarted_issues: 6,
    backlog_issues: 0,
    cancelled_issues: 0,
    total_estimate: 20,
    completed_estimate: 0,
    started_estimate: 0,
    unstarted_estimate: 20,
    backlog_estimate: 0,
    cancelled_estimate: 0,
    progress: 0,
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
    id: '4',
    name: 'Legacy System Migration',
    description: 'Migration from old system to new architecture',
    lead: { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', display_name: 'John Doe', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    members: [
      { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', display_name: 'John Doe', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' }
    ],
    created_by: { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', display_name: 'John Doe', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_at: '2023-12-01T00:00:00Z',
    updated_at: '2023-12-31T00:00:00Z',
    project: 'project-1',
    workspace: 'workspace-1',
    start_date: '2023-12-01',
    target_date: '2023-12-31',
    completed_at: '2023-12-31T00:00:00Z',
    is_archived: true,
    is_favorite: false,
    sort_order: 4,
    total_issues: 15,
    completed_issues: 15,
    started_issues: 0,
    unstarted_issues: 0,
    backlog_issues: 0,
    cancelled_issues: 0,
    total_estimate: 60,
    completed_estimate: 60,
    started_estimate: 0,
    unstarted_estimate: 0,
    backlog_estimate: 0,
    cancelled_estimate: 0,
    progress: 100,
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

const Modules: React.FC = () => {
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const handleModuleSelect = (module: Module) => {
    setSelectedModule(module);
  };

  const handleCreateModule = () => {
    // TODO: Implement create module functionality
  };

  const handleUpdateModule = (module: Module) => {
    setModules(prev => prev.map(m => m.id === module.id ? module : m));
  };

  const handleDeleteModule = (moduleId: string) => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
  };

  const handleArchiveModule = (moduleId: string) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, is_archived: !m.is_archived } : m
    ));
  };

  const handleToggleFavorite = (moduleId: string) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, is_favorite: !m.is_favorite } : m
    ));
  };

  return (
    <EnhancedAppLayout>
      <div className="p-6">
        <ModulesList
          modules={modules}
          onModuleSelect={handleModuleSelect}
          onCreateModule={handleCreateModule}
          onUpdateModule={handleUpdateModule}
          onDeleteModule={handleDeleteModule}
          onArchiveModule={handleArchiveModule}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
    </EnhancedAppLayout>
  );
};

export default Modules;
