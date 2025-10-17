// Mock data initialization for development
export const initializeMockData = () => {
  // Initialize projects if not exists
  if (!localStorage.getItem('justflow.projects')) {
    const mockProjects = [
      {
        id: 'project-1',
        name: 'JustFlow Development',
        description: 'Main development project for JustFlow application',
        dueDate: '2024-12-31',
        team: [
          { id: 'user-1', name: 'John Doe', role: 'Lead Developer' },
          { id: 'user-2', name: 'Jane Smith', role: 'UI/UX Designer' },
          { id: 'user-3', name: 'Bob Johnson', role: 'Backend Developer' }
        ]
      },
      {
        id: 'project-2',
        name: 'Marketing Campaign',
        description: 'Q1 2024 marketing campaign project',
        dueDate: '2024-03-31',
        team: [
          { id: 'user-4', name: 'Alice Brown', role: 'Marketing Manager' },
          { id: 'user-5', name: 'Charlie Wilson', role: 'Content Creator' }
        ]
      }
    ];
    localStorage.setItem('justflow.projects', JSON.stringify(mockProjects));
  }

  // Initialize tasks if not exists
  if (!localStorage.getItem('justflow.tasks')) {
    const mockTasks = [
      {
        id: 'task-1',
        projectId: 'project-1',
        title: 'Implement user authentication',
        description: 'Add login and registration functionality',
        status: 'done',
        priority: 'high',
        assigneeId: 'user-1',
        storyPoints: 8,
        dueDate: '2024-01-15',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      },
      {
        id: 'task-2',
        projectId: 'project-1',
        title: 'Design dashboard UI',
        description: 'Create modern and responsive dashboard interface',
        status: 'in-progress',
        priority: 'high',
        assigneeId: 'user-2',
        storyPoints: 5,
        dueDate: '2024-01-20',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z'
      },
      {
        id: 'task-3',
        projectId: 'project-1',
        title: 'Setup database schema',
        description: 'Design and implement database structure',
        status: 'todo',
        priority: 'medium',
        assigneeId: 'user-3',
        storyPoints: 13,
        dueDate: '2024-01-25',
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z'
      },
      {
        id: 'task-4',
        projectId: 'project-1',
        title: 'Write API documentation',
        description: 'Document all API endpoints and usage',
        status: 'todo',
        priority: 'low',
        assigneeId: 'user-1',
        storyPoints: 3,
        dueDate: '2024-01-30',
        createdAt: '2024-01-04T00:00:00Z',
        updatedAt: '2024-01-04T00:00:00Z'
      },
      {
        id: 'task-5',
        projectId: 'project-2',
        title: 'Create social media content',
        description: 'Design posts for Facebook, Twitter, and LinkedIn',
        status: 'in-progress',
        priority: 'medium',
        assigneeId: 'user-5',
        storyPoints: 8,
        dueDate: '2024-02-15',
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-12T00:00:00Z'
      },
      {
        id: 'task-6',
        projectId: 'project-2',
        title: 'Plan email campaign',
        description: 'Design and schedule email marketing campaign',
        status: 'done',
        priority: 'high',
        assigneeId: 'user-4',
        storyPoints: 5,
        dueDate: '2024-01-10',
        createdAt: '2024-01-06T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z'
      }
    ];
    localStorage.setItem('justflow.tasks', JSON.stringify(mockTasks));
  }
};

// Initialize mock data when this module is imported
if (typeof window !== 'undefined') {
  initializeMockData();
}
