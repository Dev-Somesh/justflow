import React, { useState } from 'react';
import { PagesList } from '@/components/features/pages/PagesList';
import { Page, PageTemplate } from '@/types/page';
import EnhancedAppLayout from '@/components/layouts/EnhancedAppLayout';

// Mock data for development
const mockPages: Page[] = [
  {
    id: '1',
    name: 'Project Overview',
    description: 'High-level overview of the project goals and objectives',
    content: '# Project Overview\n\nThis document provides a comprehensive overview of our project goals, objectives, and key milestones.\n\n## Goals\n- Build a modern project management platform\n- Improve team collaboration\n- Streamline workflow processes\n\n## Key Features\n- Task management\n- Team collaboration\n- Analytics and reporting',
    content_html: '<h1>Project Overview</h1><p>This document provides a comprehensive overview of our project goals, objectives, and key milestones.</p><h2>Goals</h2><ul><li>Build a modern project management platform</li><li>Improve team collaboration</li><li>Streamline workflow processes</li></ul><h2>Key Features</h2><ul><li>Task management</li><li>Team collaboration</li><li>Analytics and reporting</li></ul>',
    created_by: { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', display_name: 'John Doe', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    updated_by: { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', display_name: 'John Doe', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    project: 'project-1',
    workspace: 'workspace-1',
    is_favorite: true,
    is_locked: false,
    access: 'workspace',
    sub_pages_count: 3,
    view_props: {
      filters: {},
      display_filters: {
        group_by: 'created_by',
        order_by: 'updated_at',
        group_by_order: 'asc',
        order_by_order: 'desc'
      },
      display_properties: {
        created_by: true,
        updated_by: true,
        created_at: true,
        updated_at: true,
        access: true,
        sub_pages_count: true
      }
    },
    collaborators: [
      { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', display_name: 'John Doe', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', display_name: 'Jane Smith', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' }
    ],
    version: 3,
    ai_summary: 'Project overview document covering goals, features, and milestones',
    ai_tags: ['project', 'overview', 'goals', 'features']
  },
  {
    id: '2',
    name: 'API Documentation',
    description: 'Complete API reference and integration guide',
    content: '# API Documentation\n\n## Authentication\n\nAll API requests require authentication using JWT tokens.\n\n```javascript\nconst token = localStorage.getItem(\'auth_token\');\nconst response = await fetch(\'/api/endpoint\', {\n  headers: {\n    \'Authorization\': `Bearer ${token}`\n  }\n});\n```\n\n## Endpoints\n\n### Users\n- `GET /api/users` - List all users\n- `POST /api/users` - Create new user\n- `PUT /api/users/:id` - Update user\n- `DELETE /api/users/:id` - Delete user',
    content_html: '<h1>API Documentation</h1><h2>Authentication</h2><p>All API requests require authentication using JWT tokens.</p><pre><code>const token = localStorage.getItem(\'auth_token\');\nconst response = await fetch(\'/api/endpoint\', {\n  headers: {\n    \'Authorization\': `Bearer ${token}`\n  }\n});</code></pre><h2>Endpoints</h2><h3>Users</h3><ul><li><code>GET /api/users</code> - List all users</li><li><code>POST /api/users</code> - Create new user</li><li><code>PUT /api/users/:id</code> - Update user</li><li><code>DELETE /api/users/:id</code> - Delete user</li></ul>',
    created_by: { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', display_name: 'Jane Smith', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    updated_by: { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', display_name: 'Jane Smith', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z',
    project: 'project-1',
    workspace: 'workspace-1',
    is_favorite: false,
    is_locked: false,
    access: 'public',
    sub_pages_count: 0,
    view_props: {
      filters: {},
      display_filters: {
        group_by: 'created_by',
        order_by: 'updated_at',
        group_by_order: 'asc',
        order_by_order: 'desc'
      },
      display_properties: {
        created_by: true,
        updated_by: true,
        created_at: true,
        updated_at: true,
        access: true,
        sub_pages_count: true
      }
    },
    collaborators: [
      { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', display_name: 'Jane Smith', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' }
    ],
    version: 2,
    ai_summary: 'API documentation with authentication and endpoint details',
    ai_tags: ['api', 'documentation', 'authentication', 'endpoints']
  },
  {
    id: '3',
    name: 'Team Guidelines',
    description: 'Internal team guidelines and best practices',
    content: '# Team Guidelines\n\n## Code Review Process\n\n1. All code must be reviewed before merging\n2. At least one approval required\n3. Automated tests must pass\n\n## Communication\n\n- Use Slack for daily communication\n- Email for formal announcements\n- Meetings should have clear agendas\n\n## Development Workflow\n\n1. Create feature branch from main\n2. Make changes and commit\n3. Push and create pull request\n4. Address review feedback\n5. Merge after approval',
    content_html: '<h1>Team Guidelines</h1><h2>Code Review Process</h2><ol><li>All code must be reviewed before merging</li><li>At least one approval required</li><li>Automated tests must pass</li></ol><h2>Communication</h2><ul><li>Use Slack for daily communication</li><li>Email for formal announcements</li><li>Meetings should have clear agendas</li></ul><h2>Development Workflow</h2><ol><li>Create feature branch from main</li><li>Make changes and commit</li><li>Push and create pull request</li><li>Address review feedback</li><li>Merge after approval</li></ol>',
    created_by: { id: '3', first_name: 'Bob', last_name: 'Johnson', email: 'bob@example.com', display_name: 'Bob Johnson', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    updated_by: { id: '3', first_name: 'Bob', last_name: 'Johnson', email: 'bob@example.com', display_name: 'Bob Johnson', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z',
    project: 'project-1',
    workspace: 'workspace-1',
    is_favorite: true,
    is_locked: true,
    access: 'private',
    sub_pages_count: 1,
    view_props: {
      filters: {},
      display_filters: {
        group_by: 'created_by',
        order_by: 'updated_at',
        group_by_order: 'asc',
        order_by_order: 'desc'
      },
      display_properties: {
        created_by: true,
        updated_by: true,
        created_at: true,
        updated_at: true,
        access: true,
        sub_pages_count: true
      }
    },
    collaborators: [
      { id: '3', first_name: 'Bob', last_name: 'Johnson', email: 'bob@example.com', display_name: 'Bob Johnson', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' }
    ],
    version: 1,
    ai_summary: 'Team guidelines covering code review, communication, and development workflow',
    ai_tags: ['team', 'guidelines', 'process', 'workflow']
  }
];

const mockTemplates: PageTemplate[] = [
  {
    id: '1',
    name: 'Meeting Notes',
    description: 'Template for recording meeting notes',
    content: '# Meeting Notes\n\n**Date:** [Date]\n**Attendees:** [List attendees]\n**Agenda:** [Meeting agenda]\n\n## Discussion Points\n\n- [Point 1]\n- [Point 2]\n- [Point 3]\n\n## Action Items\n\n- [ ] [Action item 1] - [Assignee] - [Due date]\n- [ ] [Action item 2] - [Assignee] - [Due date]\n\n## Next Steps\n\n[Next steps and follow-up items]',
    created_by: { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', display_name: 'John Doe', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    workspace: 'workspace-1',
    is_public: true,
    category: 'Meeting',
    tags: ['meeting', 'notes', 'template'],
    usage_count: 15
  },
  {
    id: '2',
    name: 'Project Brief',
    description: 'Template for project briefs and proposals',
    content: '# Project Brief\n\n## Project Overview\n\n**Project Name:** [Project name]\n**Client:** [Client name]\n**Timeline:** [Start date] - [End date]\n**Budget:** [Budget]\n\n## Objectives\n\n- [Objective 1]\n- [Objective 2]\n- [Objective 3]\n\n## Scope\n\n### In Scope\n- [Item 1]\n- [Item 2]\n\n### Out of Scope\n- [Item 1]\n- [Item 2]\n\n## Deliverables\n\n- [Deliverable 1]\n- [Deliverable 2]\n\n## Success Criteria\n\n- [Criterion 1]\n- [Criterion 2]',
    created_by: { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', display_name: 'Jane Smith', is_active: true, is_bot: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    workspace: 'workspace-1',
    is_public: true,
    category: 'Project',
    tags: ['project', 'brief', 'proposal'],
    usage_count: 8
  }
];

const Pages: React.FC = () => {
  const [pages, setPages] = useState<Page[]>(mockPages);
  const [templates, setTemplates] = useState<PageTemplate[]>(mockTemplates);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  const handlePageSelect = (page: Page) => {
    setSelectedPage(page);
  };

  const handleCreatePage = () => {
    // TODO: Implement create page functionality
  };

  const handleCreateFromTemplate = (template: PageTemplate) => {
    // TODO: Implement create page from template functionality
  };

  const handleUpdatePage = (page: Page) => {
    setPages(prev => prev.map(p => p.id === page.id ? page : p));
  };

  const handleDeletePage = (pageId: string) => {
    setPages(prev => prev.filter(p => p.id !== pageId));
  };

  const handleToggleFavorite = (pageId: string) => {
    setPages(prev => prev.map(p =>
      p.id === pageId ? { ...p, is_favorite: !p.is_favorite } : p
    ));
  };

  const handleToggleLock = (pageId: string) => {
    setPages(prev => prev.map(p =>
      p.id === pageId ? { ...p, is_locked: !p.is_locked } : p
    ));
  };

  const handleSharePage = (page: Page) => {
    // TODO: Implement share page functionality
  };

  return (
    <EnhancedAppLayout>
      <div className="p-6">
        <PagesList
          pages={pages}
          templates={templates}
          onPageSelect={handlePageSelect}
          onCreatePage={handleCreatePage}
          onCreateFromTemplate={handleCreateFromTemplate}
          onUpdatePage={handleUpdatePage}
          onDeletePage={handleDeletePage}
          onToggleFavorite={handleToggleFavorite}
          onToggleLock={handleToggleLock}
          onSharePage={handleSharePage}
        />
      </div>
    </EnhancedAppLayout>
  );
};

export default Pages;
