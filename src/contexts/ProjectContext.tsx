
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

export interface TaskLabel {
  id: string;
  name: string;
  color: string;
}

export interface TimeRecord {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  note?: string;
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
  labels: TaskLabel[];
  timeRecords: TimeRecord[];
  dueDate?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}

// Mock data for labels
const defaultLabels: TaskLabel[] = [
  { id: 'label-1', name: 'Bug', color: '#F87171' },
  { id: 'label-2', name: 'Feature', color: '#60A5FA' },
  { id: 'label-3', name: 'Documentation', color: '#34D399' },
  { id: 'label-4', name: 'Design', color: '#A78BFA' },
  { id: 'label-5', name: 'Improvement', color: '#FBBF24' },
];

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
        labels: [{ id: 'label-4', name: 'Design', color: '#A78BFA' }],
        timeRecords: [],
        dueDate: '2023-06-10T23:59:59Z',
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
        labels: [{ id: 'label-2', name: 'Feature', color: '#60A5FA' }],
        timeRecords: [
          {
            id: 'time-1',
            userId: 'user-3',
            startTime: '2023-06-04T10:00:00Z',
            endTime: '2023-06-04T12:30:00Z',
            duration: 150,
            note: 'Started implementation of the responsive navbar',
          }
        ],
        dueDate: '2023-06-15T23:59:59Z',
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
        labels: [{ id: 'label-5', name: 'Improvement', color: '#FBBF24' }],
        timeRecords: [],
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
        labels: [{ id: 'label-4', name: 'Design', color: '#A78BFA' }],
        timeRecords: [],
        dueDate: '2023-06-20T23:59:59Z',
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
        labels: [{ id: 'label-3', name: 'Documentation', color: '#34D399' }],
        timeRecords: [],
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
  availableLabels: TaskLabel[];
  setCurrentProject: (project: Project) => void;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'comments' | 'labels' | 'timeRecords'>) => void;
  updateTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => void;
  addComment: (projectId: string, taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  getTasksByStatus: (projectId: string, status: TaskStatus) => Task[];
  getUserById: (userId: string) => User | undefined;
  filterTasks: (projectId: string, query: string, filters: TaskFilters) => Task[];
  addLabelToTask: (projectId: string, taskId: string, labelId: string) => void;
  removeLabelFromTask: (projectId: string, taskId: string, labelId: string) => void;
  addTimeRecord: (projectId: string, taskId: string, timeRecord: Omit<TimeRecord, 'id'>) => void;
  updateTaskDueDate: (projectId: string, taskId: string, dueDate?: string) => void;
}

// Task filters type
export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assigneeId?: string[];
  labelIds?: string[];
  dueDateFrom?: string;
  dueDateTo?: string;
}

// Create the context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider component
export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [users] = useState<User[]>(mockUsers);
  const [currentProject, setCurrentProject] = useState<Project | null>(mockProjects[0] || null);
  const [availableLabels] = useState<TaskLabel[]>(defaultLabels);

  const tasks = projects.flatMap(project => project.tasks);

  const addTask = (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'comments' | 'labels' | 'timeRecords'>) => {
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
                labels: [],
                timeRecords: [],
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

  const filterTasks = (projectId: string, query: string, filters: TaskFilters): Task[] => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return [];
    
    return project.tasks.filter(task => {
      // Text search
      const matchesQuery = query === '' || 
        task.title.toLowerCase().includes(query.toLowerCase()) || 
        task.description.toLowerCase().includes(query.toLowerCase());
      
      // Status filter
      const matchesStatus = !filters.status?.length || 
        filters.status.includes(task.status);
      
      // Priority filter
      const matchesPriority = !filters.priority?.length || 
        filters.priority.includes(task.priority);
      
      // Assignee filter
      const matchesAssignee = !filters.assigneeId?.length || 
        (task.assigneeId && filters.assigneeId.includes(task.assigneeId));
      
      // Label filter
      const matchesLabels = !filters.labelIds?.length || 
        task.labels.some(label => filters.labelIds?.includes(label.id));
      
      // Due date filter
      const taskDueDate = task.dueDate ? new Date(task.dueDate).getTime() : null;
      const fromDate = filters.dueDateFrom ? new Date(filters.dueDateFrom).getTime() : null;
      const toDate = filters.dueDateTo ? new Date(filters.dueDateTo).getTime() : null;
      
      const matchesDueDate = 
        (!fromDate || (taskDueDate && taskDueDate >= fromDate)) && 
        (!toDate || (taskDueDate && taskDueDate <= toDate));
      
      return matchesQuery && matchesStatus && matchesPriority && 
             matchesAssignee && matchesLabels && matchesDueDate;
    });
  };

  const addLabelToTask = (projectId: string, taskId: string, labelId: string) => {
    const labelToAdd = availableLabels.find(label => label.id === labelId);
    if (!labelToAdd) return;

    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task => {
              if (task.id === taskId && !task.labels.some(label => label.id === labelId)) {
                return {
                  ...task,
                  labels: [...task.labels, labelToAdd],
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

  const removeLabelFromTask = (projectId: string, taskId: string, labelId: string) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task => {
              if (task.id === taskId) {
                return {
                  ...task,
                  labels: task.labels.filter(label => label.id !== labelId),
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

  const addTimeRecord = (projectId: string, taskId: string, timeRecord: Omit<TimeRecord, 'id'>) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task => {
              if (task.id === taskId) {
                return {
                  ...task,
                  timeRecords: [
                    ...task.timeRecords,
                    {
                      ...timeRecord,
                      id: `time-${Date.now()}`,
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

  const updateTaskDueDate = (projectId: string, taskId: string, dueDate?: string) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task => {
              if (task.id === taskId) {
                return { ...task, dueDate };
              }
              return task;
            }),
          };
        }
        return project;
      });
    });
  };

  const contextValue: ProjectContextType = {
    projects,
    users,
    currentProject,
    tasks,
    availableLabels,
    setCurrentProject,
    addTask,
    updateTaskStatus,
    addComment,
    getTasksByStatus,
    getUserById,
    filterTasks,
    addLabelToTask,
    removeLabelFromTask,
    addTimeRecord,
    updateTaskDueDate,
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
