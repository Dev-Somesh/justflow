// Shared type definitions for JustFlow
// This file consolidates all common types used across the application

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  display_name: string;
  is_active: boolean;
  is_bot: boolean;
  created_at: string;
  updated_at: string;
  // Additional fields for JustFlow
  role?: string;
  phone?: string;
  department?: string;
  bio?: string;
}

export interface IssuePriority {
  id: string;
  name: 'urgent' | 'high' | 'medium' | 'low' | 'none';
  color: string;
  description?: string;
}

export interface IssueState {
  id: string;
  name: string;
  color: string;
  description?: string;
  group: 'backlog' | 'unstarted' | 'started' | 'completed' | 'cancelled';
  sequence: number;
}

export interface IssueLabel {
  id: string;
  name: string;
  color: string;
  description?: string;
  parent?: string;
}

export interface IssueAssignee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  display_name: string;
}

export interface IssueAttachment {
  id: string;
  name: string;
  size: number;
  mime_type: string;
  url: string;
  created_at: string;
  created_by: User;
}

export interface IssueComment {
  id: string;
  comment: string;
  comment_html?: string;
  comment_stripped?: string;
  created_at: string;
  updated_at: string;
  created_by: User;
  updated_by?: User;
  attachments: IssueAttachment[];
  reactions: CommentReaction[];
}

export interface CommentReaction {
  id: string;
  reaction: string;
  created_at: string;
  created_by: User;
}

export interface IssueActivity {
  id: string;
  verb: string;
  field?: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
  created_by: User;
  issue: string;
  project: string;
  workspace: string;
}

// Enhanced Issue interface with all fields
export interface Issue {
  id: string;
  name: string;
  description: string;
  description_html?: string;
  description_stripped?: string;
  priority: IssuePriority;
  state: IssueState;
  labels: IssueLabel[];
  assignees: IssueAssignee[];
  created_by: User;
  created_at: string;
  updated_at: string;
  project: string;
  workspace: string;
  parent?: string; // For sub-issues
  sub_issues_count: number;
  attachment_count: number;
  link_count: number;
  estimate_point?: number;
  start_date?: string;
  target_date?: string;
  completed_at?: string;
  archived_at?: string;
  is_draft: boolean;
  sort_order: number;
  external_id?: string;
  external_source?: string;
  external_url?: string;
  // Additional fields for JustFlow integration
  cycle_id?: string;
  module_id?: string;
  view_id?: string;
  // Rich text editor support
  description_json?: any;
  // File attachments
  attachments: IssueAttachment[];
  // Comments
  comments: IssueComment[];
  // Activity log
  activity: IssueActivity[];
}

// Filter and view types
export interface IssueFilter {
  id: string;
  name: string;
  query: string;
  created_by: User;
  created_at: string;
  updated_at: string;
  project: string;
  workspace: string;
  is_favorite: boolean;
  is_default: boolean;
  view_props: ViewProps;
}

export interface ViewProps {
  filters: {
    state?: string[];
    priority?: string[];
    assignees?: string[];
    labels?: string[];
    created_by?: string[];
    start_date?: string;
    target_date?: string;
    created_at?: string;
    updated_at?: string;
  };
  display_filters: {
    group_by?: 'state' | 'priority' | 'assignees' | 'labels' | 'created_by' | 'created_at' | 'updated_at';
    order_by?: 'sort_order' | 'created_at' | 'updated_at' | 'priority' | 'state' | 'name';
    group_by_order?: 'asc' | 'desc';
    order_by_order?: 'asc' | 'desc';
    sub_issue?: boolean;
    show_empty_groups?: boolean;
    calendar_date_range?: string;
  };
  display_properties: {
    assignee: boolean;
    created_on: boolean;
    due_date: boolean;
    key: boolean;
    labels: boolean;
    priority: boolean;
    state: boolean;
    sub_issue_count: boolean;
    attachment_count: boolean;
    link_count: boolean;
    estimate: boolean;
  };
}

// Module types
export interface Module {
  id: string;
  name: string;
  description?: string;
  description_html?: string;
  description_stripped?: string;
  lead: User;
  members: User[];
  created_by: User;
  created_at: string;
  updated_at: string;
  project: string;
  workspace: string;
  start_date?: string;
  target_date?: string;
  completed_at?: string;
  archived_at?: string;
  is_archived: boolean;
  is_favorite: boolean;
  sort_order: number;
  // Additional fields
  total_issues: number;
  completed_issues: number;
  started_issues: number;
  unstarted_issues: number;
  backlog_issues: number;
  cancelled_issues: number;
  total_estimate: number;
  completed_estimate: number;
  started_estimate: number;
  unstarted_estimate: number;
  backlog_estimate: number;
  cancelled_estimate: number;
  progress: number; // 0-100
  // View properties
  view_props: ModuleViewProps;
}

