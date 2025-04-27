import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Type definitions
export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  sprints: Sprint[];
  createdAt: string;
  lastUpdated: string;
}

export interface Sprint {
  id: string;
  name: string;
  projectId: string;
  status: 'planning' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  tasks?: string[]; // Task IDs
  storyPoints?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  phone?: string;
  department?: string;
  bio?: string;
  active?: boolean;
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  sprintId?: string;
  storyPoints: number;
  createdAt: string;
  dueDate?: string;
  labels: Label[];
  comments: Comment[];
  timeRecords: TimeRecord[];
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
  duration: number; // minutes
  note?: string;
  createdAt: string;
}

export interface UserWorkload {
  user: User;
  assignedTasks: number;
  totalStoryPoints: number;
  estimatedHours: number;
  tasks: Task[];
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assigneeId?: string[];
  labelIds?: string[];
  dueDateFrom?: string;
  dueDateTo?: string;
  sprintId?: string[];
}

// Context type
export interface ProjectContextType {
  users: User[];
  projects: Project[];
  tasks: Task[];
  currentProject: Project | null;
  availableLabels: Label[];
  selectedUser: string | null;
  setSelectedUser: (userId: string | null) => void;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'lastUpdated' | 'tasks' | 'sprints'>) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  setCurrentProject: (projectId: string) => void;
  createTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'comments' | 'timeRecords' | 'labels'> & { labelIds?: string[] }) => void;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
  getTasksByStatus: (projectId: string, status: TaskStatus) => Task[];
  updateTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => void;
  updateTaskAssignee: (projectId: string, taskId: string, assigneeId?: string) => void;
  updateTaskSprint: (projectId: string, taskId: string, sprintId?: string) => void;
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  addComment: (projectId: string, taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  addTimeRecord: (projectId: string, taskId: string, record: Omit<TimeRecord, 'id'>) => void;
  getUserById: (userId: string) => User | undefined;
  getUserWorkload: (projectId: string, userId: string) => UserWorkload;
  getTeamWorkload: (projectId: string) => Record<string, UserWorkload>;
  filterTasks: (projectId: string, search: string, filters: TaskFilters) => Task[];
  createLabel: (label: Omit<Label, 'id'>) => void;
  addLabelToTask: (projectId: string, taskId: string, labelId: string) => void;
  removeLabelFromTask: (projectId: string, taskId: string, labelId: string) => void;
  updateTaskDueDate: (projectId: string, taskId: string, dueDate?: string) => void;
  createSprint: (projectId: string, sprint: Omit<Sprint, 'id'>) => void;
  updateSprint: (projectId: string, sprintId: string, updates: Partial<Sprint>) => void;
  deleteSprint: (projectId: string, sprintId: string) => void;
  getSprints: (projectId: string) => Sprint[];
  assignTaskToSprint: (projectId: string, taskId: string, sprintId: string) => void;
  removeTaskFromSprint: (projectId: string, taskId: string) => void;
}

// Initial mock data
const initialUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://api.dicebear.com/7.x/ лица/svg?seed=John',
    role: 'Product Manager',
    phone: '+1 (555) 123-4567',
    department: 'Product',
    bio: 'Experienced product manager with a passion for innovation.',
    active: true,
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://api.dicebear.com/7.x/ лица/svg?seed=Jane',
    role: 'Developer',
    phone: '+1 (555) 987-6543',
    department: 'Engineering',
    bio: 'Full-stack developer with a focus on scalable solutions.',
    active: true,
  },
  {
    id: 'user-3',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    avatar: 'https://api.dicebear.com/7.x/ лица/svg?seed=Alice',
    role: 'UI Designer',
    phone: '+1 (555) 456-7890',
    department: 'Design',
    bio: 'Creative UI designer dedicated to user-centered design.',
    active: true,
  },
];

const initialLabels: Label[] = [
  { id: 'label-1', name: 'Bug', color: '#F44336' },
  { id: 'label-2', name: 'Feature', color: '#4CAF50' },
  { id: 'label-3', name: 'Enhancement', color: '#FF9800' },
  { id: 'label-4', name: 'Documentation', color: '#2196F3' },
];

const initialProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Awesome Project',
    description: 'A project to build an awesome application',
    tasks: [
      {
        id: 'task-1',
        title: 'Design login page',
        description: 'Create a visually appealing login page',
        status: 'todo',
        priority: 'high',
        assigneeId: 'user-3',
        sprintId: 'sprint-1',
        storyPoints: 3,
        createdAt: new Date().toISOString(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
        labels: [initialLabels[0]],
        comments: [],
        timeRecords: [],
      },
      {
        id: 'task-2',
        title: 'Implement user authentication',
        description: 'Implement secure user authentication using JWT',
        status: 'in-progress',
        priority: 'medium',
        assigneeId: 'user-2',
        sprintId: 'sprint-1',
        storyPoints: 5,
        createdAt: new Date().toISOString(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
        labels: [initialLabels[1]],
        comments: [],
        timeRecords: [],
      },
      {
        id: 'task-3',
        title: 'Set up database',
        description: 'Configure and set up the project database',
        status: 'done',
        priority: 'low',
        assigneeId: 'user-2',
        sprintId: 'sprint-1',
        storyPoints: 2,
        createdAt: new Date().toISOString(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 21)).toISOString(),
        labels: [initialLabels[2]],
        comments: [],
        timeRecords: [],
      },
    ],
    sprints: [
      {
        id: 'sprint-1',
        projectId: 'project-1',
        name: 'Sprint 1',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        tasks: ['task-1', 'task-2', 'task-3'],
        storyPoints: 10,
      },
    ],
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'project-2',
    name: 'Another Great Project',
    description: 'Another project to showcase our skills',
    tasks: [],
    sprints: [],
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
];

// Create context
const ProjectContext = createContext<ProjectContextType | null>(null);

