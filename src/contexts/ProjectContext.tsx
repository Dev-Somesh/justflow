
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Type definitions
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type EpicStatus = 'active' | 'completed';
export type SprintStatus = 'planning' | 'active' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  skills?: string[];
  bio?: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
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
  dueDate?: string;
  createdAt: string;
  labels: Label[];
  comments: Comment[];
  storyPoints?: number;
  timeRecords: TimeRecord[];
  childTaskIds: string[];
  epicId?: string;
  sprintId?: string;
  projectId: string; // Project ID this task belongs to
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal?: string;
  status: SprintStatus;
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  status: EpicStatus;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  name?: string; // Added for compatibility with existing code
  color?: string; // Added for compatibility with existing code
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  sprints: Sprint[];
  epics: Epic[];
  dueDate?: string; // Added to fix error
  team?: User[]; // Added to fix error
}

export interface UserWorkload {
  user: User;
  assignedTasks: number;
  totalStoryPoints: number;
  estimatedHours: number;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assigneeId?: string[];
  labelIds?: string[];
  dueDateFrom?: string;
  dueDateTo?: string;
}

// Context type
interface ProjectContextType {
  projects: Project[];
  users: User[];
  availableLabels: Label[];
  currentProject: Project | null;
  tasks: Task[];
  setCurrentProject: (projectId: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'comments' | 'labels' | 'timeRecords' | 'childTaskIds' | 'projectId'>) => void;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
  getTasksByStatus: (projectId: string, status: TaskStatus) => Task[];
  updateTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => void;
  addComment: (projectId: string, taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  addTimeRecord: (projectId: string, taskId: string, record: Omit<TimeRecord, 'id'>) => void;
  getUserById: (userId: string) => User | undefined;
  filterTasks: (projectId: string, query: string, filters: TaskFilters) => Task[];
  addSprint: (projectId: string, sprint: Omit<Sprint, 'id'>) => void;
  updateSprint: (projectId: string, sprintId: string, updates: Partial<Sprint>) => void;
  getSprints: (projectId: string) => Sprint[];
  getCurrentSprint: (projectId: string) => Sprint | undefined;
  addEpic: (projectId: string, epic: Omit<Epic, 'id' | 'createdAt'>) => void;
  updateEpic: (projectId: string, epicId: string, updates: Partial<Epic>) => void;
  getEpics: (projectId: string) => Epic[];
  assignTaskToEpic: (projectId: string, taskId: string, epicId: string) => void;
  removeTaskFromEpic: (projectId: string, taskId: string) => void;
  getTasksByEpic: (projectId: string, epicId: string) => Task[];
  assignTaskToSprint: (projectId: string, taskId: string, sprintId: string) => void;
  removeTaskFromSprint: (projectId: string, taskId: string) => void;
  getTasksBySprint: (projectId: string, sprintId: string) => Task[];
  getTeamWorkload: (projectId: string) => Record<string, UserWorkload>;
  addLabelToTask: (projectId: string, taskId: string, labelId: string) => void;
  removeLabelFromTask: (projectId: string, taskId: string, labelId: string) => void;
  updateTaskDueDate: (projectId: string, taskId: string, dueDate?: string) => void;
  getSprintCapacity: (projectId: string, sprintId: string) => { totalStoryPoints: number, assignedStoryPoints: number, remainingCapacity: number };
  addTaskToSprint: (projectId: string, taskId: string, sprintId: string) => void;
  getUserWorkload: (projectId: string, userId: string) => UserWorkload | undefined;
}

// Create the context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider component
interface ProjectProviderProps {
  children: ReactNode;
}

// Local storage keys
const STORAGE_KEYS = {
  PROJECTS: 'justflow_projects',
  CURRENT_PROJECT: 'justflow_current_project'
};

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  // Initialize with demo data or load from localStorage
  const initialProjects: Project[] = [
    {
      id: 'project-1',
      name: 'JustFlow App',
      description: 'Project management tool for agile teams',
      tasks: [
        {
          id: 'task-1',
          title: 'Design landing page',
          description: 'Create the design for the landing page with modern UI elements',
          status: 'todo',
          priority: 'high',
          assigneeId: 'user-2',
          createdAt: '2023-05-15T10:00:00Z',
          labels: [{ id: 'label-5', name: 'Design', color: '#9b59b6' }],
          comments: [],
          timeRecords: [],
          childTaskIds: [],
          projectId: 'project-1',
          storyPoints: 5
        },
        {
          id: 'task-2',
          title: 'Setup authentication',
          description: 'Implement user authentication system with email and social login',
          status: 'in-progress',
          priority: 'high',
          assigneeId: 'user-1',
          createdAt: '2023-05-16T09:30:00Z',
          labels: [{ id: 'label-2', name: 'Feature', color: '#3498db' }],
          comments: [],
          timeRecords: [],
          childTaskIds: [],
          projectId: 'project-1',
          storyPoints: 8
        },
        {
          id: 'task-3',
          title: 'Fix navigation bug',
          description: 'Fix the navigation bug where users are redirected to wrong page',
          status: 'done',
          priority: 'medium',
          assigneeId: 'user-1',
          createdAt: '2023-05-14T14:20:00Z',
          labels: [{ id: 'label-1', name: 'Bug', color: '#e74c3c' }],
          comments: [],
          timeRecords: [],
          childTaskIds: [],
          projectId: 'project-1',
          storyPoints: 3
        }
      ],
      sprints: [
        {
          id: 'sprint-1',
          name: 'Sprint 1',
          startDate: '2023-05-01T00:00:00Z',
          endDate: '2023-05-14T23:59:59Z',
          goal: 'Establish core functionality',
          status: 'completed'
        },
        {
          id: 'sprint-2',
          name: 'Sprint 2',
          startDate: '2023-05-15T00:00:00Z',
          endDate: '2023-05-28T23:59:59Z',
          goal: 'Enhance user experience',
          status: 'active'
        }
      ],
      epics: [
        {
          id: 'epic-1',
          title: 'User Management',
          name: 'User Management',
          description: 'All features related to user management including authentication',
          status: 'active',
          createdAt: '2023-04-01T10:00:00Z',
          color: '#3498db'
        }
      ],
      dueDate: '2024-02-01',
      team: [
        {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://i.pravatar.cc/150?img=1',
          role: 'Developer',
        },
        {
          id: 'user-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          avatar: 'https://i.pravatar.cc/150?img=2',
          role: 'Designer',
        },
        {
          id: 'user-3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          avatar: 'https://i.pravatar.cc/150?img=3',
          role: 'Product Manager',
        },
      ],
    },
  ];

