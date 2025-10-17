// Page types inspired by Plane's Pages functionality
export interface Page {
  id: string;
  name: string;
  description?: string;
  content: string;
  content_html?: string;
  content_json?: any;
  created_by: User;
  updated_by?: User;
  created_at: string;
  updated_at: string;
  project: string;
  workspace: string;
  is_favorite: boolean;
  is_locked: boolean;
  access: 'private' | 'public' | 'workspace';
  parent?: string; // For nested pages
  sub_pages_count: number;
  view_props: PageViewProps;
  // AI features
  ai_summary?: string;
  ai_tags?: string[];
  // Collaboration
  collaborators: User[];
  // Version control
  version: number;
  previous_version?: string;
}

export interface PageViewProps {
  filters: {
    created_by?: string[];
    updated_by?: string[];
    access?: string[];
    created_at?: string;
    updated_at?: string;
  };
  display_filters: {
    group_by?: 'created_by' | 'updated_by' | 'access' | 'created_at' | 'updated_at';
    order_by?: 'name' | 'created_at' | 'updated_at';
    group_by_order?: 'asc' | 'desc';
    order_by_order?: 'asc' | 'desc';
  };
  display_properties: {
    created_by: boolean;
    updated_by: boolean;
    created_at: boolean;
    updated_at: boolean;
    access: boolean;
    sub_pages_count: boolean;
  };
}

export interface PageComment {
  id: string;
  comment: string;
  comment_html?: string;
  comment_stripped?: string;
  created_at: string;
  updated_at: string;
  created_by: User;
  updated_by?: User;
  page: string;
  // Thread support
  parent_comment?: string;
  replies: PageComment[];
  // Reactions
  reactions: CommentReaction[];
}

export interface CommentReaction {
  id: string;
  reaction: string;
  created_at: string;
  created_by: User;
}

export interface PageActivity {
  id: string;
  verb: string;
  field?: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
  created_by: User;
  page: string;
  project: string;
  workspace: string;
}

export interface PageTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  content_html?: string;
  content_json?: any;
  created_by: User;
  created_at: string;
  updated_at: string;
  workspace: string;
  is_public: boolean;
  category: string;
  tags: string[];
  usage_count: number;
}

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
}

// AI-powered features
export interface AIPageAnalysis {
  summary: string;
  key_points: string[];
  suggested_tags: string[];
  suggested_links: string[];
  readability_score: number;
  word_count: number;
  estimated_reading_time: number;
}

export interface PageSearchResult {
  id: string;
  name: string;
  content: string;
  content_html?: string;
  created_by: User;
  created_at: string;
  updated_at: string;
  project: string;
  workspace: string;
  relevance_score: number;
  matched_snippets: string[];
}
