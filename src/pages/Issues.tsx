import React, { useState, useEffect } from 'react';
import { IssuesList } from '@/components/features/issues/IssuesList';
import IssuesKanbanBoard from '@/components/features/issues/IssuesKanbanBoard';
import { Issue, IssueFilter } from '@/types/issue';
import EnhancedAppLayout from '@/components/layouts/EnhancedAppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid3X3, List } from 'lucide-react';

// Mock data for development
const mockIssues: Issue[] = [
  {
    id: '1',
    name: 'Implement user authentication',
    description: 'Add login and registration functionality with JWT tokens',
    priority: 'high',
    state: 'in_progress',
    labels: [
      { id: '1', name: 'Frontend', color: '#3B82F6' },
      { id: '2', name: 'Authentication', color: '#EF4444' }
    ],
    assignees: [
      { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', display_name: 'John Doe', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' }
    ],
    created_by: { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', display_name: 'John Doe', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    project: 'project-1',
    workspace: 'workspace-1',
    sub_issues_count: 3,
    attachment_count: 2,
    link_count: 1,
    estimate_point: 8,
    start_date: '2024-01-10',
    target_date: '2024-01-25',
    is_draft: false,
    sort_order: 1,
    attachments: [],
    comments: [],
    activity: []
  },
  {
    id: '2',
    name: 'Design new dashboard layout',
    description: 'Create a modern and responsive dashboard design',
    priority: 'medium',
    state: 'todo',
    labels: [
      { id: '3', name: 'Design', color: '#10B981' },
      { id: '4', name: 'UI/UX', color: '#8B5CF6' }
    ],
    assignees: [
      { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', display_name: 'Jane Smith', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' }
    ],
    created_by: { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', display_name: 'Jane Smith', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    project: 'project-1',
    workspace: 'workspace-1',
    sub_issues_count: 0,
    attachment_count: 0,
    link_count: 0,
    estimate_point: 5,
    target_date: '2024-01-30',
    is_draft: false,
    sort_order: 2,
    attachments: [],
    comments: [],
    activity: []
  },
  {
    id: '3',
    name: 'Fix critical bug in payment processing',
    description: 'Users are unable to complete payments due to a validation error',
    priority: 'urgent',
    state: 'completed',
    labels: [
      { id: '5', name: 'Bug', color: '#F59E0B' },
      { id: '6', name: 'Backend', color: '#6B7280' }
    ],
    assignees: [
      { id: '3', first_name: 'Bob', last_name: 'Johnson', email: 'bob@example.com', display_name: 'Bob Johnson', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' }
    ],
    created_by: { id: '3', first_name: 'Bob', last_name: 'Johnson', email: 'bob@example.com', display_name: 'Bob Johnson', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    project: 'project-1',
    workspace: 'workspace-1',
    sub_issues_count: 0,
    attachment_count: 1,
    link_count: 0,
    estimate_point: 3,
    start_date: '2024-01-05',
    target_date: '2024-01-08',
    completed_at: '2024-01-10T00:00:00Z',
    is_draft: false,
    sort_order: 3,
    attachments: [],
    comments: [],
    activity: []
  }
];

const mockFilters: IssueFilter[] = [
  {
    id: '1',
    name: 'My Issues',
    query: 'assignee:me',
    created_by: { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', display_name: 'John Doe', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    project: 'project-1',
    workspace: 'workspace-1',
    is_favorite: true,
    is_default: false,
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

const Issues: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [filters, setFilters] = useState<IssueFilter[]>(mockFilters);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const handleIssueSelect = (issue: Issue) => {
    setSelectedIssue(issue);
    // In a real app, this would open a modal or navigate to issue detail
  };

  const handleCreateIssue = (state?: string) => {
    // In a real app, this would open a create issue modal
  };

  const handleUpdateIssue = (issue: Issue) => {
    setIssues(prev => prev.map(i => i.id === issue.id ? issue : i));
  };

  const handleDeleteIssue = (issueId: string) => {
    setIssues(prev => prev.filter(i => i.id !== issueId));
  };

  const handleFilterChange = (filter: IssueFilter) => {
    // In a real app, this would apply the filter to the issues list
  };

  return (
    <EnhancedAppLayout>
      <div className="p-6 w-full">
        <div className="space-y-6 w-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold">Issues</h2>
              <span className="text-sm text-gray-500">{issues.length} issues</span>
            </div>
          </div>

          {/* View Mode Tabs */}
          <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="kanban" className="flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  Kanban
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  List
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="kanban" className="space-y-4 w-full">
              <IssuesKanbanBoard
                issues={issues}
                filters={filters}
                onFilterChange={handleFilterChange}
                onIssueSelect={handleIssueSelect}
                onCreateIssue={handleCreateIssue}
                onUpdateIssue={handleUpdateIssue}
                onDeleteIssue={handleDeleteIssue}
              />
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              <IssuesList
                issues={issues}
                filters={filters}
                onFilterChange={handleFilterChange}
                onIssueSelect={handleIssueSelect}
                onCreateIssue={handleCreateIssue}
                onUpdateIssue={handleUpdateIssue}
                onDeleteIssue={handleDeleteIssue}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </EnhancedAppLayout>
  );
};

export default Issues;