  // Load projects from localStorage if available
  const loadProjects = (): Project[] => {
    try {
      const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return savedProjects ? JSON.parse(savedProjects) : initialProjects;
    } catch (error) {
      console.error('Error loading projects from localStorage:', error);
      return initialProjects;
    }
  };

  // Mock data for projects
  const [projects, setProjects] = useState<Project[]>(loadProjects);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving projects to localStorage:', error);
    }
  }, [projects]);

  // Mock data for users
  const [users] = useState<User[]>([
    {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'Developer',
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'Designer',
    },
    {
      id: 'user-3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'Product Manager',
    },
  ]);

  // Available labels
  const [availableLabels] = useState<Label[]>([
    { id: 'label-1', name: 'Bug', color: '#e74c3c' },
    { id: 'label-2', name: 'Feature', color: '#3498db' },
    { id: 'label-3', name: 'Enhancement', color: '#2ecc71' },
    { id: 'label-4', name: 'Documentation', color: '#f39c12' },
    { id: 'label-5', name: 'Design', color: '#9b59b6' },
  ]);

  // Load current project ID from localStorage
  const loadCurrentProjectId = (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT) || 'project-1';
    } catch {
      return 'project-1';
    }
  };

  // Current selected project
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(loadCurrentProjectId);

  // Save current project ID to localStorage when it changes
  useEffect(() => {
    try {
      if (currentProjectId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, currentProjectId);
      }
    } catch (error) {
      console.error('Error saving current project ID to localStorage:', error);
    }
  }, [currentProjectId]);

  // Computed current project
  const currentProject = currentProjectId
    ? projects.find(project => project.id === currentProjectId) || null
    : null;

  // Computed tasks from current project
  const tasks = currentProject ? currentProject.tasks : [];

  // Set current project
  const setCurrentProject = (projectId: string) => {
    setCurrentProjectId(projectId);
  };

  // Add a new project
  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`,
    };
    setProjects([...projects, newProject]);
    setCurrentProjectId(newProject.id);
  };

  // Update project
  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId ? { ...project, ...updates } : project
      )
    );
  };

  // Update the addTask function to include projectId
  const addTask = (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'comments' | 'labels' | 'timeRecords' | 'childTaskIds' | 'projectId'>) => {
    try {
      const newTask: Task = {
        ...task,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
        comments: [],
        labels: [],
        timeRecords: [],
        childTaskIds: [],
        projectId: projectId,
      };
      
      setProjects(prevProjects => {
        return prevProjects.map(project => {
          if (project.id === projectId) {
            return {
              ...project,
              tasks: [...project.tasks, newTask],
            };
          }
          return project;
        });
      });
      
      return newTask.id;
    } catch (error) {
      console.error("Error adding task:", error);
      throw new Error("Failed to add task. Please try again.");
    }
  };

  // Update task
  const updateTask = (projectId: string, taskId: string, updates: Partial<Task>) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === taskId ? { ...task, ...updates } : task
            ),
          };
        }
        return project;
      })
    );
  };

  // Delete task
  const deleteTask = (projectId: string, taskId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.filter(task => task.id !== taskId),
          };
        }
        return project;
      })
    );
  };

  // Get a specific task by ID
  const getTaskById = (taskId: string) => {
    for (const project of projects) {
      const task = project.tasks.find(task => task.id === taskId);
      if (task) return task;
    }
    return undefined;
  };

  // Get tasks by their status for a specific project
  const getTasksByStatus = (projectId: string, status: TaskStatus) => {
    const project = projects.find(project => project.id === projectId);
    if (!project) return [];
    return project.tasks.filter(task => task.status === status);
  };

  // Update task status
  const updateTaskStatus = (projectId: string, taskId: string, status: TaskStatus) => {
    updateTask(projectId, taskId, { status });
  };

  // Add a comment to a task
  const addComment = (projectId: string, taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
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
      })
    );
  };

  // Add a time record to a task
  const addTimeRecord = (projectId: string, taskId: string, record: Omit<TimeRecord, 'id'>) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
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
                      ...record,
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
      })
    );
  };

  // Get a specific user by ID
  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  // Filter tasks based on search query and filters
  const filterTasks = (projectId: string, query: string, filters: TaskFilters) => {
    const project = projects.find(project => project.id === projectId);
    if (!project) return [];

    return project.tasks.filter(task => {
      // Search by query
      if (query) {
        const searchTerms = query.toLowerCase();
        const matchesSearch =
          task.title.toLowerCase().includes(searchTerms) ||
          task.description.toLowerCase().includes(searchTerms);
        if (!matchesSearch) return false;
      }

      // Filter by status
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(task.status)) return false;
      }

      // Filter by priority
      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(task.priority)) return false;
      }

      // Filter by assignee
      if (filters.assigneeId && filters.assigneeId.length > 0) {
        if (filters.assigneeId.includes('unassigned')) {
          if (task.assigneeId) return false;
        } else if (!task.assigneeId || !filters.assigneeId.includes(task.assigneeId)) {
          return false;
        }
      }

      // Filter by labels
      if (filters.labelIds && filters.labelIds.length > 0) {
        const taskLabelIds = task.labels.map(label => label.id);
        const hasMatchingLabel = filters.labelIds.some(id => taskLabelIds.includes(id));
        if (!hasMatchingLabel) return false;
      }

      // Filter by due date range
      if (filters.dueDateFrom && task.dueDate) {
        const fromDate = new Date(filters.dueDateFrom);
        const taskDate = new Date(task.dueDate);
        if (taskDate < fromDate) return false;
      }

      if (filters.dueDateTo && task.dueDate) {
        const toDate = new Date(filters.dueDateTo);
        const taskDate = new Date(task.dueDate);
        if (taskDate > toDate) return false;
      }

      return true;
    });
  };

  // Sprint Management
  const addSprint = (projectId: string, sprint: Omit<Sprint, 'id'>) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          // If setting this sprint as active, set other sprints as completed
          let updatedSprints = [...project.sprints];
          if (sprint.status === 'active') {
            updatedSprints = updatedSprints.map(s =>
              s.status === 'active' ? { ...s, status: 'completed' } : s
            );
          }

          return {
            ...project,
            sprints: [
              ...updatedSprints,
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

  const updateSprint = (projectId: string, sprintId: string, updates: Partial<Sprint>) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          // If setting this sprint as active, set other sprints as completed
          let updatedSprints = [...project.sprints];
          if (updates.status === 'active') {
            updatedSprints = updatedSprints.map(s =>
              s.id !== sprintId && s.status === 'active' ? { ...s, status: 'completed' } : s
            );
          }

          return {
            ...project,
            sprints: updatedSprints.map(sprint =>
              sprint.id === sprintId ? { ...sprint, ...updates } : sprint
            ),
          };
        }
        return project;
      })
    );
  };

  const getSprints = (projectId: string) => {
    const project = projects.find(project => project.id === projectId);
    return project ? project.sprints : [];
  };

  const getCurrentSprint = (projectId: string) => {
    const project = projects.find(project => project.id === projectId);
    if (!project) return undefined;
    return project.sprints.find(sprint => sprint.status === 'active');
  };

  // Epic Management
  const addEpic = (projectId: string, epic: Omit<Epic, 'id' | 'createdAt'>) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            epics: [
              ...project.epics,
              {
                ...epic,
                id: `epic-${Date.now()}`,
                createdAt: new Date().toISOString(),
                // Add name property based on title if not provided
                name: epic.name || epic.title,
                // Add default color if not provided
                color: epic.color || '#3498db',
              },
            ],
          };
        }
        return project;
      })
    );
  };

  const updateEpic = (projectId: string, epicId: string, updates: Partial<Epic>) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            epics: project.epics.map(epic =>
              epic.id === epicId ? { ...epic, ...updates } : epic
            ),
          };
        }
        return project;
      })
    );
  };

  const getEpics = (projectId: string) => {
    const project = projects.find(project => project.id === projectId);
    return project ? project.epics : [];
  };

  // Task and Epic/Sprint relationships
  const assignTaskToEpic = (projectId: string, taskId: string, epicId: string) => {
    updateTask(projectId, taskId, { epicId });
  };

  const removeTaskFromEpic = (projectId: string, taskId: string) => {
    updateTask(projectId, taskId, { epicId: undefined });
  };

  const getTasksByEpic = (projectId: string, epicId: string) => {
    const project = projects.find(project => project.id === projectId);
    if (!project) return [];
    return project.tasks.filter(task => task.epicId === epicId);
  };

  const assignTaskToSprint = (projectId: string, taskId: string, sprintId: string) => {
    updateTask(projectId, taskId, { sprintId });
  };

  const removeTaskFromSprint = (projectId: string, taskId: string) => {
    updateTask(projectId, taskId, { sprintId: undefined });
  };

  const getTasksBySprint = (projectId: string, sprintId: string) => {
    const project = projects.find(project => project.id === projectId);
    if (!project) return [];
    return project.tasks.filter(task => task.sprintId === sprintId);
  };

  // Calculate team workload
  const getTeamWorkload = (projectId: string): Record<string, UserWorkload> => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return {};

    const workload: Record<string, UserWorkload> = {};

    // Initialize workload for all users
    users.forEach(user => {
      workload[user.id] = {
        user,
        assignedTasks: 0,
        totalStoryPoints: 0,
        estimatedHours: 0,
      };
    });

    // Calculate workload from tasks
    project.tasks.forEach(task => {
      if (task.assigneeId && workload[task.assigneeId]) {
        workload[task.assigneeId].assignedTasks += 1;
        workload[task.assigneeId].totalStoryPoints += task.storyPoints || 0;
        
        // Estimate hours based on story points (rough estimate)
        const estimatedTaskHours = (task.storyPoints || 0) * 3;
        workload[task.assigneeId].estimatedHours += estimatedTaskHours;
      }
    });

    return workload;
  };

  // Add missing functions

  // Add a label to a task
  const addLabelToTask = (projectId: string, taskId: string, labelId: string) => {
    const label = availableLabels.find(label => label.id === labelId);
    if (!label) return;

    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task => {
              if (task.id === taskId && !task.labels.some(l => l.id === labelId)) {
                return {
                  ...task,
                  labels: [...task.labels, label],
                };
              }
              return task;
            }),
          };
        }
        return project;
      })
    );
  };

  // Remove a label from a task
  const removeLabelFromTask = (projectId: string, taskId: string, labelId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
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
      })
    );
  };

  // Update task due date
  const updateTaskDueDate = (projectId: string, taskId: string, dueDate?: string) => {
    updateTask(projectId, taskId, { dueDate });
  };

  // Get sprint capacity
  const getSprintCapacity = (projectId: string, sprintId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return { totalStoryPoints: 0, assignedStoryPoints: 0, remainingCapacity: 0 };

    // Calculate total capacity (in a real app, this would be based on team members and sprint duration)
    const totalStoryPoints = 40; // Default capacity for demo purposes

    // Calculate assigned story points
    const sprintTasks = project.tasks.filter(task => task.sprintId === sprintId);
    const assignedStoryPoints = sprintTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);

    // Calculate remaining capacity
    const remainingCapacity = totalStoryPoints - assignedStoryPoints;

    return { totalStoryPoints, assignedStoryPoints, remainingCapacity };
  };

  // Add task to sprint (alias for assignTaskToSprint for API consistency)
  const addTaskToSprint = (projectId: string, taskId: string, sprintId: string) => {
    assignTaskToSprint(projectId, taskId, sprintId);
  };

  // Get workload for a specific user
  const getUserWorkload = (projectId: string, userId: string): UserWorkload | undefined => {
    const user = getUserById(userId);
    if (!user) return undefined;

    const project = projects.find(p => p.id === projectId);
    if (!project) return undefined;

    const assignedTasks = project.tasks.filter(task => task.assigneeId === userId);
    const totalStoryPoints = assignedTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
    const estimatedHours = totalStoryPoints * 3; // Rough estimate: 3 hours per story point

    return {
      user,
      assignedTasks: assignedTasks.length,
      totalStoryPoints,
      estimatedHours,
    };
  };

  // Provider value
  const value: ProjectContextType = {
    projects,
    users,
    availableLabels,
    currentProject,
    tasks,
    setCurrentProject,
    addProject,
    updateProject,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
    getTasksByStatus,
    updateTaskStatus,
    addComment,
    addTimeRecord,
    getUserById,
    filterTasks,
    addSprint,
    updateSprint,
    getSprints,
    getCurrentSprint,
    addEpic,
    updateEpic,
    getEpics,
    assignTaskToEpic,
    removeTaskFromEpic,
    getTasksByEpic,
    assignTaskToSprint,
    removeTaskFromSprint,
    getTasksBySprint,
    getTeamWorkload,
    addLabelToTask,
    removeLabelFromTask,
    updateTaskDueDate,
    getSprintCapacity,
    addTaskToSprint,
    getUserWorkload,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

// Custom hook to use the ProjectContext
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