export interface ModuleViewProps {
  filters: {
    assignees?: string[];
    created_by?: string[];
    labels?: string[];
    priority?: string[];
    state?: string[];
    start_date?: string;
    target_date?: string;
    created_at?: string;
    updated_at?: string;
  };
  display_filters: {
    group_by?: 'state' | 'priority' | 'assignees' | 'labels' | 'created_by' | 'created_at' | 'updated_at';
    order_by?: 'sort_order' | 'created_at' | 'updated_at' | 'priority' | 'state' | 'name';
    group_by_order?: 'asc' | 'desc';
    order_by_order?: 'asc' | 'desc';
    sub_issue?: boolean;
    show_empty_groups?: boolean;
  };
  display_properties: {
    assignee: boolean;
    created_on: boolean;
    due_date: boolean;
    key: boolean;
    labels: boolean;
    priority: boolean;
    state: boolean;
    sub_issue_count: boolean;
    attachment_count: boolean;
    link_count: boolean;
    estimate: boolean;
  };
}

export interface ModuleIssue {
  id: string;
  issue: Issue;
  module: Module;
  created_at: string;
  updated_at: string;
  created_by: User;
  updated_by?: User;
}

export interface ModuleStats {
  total_issues: number;
  completed_issues: number;
  started_issues: number;
  unstarted_issues: number;
  backlog_issues: number;
  cancelled_issues: number;
  total_estimate: number;
  completed_estimate: number;
  started_estimate: number;
  unstarted_estimate: number;
  backlog_estimate: number;
  cancelled_estimate: number;
  progress_percentage: number;
  days_remaining: number;
  is_overdue: boolean;
}

// Cycle types
export interface Cycle {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  owned_by: User;
  created_by: User;
  created_at: string;
  updated_at: string;
  project: string;
  workspace: string;
  is_completed: boolean;
  is_started: boolean;
  progress: number; // 0-100
  total_issues: number;
  completed_issues: number;
  started_issues: number;
  unstarted_issues: number;
  backlog_issues: number;
  cancelled_issues: number;
  total_estimate: number;
  completed_estimate: number;
  started_estimate: number;
  unstarted_estimate: number;
  backlog_estimate: number;
  cancelled_estimate: number;
  // Additional fields
  sort_order: number;
  view_props: CycleViewProps;
}

export interface CycleViewProps {
  filters: {
    assignees?: string[];
    created_by?: string[];
    labels?: string[];
    priority?: string[];
    state?: string[];
    start_date?: string;
    target_date?: string;
    created_at?: string;
    updated_at?: string;
  };
  display_filters: {
    group_by?: 'state' | 'priority' | 'assignees' | 'labels' | 'created_by' | 'created_at' | 'updated_at';
    order_by?: 'sort_order' | 'created_at' | 'updated_at' | 'priority' | 'state' | 'name';
    group_by_order?: 'asc' | 'desc';
    order_by_order?: 'asc' | 'desc';
    sub_issue?: boolean;
    show_empty_groups?: boolean;
  };
  display_properties: {
    assignee: boolean;
    created_on: boolean;
    due_date: boolean;
    key: boolean;
    labels: boolean;
    priority: boolean;
    state: boolean;
    sub_issue_count: boolean;
    attachment_count: boolean;
    link_count: boolean;
    estimate: boolean;
  };
}

export interface CycleIssue {
  id: string;
  issue: Issue;
  cycle: Cycle;
  created_at: string;
  updated_at: string;
  created_by: User;
  updated_by?: User;
}

export interface CycleStats {
  total_issues: number;
  completed_issues: number;
  started_issues: number;
  unstarted_issues: number;
  backlog_issues: number;
  cancelled_issues: number;
  total_estimate: number;
  completed_estimate: number;
  started_estimate: number;
  unstarted_estimate: number;
  backlog_estimate: number;
  cancelled_estimate: number;
  progress_percentage: number;
  days_remaining: number;
  is_overdue: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Error types
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// Common utility types
export type Status = 'todo' | 'in-progress' | 'done' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
