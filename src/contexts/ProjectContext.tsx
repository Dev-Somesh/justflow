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

export interface Epic {
  id: string;
  name: string;
  description: string;
  color: string;
  status: 'active' | 'completed';
  createdAt: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed';
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
  epicId?: string;
  sprintId?: string;
  storyPoints?: number;
  parentTaskId?: string; // For sub-tasks
  childTaskIds?: string[]; // For parent-child relationships
  dependsOn?: string[]; // IDs of tasks this task depends on
  blockedBy?: string[]; // IDs of tasks blocking this task
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes, calculated from time records
}

// Mock data for labels
const defaultLabels: TaskLabel[] = [
  { id: 'label-1', name: 'Bug', color: '#F87171' },
  { id: 'label-2', name: 'Feature', color: '#60A5FA' },
  { id: 'label-3', name: 'Documentation', color: '#34D399' },
  { id: 'label-4', name: 'Design', color: '#A78BFA' },
  { id: 'label-5', name: 'Improvement', color: '#FBBF24' },
];

// Mock epics
const mockEpics: Epic[] = [
  {
    id: 'epic-1',
    name: 'User Authentication',
    description: 'Implement secure user authentication and authorization',
    color: '#8B5CF6',
    status: 'active',
    createdAt: '2023-05-15T08:00:00Z',
  },
  {
    id: 'epic-2',
    name: 'Reporting Dashboard',
    description: 'Create comprehensive reporting dashboard for project metrics',
    color: '#EC4899',
    status: 'active',
    createdAt: '2023-05-20T10:30:00Z',
  }
];

// Mock sprints
const mockSprints: Sprint[] = [
  {
    id: 'sprint-1',
    name: 'Sprint 1',
    goal: 'Complete initial website mockups and authentication flow',
    startDate: '2023-06-01T00:00:00Z',
    endDate: '2023-06-15T23:59:59Z',
    status: 'completed',
  },
  {
    id: 'sprint-2',
    name: 'Sprint 2',
    goal: 'Implement responsive navigation and optimize performance',
    startDate: '2023-06-16T00:00:00Z',
    endDate: '2023-06-30T23:59:59Z',
    status: 'active',
  }
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
        epicId: 'epic-1',
        sprintId: 'sprint-1',
        storyPoints: 5,
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
        epicId: 'epic-1',
        sprintId: 'sprint-1',
        storyPoints: 3,
        childTaskIds: ['task-5'],
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
        epicId: 'epic-2',
        sprintId: 'sprint-2',
        storyPoints: 2,
      },
      {
        id: 'task-5',
        title: 'Add mobile menu toggle',
        description: 'Create a hamburger menu toggle for mobile navigation',
        status: 'todo',
        priority: 'medium',
        assigneeId: 'user-3',
        createdAt: '2023-06-05T11:45:00Z',
        comments: [],
        labels: [{ id: 'label-2', name: 'Feature', color: '#60A5FA' }],
        timeRecords: [],
        parentTaskId: 'task-2',
        sprintId: 'sprint-2',
        storyPoints: 1,
      },
      {
        id: 'task-6',
        title: 'Create content strategy',
        description: 'Develop a comprehensive content strategy for the new website',
        status: 'todo',
        priority: 'medium',
        assigneeId: 'user-2',
        createdAt: '2023-06-07T14:30:00Z',
        comments: [],
        labels: [{ id: 'label-3', name: 'Documentation', color: '#34D399' }],
        timeRecords: [],
        dueDate: '2023-06-25T23:59:59Z',
        epicId: 'epic-1',
        sprintId: 'sprint-2',
        storyPoints: 5,
        dependsOn: ['task-1'],
        estimatedTime: 480, // 8 hours
      },
      {
        id: 'task-7',
        title: 'SEO optimization',
        description: 'Implement SEO best practices across the website',
        status: 'todo',
        priority: 'high',
        assigneeId: 'user-1',
        createdAt: '2023-06-08T09:45:00Z',
        comments: [],
        labels: [{ id: 'label-5', name: 'Improvement', color: '#FBBF24' }],
        timeRecords: [],
        dueDate: '2023-06-30T23:59:59Z',
        epicId: 'epic-2',
        sprintId: 'sprint-2',
        storyPoints: 3,
        blockedBy: ['task-6'],
        estimatedTime: 360, // 6 hours
      }
    ],
    epics: mockEpics,
    sprints: mockSprints,
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
        sprintId: 'sprint-2',
        storyPoints: 3,
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
        sprintId: 'sprint-2',
        storyPoints: 2,
      },
    ],
    epics: [],
    sprints: [mockSprints[1]],
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
  addTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'comments' | 'labels' | 'timeRecords' | 'childTaskIds'>) => void;
  updateTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => void;
  addComment: (projectId: string, taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  getTasksByStatus: (projectId: string, status: TaskStatus) => Task[];
  getUserById: (userId: string) => User | undefined;
  filterTasks: (projectId: string, query: string, filters: TaskFilters) => Task[];
  addLabelToTask: (projectId: string, taskId: string, labelId: string) => void;
  removeLabelFromTask: (projectId: string, taskId: string, labelId: string) => void;
  addTimeRecord: (projectId: string, taskId: string, timeRecord: Omit<TimeRecord, 'id'>) => void;
  updateTaskDueDate: (projectId: string, taskId: string, dueDate?: string) => void;
  getEpics: (projectId: string) => Epic[];
  getSprints: (projectId: string) => Sprint[];
  addEpic: (projectId: string, epic: Omit<Epic, 'id' | 'createdAt'>) => void;
  addSprint: (projectId: string, sprint: Omit<Sprint, 'id'>) => void;
  addTaskToSprint: (projectId: string, taskId: string, sprintId: string) => void;
  addTaskToEpic: (projectId: string, taskId: string, epicId: string) => void;
  updateTaskStoryPoints: (projectId: string, taskId: string, storyPoints: number) => void;
  getChildTasks: (projectId: string, parentTaskId: string) => Task[];
  getTasksByEpic: (projectId: string, epicId: string) => Task[];
  getTasksBySprint: (projectId: string, sprintId: string) => Task[];
  getCurrentSprint: (projectId: string) => Sprint | undefined;
  getTaskDependencies: (projectId: string, taskId: string) => Task[];
  getTaskBlockers: (projectId: string, taskId: string) => Task[];
  addTaskDependency: (projectId: string, taskId: string, dependencyId: string) => void;
  removeTaskDependency: (projectId: string, taskId: string, dependencyId: string) => void;
  getUserWorkload: (projectId: string, userId: string) => { 
    assignedTasks: number;
    totalStoryPoints: number;
    estimatedHours: number;
  };
  getTeamWorkload: (projectId: string) => {
    [userId: string]: { 
      assignedTasks: number;
      totalStoryPoints: number;
      estimatedHours: number;
      user: User;
    }
  };
  updateTaskEstimatedTime: (projectId: string, taskId: string, minutes: number) => void;
  calculateTaskActualTime: (projectId: string, taskId: string) => number;
  getSprintCapacity: (projectId: string, sprintId: string) => {
    totalStoryPoints: number;
    assignedStoryPoints: number;
    remainingCapacity: number;
  };
  addTaskToBoard: (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'comments' | 'labels' | 'timeRecords' | 'childTaskIds' | 'dependsOn' | 'blockedBy' | 'estimatedTime' | 'actualTime'>) => void;
}

