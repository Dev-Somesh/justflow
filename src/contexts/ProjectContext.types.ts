export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  sprints: Sprint[];
  createdAt: string;
  lastUpdated: string;
  dueDate?: string;
  team?: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export interface Sprint {
  id: string;
  name: string;
  projectId: string;
  status: 'planning' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  tasks?: string[];
  storyPoints?: number;
  goal?: string;
}

export interface Epic {
  id: string;
  name: string;
  description: string;
  projectId: string;
  status: 'planning' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  taskIds: string[];
  color: string;
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
  epicId?: string;
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
  duration: number;
  note?: string;
  createdAt: string;
  startTime?: string;
  endTime?: string;
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

export interface SprintCapacity {
  totalStoryPoints: number;
  assignedStoryPoints: number;
  remainingCapacity: number;
}

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
  addEpic: (projectId: string, epic: Omit<Epic, 'id'>) => void;
  getEpics: (projectId: string) => Epic[];
  getTasksByEpic: (epicId: string) => Task[];
  updateEpic: (projectId: string, epicId: string, updates: Partial<Epic>) => void;
  assignTaskToEpic: (projectId: string, taskId: string, epicId: string) => void;
  getTasksBySprint: (sprintId: string) => Task[];
  getSprintCapacity: (sprintId: string) => SprintCapacity;
  addTask: (projectId: string, task: Omit<Task, 'id'>) => void;
  addTaskToSprint: (taskId: string, sprintId: string) => void;
}
