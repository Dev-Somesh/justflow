import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  createdAt: string;
  comments: Comment[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}

// Mock data
const mockUsers: User[] = [
  { 
    id: 'user-1', 
    name: 'Alex Johnson', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    email: 'alex@example.com',
    role: 'Product Manager'
  },
  { 
    id: 'user-2', 
    name: 'Sarah Miller', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    email: 'sarah@example.com',
    role: 'UI Designer'
  },
  { 
    id: 'user-3', 
    name: 'Jamie Smith', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie',
    email: 'jamie@example.com',
    role: 'Developer'
  },
];

const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Website Redesign',
    description: 'Redesign company website with modern UI/UX',
    tasks: [
      {
        id: 'task-1',
        title: 'Design homepage mockup',
        description: 'Create a mockup for the new homepage design',
        status: 'todo',
        priority: 'high',
        assigneeId: 'user-1',
        createdAt: '2023-06-01T10:00:00Z',
        comments: [
          {
            id: 'comment-1',
            userId: 'user-2',
            content: 'I think we should use a hero image at the top',
            createdAt: '2023-06-02T14:30:00Z',
          }
        ],
      },
      {
        id: 'task-2',
        title: 'Implement responsive navigation',
        description: 'Create a responsive navigation menu for all device sizes',
        status: 'in-progress',
        priority: 'medium',
        assigneeId: 'user-3',
        createdAt: '2023-06-03T09:15:00Z',
        comments: [],
      },
      {
        id: 'task-3',
        title: 'Optimize image loading',
        description: 'Implement lazy loading for images to improve performance',
        status: 'done',
        priority: 'low',
        assigneeId: 'user-2',
        createdAt: '2023-06-05T11:45:00Z',
        comments: [],
      }
    ],
  },
  {
    id: 'project-2',
    name: 'Mobile App Development',
    description: 'Build a new mobile app for customer engagement',
    tasks: [
      {
        id: 'task-4',
        title: 'Create wireframes',
        description: 'Design initial wireframes for the app screens',
        status: 'todo',
        priority: 'medium',
        assigneeId: 'user-1',
        createdAt: '2023-06-10T08:30:00Z',
        comments: [],
      },
      {
        id: 'task-5',
        title: 'Set up development environment',
        description: 'Configure React Native environment for all developers',
        status: 'in-progress',
        priority: 'high',
        assigneeId: 'user-3',
        createdAt: '2023-06-12T13:20:00Z',
        comments: [],
      },
    ],
  },
];

// Context type
interface ProjectContextType {
  projects: Project[];
  users: User[];
  currentProject: Project | null;
  tasks: Task[];
  setCurrentProject: (project: Project) => void;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'comments'>) => void;
  updateTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => void;
  addComment: (projectId: string, taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  getTasksByStatus: (projectId: string, status: TaskStatus) => Task[];
  getUserById: (userId: string) => User | undefined;
}

// Create the context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider component
export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [users] = useState<User[]>(mockUsers);
  const [currentProject, setCurrentProject] = useState<Project | null>(mockProjects[0] || null);

  const tasks = projects.flatMap(project => project.tasks);

  const addTask = (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'comments'>) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: [
              ...project.tasks,
              {
                ...task,
                id: `task-${Date.now()}`,
                createdAt: new Date().toISOString(),
                comments: [],
              },
            ],
          };
        }
        return project;
      });
    });
  };

  const updateTaskStatus = (projectId: string, taskId: string, status: TaskStatus) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task => {
              if (task.id === taskId) {
                return { ...task, status };
              }
              return task;
            }),
          };
        }
        return project;
      });
    });
  };

  const addComment = (projectId: string, taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task => {
              if (task.id === taskId) {
                return {
                  ...task,
                  comments: [
                    ...task.comments,
                    {
                      ...comment,
                      id: `comment-${Date.now()}`,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                };
              }
              return task;
            }),
          };
        }
        return project;
      });
    });
  };

  const getTasksByStatus = (projectId: string, status: TaskStatus): Task[] => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return [];
    return project.tasks.filter(task => task.status === status);
  };

  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  };

  const contextValue: ProjectContextType = {
    projects,
    users,
    currentProject,
    tasks,
    setCurrentProject,
    addTask,
    updateTaskStatus,
    addComment,
    getTasksByStatus,
    getUserById,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook to use the context
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