// Task filters type
export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assigneeId?: string[];
  labelIds?: string[];
  dueDateFrom?: string;
  dueDateTo?: string;
  epicId?: string;
  sprintId?: string;
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

  const addTask = (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'comments' | 'labels' | 'timeRecords' | 'childTaskIds'>) => {
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
                childTaskIds: [],
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

  const getEpics = (projectId: string): Epic[] => {
    const project = projects.find(p => p.id === projectId);
    return project?.epics || [];
  };

  const getSprints = (projectId: string): Sprint[] => {
    const project = projects.find(p => p.id === projectId);
    return project?.sprints || [];
  };

  const addEpic = (projectId: string, epic: Omit<Epic, 'id' | 'createdAt'>) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            epics: [
              ...project.epics,
              {
                ...epic,
                id: `epic-${Date.now()}`,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }
        return project;
      });
    });
  };

  const addSprint = (projectId: string, sprint: Omit<Sprint, 'id'>) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            sprints: [
              ...project.sprints,
              {
                ...sprint,
                id: `sprint-${Date.now()}`,
              },
            ],
          };
        }
        return project;
      });
    });
  };

  const addTaskToSprint = (projectId: string, taskId: string, sprintId: string) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task => {
              if (task.id === taskId) {
                return { ...task, sprintId };
              }
              return task;
            }),
          };
        }
        return project;
      });
    });
  };

  const addTaskToEpic = (projectId: string, taskId: string, epicId: string) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task => {
              if (task.id === taskId) {
                return { ...task, epicId };
              }
              return task;
            }),
          };
        }
        return project;
      });
    });
  };

  const updateTaskStoryPoints = (projectId: string, taskId: string, storyPoints: number) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task => {
              if (task.id === taskId) {
                return { ...task, storyPoints };
              }
              return task;
            }),
          };
        }
        return project;
      });
    });
  };

  const getChildTasks = (projectId: string, parentTaskId: string): Task[] => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return [];
    return project.tasks.filter(task => task.parentTaskId === parentTaskId);
  };

  const getTasksByEpic = (projectId: string, epicId: string): Task[] => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return [];
    return project.tasks.filter(task => task.epicId === epicId);
  };

  const getTasksBySprint = (projectId: string, sprintId: string): Task[] => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return [];
    return project.tasks.filter(task => task.sprintId === sprintId);
  };

  const getCurrentSprint = (projectId: string): Sprint | undefined => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return undefined;
    
    const today = new Date().toISOString();
    return project.sprints.find(sprint => 
      sprint.status === 'active' && 
      sprint.startDate <= today && 
      sprint.endDate >= today
    );
  };

  const getTaskDependencies = (projectId: string, taskId: string): Task[] => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return [];
    
    const task = project.tasks.find(t => t.id === taskId);
    if (!task || !task.dependsOn) return [];
    
    return project.tasks.filter(t => task.dependsOn?.includes(t.id));
  };

  const getTaskBlockers = (projectId: string, taskId: string): Task[] => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return [];
    
    const task = project.tasks.find(t => t.id === taskId);
    if (!task || !task.blockedBy) return [];
    
    return project.tasks.filter(t => task.blockedBy?.includes(t.id));
  };

  const addTaskDependency = (projectId: string, taskId: string, dependencyId: string) => {
    if (taskId === dependencyId) return; // Can't depend on itself
    
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task => {
              if (task.id === taskId) {
                const dependsOn = task.dependsOn || [];
                if (dependsOn.includes(dependencyId)) return task;
                
                return {
                  ...task,
                  dependsOn: [...dependsOn, dependencyId],
                };
              }
              if (task.id === dependencyId) {
                const blockedBy = task.blockedBy || [];
                if (blockedBy.includes(taskId)) return task;
                
                return {
                  ...task,
                  blockedBy: [...blockedBy, taskId],
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

  const removeTaskDependency = (projectId: string, taskId: string, dependencyId: string) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task => {
              if (task.id === taskId && task.dependsOn) {
                return {
                  ...task,
                  dependsOn: task.dependsOn.filter(id => id !== dependencyId),
                };
              }
              if (task.id === dependencyId && task.blockedBy) {
                return {
                  ...task,
                  blockedBy: task.blockedBy.filter(id => id !== taskId),
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

  const getUserWorkload = (projectId: string, userId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return { assignedTasks: 0, totalStoryPoints: 0, estimatedHours: 0 };
    
    const userTasks = project.tasks.filter(task => 
      task.assigneeId === userId && task.status !== 'done'
    );
    
    const totalStoryPoints = userTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
    const estimatedMinutes = userTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
    
    return {
      assignedTasks: userTasks.length,
      totalStoryPoints,
      estimatedHours: Math.round(estimatedMinutes / 60 * 10) / 10,
    };
  };

  const getTeamWorkload = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return {};
    
    const workload: {
      [userId: string]: { 
        assignedTasks: number;
        totalStoryPoints: number;
        estimatedHours: number;
        user: User;
      }
    } = {};
    
    users.forEach(user => {
      const userMetrics = getUserWorkload(projectId, user.id);
      workload[user.id] = {
        ...userMetrics,
        user,
      };
    });
    
    return workload;
  };

  const updateTaskEstimatedTime = (projectId: string, taskId: string, minutes: number) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task => {
              if (task.id === taskId) {
                return { ...task, estimatedTime: minutes };
              }
              return task;
            }),
          };
        }
        return project;
      });
    });
  };

  const calculateTaskActualTime = (projectId: string, taskId: string): number => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return 0;
    
    const task = project.tasks.find(t => t.id === taskId);
    if (!task) return 0;
    
    const totalMinutes = task.timeRecords.reduce((total, record) => {
      return total + (record.duration || 0);
    }, 0);
    
    return totalMinutes;
  };

  const getSprintCapacity = (projectId: string, sprintId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return { totalStoryPoints: 0, assignedStoryPoints: 0, remainingCapacity: 0 };
    
    // For simplicity, we'll define a total capacity based on the sprint
    const sprint = project.sprints.find(s => s.id === sprintId);
    if (!sprint) return { totalStoryPoints: 0, assignedStoryPoints: 0, remainingCapacity: 0 };
    
    // Simple capacity calculation based on sprint name (for demo purposes)
    const totalStoryPoints = parseInt(sprint.name.replace('Sprint ', '')) * 10;
    
    const sprintTasks = project.tasks.filter(t => t.sprintId === sprintId);
    const assignedStoryPoints = sprintTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
    
    return {
      totalStoryPoints,
      assignedStoryPoints,
      remainingCapacity: Math.max(0, totalStoryPoints - assignedStoryPoints),
    };
  };

  const addTaskToBoard = (
    projectId: string,
    task: Omit<Task, 'id' | 'createdAt' | 'comments' | 'labels' | 'timeRecords' | 'childTaskIds' | 'dependsOn' | 'blockedBy' | 'estimatedTime' | 'actualTime'>
  ) => {
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
                childTaskIds: [],
                dependsOn: [],
                blockedBy: [],
                estimatedTime: 0,
                actualTime: 0,
              },
            ],
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
    getEpics,
    getSprints,
    addEpic,
    addSprint,
    addTaskToSprint,
    addTaskToEpic,
    updateTaskStoryPoints,
    getChildTasks,
    getTasksByEpic,
    getTasksBySprint,
    getCurrentSprint,
    getTaskDependencies,
    getTaskBlockers,
    addTaskDependency,
    removeTaskDependency,
    getUserWorkload,
    getTeamWorkload,
    updateTaskEstimatedTime,
    calculateTaskActualTime,
    getSprintCapacity,
    addTaskToBoard,
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