// Provider component
export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [availableLabels, setAvailableLabels] = useState<Label[]>(initialLabels);
  const [currentProject, setCurrentProject] = useState<Project | null>(initialProjects[0] || null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Generate unique ID
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  // Create a new project
  const createProject = (project: Omit<Project, 'id' | 'createdAt' | 'lastUpdated' | 'tasks' | 'sprints'>) => {
    const newProject: Project = {
      id: generateId(),
      name: project.name,
      description: project.description,
      tasks: [],
      sprints: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    setProjects([...projects, newProject]);
  };

  // Update project details
  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(projects.map(project =>
      project.id === projectId ? { ...project, ...updates, lastUpdated: new Date().toISOString() } : project
    ));
  };

  // Delete a project
  const deleteProject = (projectId: string) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  // Set current project
  const handleSetCurrentProject = (projectId: string) => {
    const project = projects.find(project => project.id === projectId);
    setCurrentProject(project || null);
  };

  // Create a new task
  const createTask = (
    projectId: string, 
    task: Omit<Task, 'id' | 'createdAt' | 'comments' | 'timeRecords' | 'labels'> & { labelIds?: string[] }
  ) => {
    const { labelIds, ...taskData } = task;
    
    // Generate new task
    const newTask: Task = {
      id: generateId(),
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status,
      priority: taskData.priority,
      assigneeId: taskData.assigneeId,
      sprintId: taskData.sprintId,
      storyPoints: taskData.storyPoints || 0,
      createdAt: new Date().toISOString(),
      dueDate: taskData.dueDate ? taskData.dueDate.toISOString() : undefined,
      comments: [],
      timeRecords: [],
      labels: [],
    };

    // Add task to project
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id !== projectId) return project;
        
        // Add task to project
        return {
          ...project,
          tasks: [...project.tasks, newTask]
        };
      })
    );
    
    // Add labels if provided
    if (labelIds && labelIds.length > 0) {
      labelIds.forEach(labelId => {
        addLabelToTask(projectId, newTask.id, labelId);
      });
    }
    
    // If the task has a sprintId, update sprint tasks
    if (task.sprintId) {
      assignTaskToSprint(projectId, newTask.id, task.sprintId);
    }
  };

  // Update an existing task
  const updateTask = (projectId: string, taskId: string, updates: Partial<Task>) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id !== projectId) return project;

        return {
          ...project,
          tasks: project.tasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        };
      })
    );
  };

  // Delete a task
  const deleteTask = (projectId: string, taskId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id !== projectId) return project;

        return {
          ...project,
          tasks: project.tasks.filter(task => task.id !== taskId)
        };
      })
    );
  };

  // Get task by ID
  const getTaskById = (taskId: string) => {
    let foundTask: Task | undefined;
    projects.forEach(project => {
      const task = project.tasks.find(task => task.id === taskId);
      if (task) {
        foundTask = task;
      }
    });
    return foundTask;
  };

  // Get tasks by status
  const getTasksByStatus = (projectId: string, status: TaskStatus) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.tasks.filter(task => task.status === status) : [];
  };
  
  // Update user profile
  const updateUserProfile = (userId: string, updates: Partial<User>) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, ...updates }
          : user
      )
    );
  };
  
  // Update task status
  const updateTaskStatus = (projectId: string, taskId: string, status: TaskStatus) => {
    updateTask(projectId, taskId, { status });
  };

  const updateTaskAssignee = (projectId: string, taskId: string, assigneeId?: string) => {
    updateTask(projectId, taskId, { assigneeId });
  };

  const updateTaskSprint = (projectId: string, taskId: string, sprintId?: string) => {
    updateTask(projectId, taskId, { sprintId });
  };

  // Add a comment to a task
  const addComment = (projectId: string, taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      id: generateId(),
      userId: comment.userId,
      content: comment.content,
      createdAt: new Date().toISOString(),
    };

    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id !== projectId) return project;

        return {
          ...project,
          tasks: project.tasks.map(task =>
            task.id === taskId ? { ...task, comments: [...task.comments, newComment] } : task
          )
        };
      })
    );
  };

  // Add a time record to a task
  const addTimeRecord = (projectId: string, taskId: string, record: Omit<TimeRecord, 'id'>) => {
    const newTimeRecord: TimeRecord = {
      id: generateId(),
      userId: record.userId,
      duration: record.duration,
      note: record.note,
      createdAt: new Date().toISOString(),
    };

    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id !== projectId) return project;

        return {
          ...project,
          tasks: project.tasks.map(task =>
            task.id === taskId ? { ...task, timeRecords: [...task.timeRecords, newTimeRecord] } : task
          )
        };
      })
    );
  };

  // Get user by ID
  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  // Get user workload
  const getUserWorkload = (projectId: string, userId: string) => {
    const project = projects.find(p => p.id === projectId);
    const user = users.find(u => u.id === userId);
    if (!project || !user) {
      return {
        user: {} as User,
        assignedTasks: 0,
        totalStoryPoints: 0,
        estimatedHours: 0,
        tasks: [],
      };
    }

    const assignedTasks = project.tasks.filter(task => task.assigneeId === userId);
    const totalStoryPoints = assignedTasks.reduce((sum, task) => sum + task.storyPoints, 0);
    const estimatedHours = totalStoryPoints * 8; // Assuming 1 story point = 8 hours

    return {
      user,
      assignedTasks: assignedTasks.length,
      totalStoryPoints,
      estimatedHours,
      tasks: assignedTasks,
    };
  };

  // Get team workload
  const getTeamWorkload = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return {};

    const teamWorkload: Record<string, UserWorkload> = {};
    users.forEach(user => {
      teamWorkload[user.id] = getUserWorkload(projectId, user.id);
    });

    return teamWorkload;
  };

  // Filter tasks
  const filterTasks = (projectId: string, search: string, filters: TaskFilters) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return [];

    return project.tasks.filter(task => {
      // Search filter
      if (search && !task.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(task.status)) {
          return false;
        }
      }

      // Priority filter
      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(task.priority)) {
          return false;
        }
      }

      // Assignee filter
      if (filters.assigneeId && filters.assigneeId.length > 0) {
        if (filters.assigneeId.includes('unassigned')) {
          if (task.assigneeId) return false;
        } else if (!task.assigneeId || !filters.assigneeId.includes(task.assigneeId)) {
          return false;
        }
      }

      // Sprint filter
      if (filters.sprintId && filters.sprintId.length > 0) {
        if (filters.sprintId.includes('none')) {
          if (task.sprintId) return false;
        } else if (!task.sprintId || !filters.sprintId.includes(task.sprintId)) {
          return false;
        }
      }

      // Filter by labels
      if (filters.labelIds && filters.labelIds.length > 0) {
        const taskLabelIds = task.labels.map(label => label.id);
        if (!filters.labelIds.some(id => taskLabelIds.includes(id))) {
          return false;
        }
      }

      // Date range filter
      if (filters.dueDateFrom || filters.dueDateTo) {
        if (!task.dueDate) return false;

        const dueDate = new Date(task.dueDate);
        
        if (filters.dueDateFrom) {
          const fromDate = new Date(filters.dueDateFrom);
          if (dueDate < fromDate) return false;
        }
        
        if (filters.dueDateTo) {
          const toDate = new Date(filters.dueDateTo);
          if (dueDate > toDate) return false;
        }
      }

      return true;
    });
  };

  // Create a new label
  const createLabel = (label: Omit<Label, 'id'>) => {
    const newLabel: Label = {
      id: generateId(),
      name: label.name,
      color: label.color,
    };
    setAvailableLabels([...availableLabels, newLabel]);
  };

  // Add a label to a task
  const addLabelToTask = (projectId: string, taskId: string, labelId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id !== projectId) return project;

        return {
          ...project,
          tasks: project.tasks.map(task => {
            if (task.id !== taskId) return task;

            const label = availableLabels.find(label => label.id === labelId);
            if (!label) return task;

            return {
              ...task,
              labels: [...task.labels, label]
            };
          })
        };
      })
    );
  };

  // Remove a label from a task
  const removeLabelFromTask = (projectId: string, taskId: string, labelId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id !== projectId) return project;

        return {
          ...project,
          tasks: project.tasks.map(task =>
            task.id === taskId ? { ...task, labels: task.labels.filter(label => label.id !== labelId) } : task
          )
        };
      })
    );
  };

  // Update task due date
  const updateTaskDueDate = (projectId: string, taskId: string, dueDate?: string) => {
    updateTask(projectId, taskId, { dueDate });
  };

  // Create a new sprint
  const createSprint = (projectId: string, sprint: Omit<Sprint, 'id'>) => {
    const newSprint: Sprint = {
      id: generateId(),
      projectId: projectId,
      name: sprint.name,
      status: sprint.status,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      tasks: [],
      storyPoints: 0,
    };

    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id !== projectId) return project;

        return {
          ...project,
          sprints: [...project.sprints, newSprint]
        };
      })
    );
  };

  // Update sprint details
  const updateSprint = (projectId: string, sprintId: string, updates: Partial<Sprint>) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id !== projectId) return project;

        return {
          ...project,
          sprints: project.sprints.map(sprint =>
            sprint.id === sprintId ? { ...sprint, ...updates } : sprint
          )
        };
      })
    );
  };

  // Delete a sprint
  const deleteSprint = (projectId: string, sprintId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id !== projectId) return project;

        return {
          ...project,
          sprints: project.sprints.filter(sprint => sprint.id !== sprintId)
        };
      })
    );
  };

  // Get sprints by project ID
  const getSprints = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.sprints : [];
  };

  // Assign a task to a sprint
  const assignTaskToSprint = (projectId: string, taskId: string, sprintId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id !== projectId) return project;

        return {
          ...project,
          tasks: project.tasks.map(task =>
            task.id === taskId ? { ...task, sprintId: sprintId } : task
          ),
          sprints: project.sprints.map(sprint =>
            sprint.id === sprintId ? { ...sprint, tasks: [...sprint.tasks || [], taskId] } : sprint
          )
        };
      })
    );
  };

  // Remove a task from a sprint
  const removeTaskFromSprint = (projectId: string, taskId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id !== projectId) return project;

        return {
          ...project,
          tasks: project.tasks.map(task =>
            task.id === taskId ? { ...task, sprintId: undefined } : task
          ),
          sprints: project.sprints.map(sprint => ({
            ...sprint,
            tasks: sprint.tasks ? sprint.tasks.filter(id => id !== taskId) : []
          }))
        };
      })
    );
  };

  // Export context values
  return (
    <ProjectContext.Provider value={{
      users,
      projects,
      tasks: currentProject ? currentProject.tasks : [],
      currentProject,
      availableLabels,
      selectedUser,
      setSelectedUser,
      createProject,
      updateProject,
      deleteProject,
      setCurrentProject,
      createTask,
      updateTask,
      deleteTask,
      getTaskById,
      getTasksByStatus,
      updateTaskStatus,
      updateTaskAssignee,
      updateTaskSprint,
      updateUserProfile,
      addComment,
      addTimeRecord,
      getUserById,
      getUserWorkload,
      getTeamWorkload,
      filterTasks,
      createLabel,
      addLabelToTask,
      removeLabelFromTask,
      updateTaskDueDate,
      createSprint,
      updateSprint,
      deleteSprint,
      getSprints,
      assignTaskToSprint,
      removeTaskFromSprint,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
