// Unified API layer that combines TanStack Query with Context API
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProject } from "@/contexts/ProjectContext";
import { ApiProject, ApiTask } from "./types";

// Unified project types that match both API and Context
export interface UnifiedProject extends ApiProject {
  tasks: ApiTask[];
  sprints: any[];
  team: { id: string; name: string; role?: string }[];
  createdAt: string;
  lastUpdated: string;
}

export interface UnifiedTask extends ApiTask {
  comments: any[];
  timeRecords: any[];
  labels: { id: string; name: string; color: string }[];
}

// Unified API functions
const fetchProjects = async (): Promise<UnifiedProject[]> => {
  const res = await fetch('/api/projects');
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
};

const fetchTasks = async (projectId: string): Promise<UnifiedTask[]> => {
  const res = await fetch(`/api/tasks?projectId=${encodeURIComponent(projectId)}`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
};

const createTask = async (task: Omit<UnifiedTask, 'id' | 'createdAt' | 'comments' | 'timeRecords' | 'labels'>): Promise<UnifiedTask> => {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
};

const updateTask = async (id: string, updates: Partial<UnifiedTask>): Promise<UnifiedTask> => {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
};

// Unified hooks that work with both API and Context
export const useUnifiedProjects = () => {
  const { projects: contextProjects } = useProject();
  
  return useQuery({
    queryKey: ['unified-projects'],
    queryFn: fetchProjects,
    initialData: contextProjects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      dueDate: project.lastUpdated,
      team: project.team,
      tasks: project.tasks.map(task => ({
        id: task.id,
        projectId: project.id,
        title: task.title,
        description: task.description,
        status: task.status as 'todo' | 'in-progress' | 'done',
        priority: task.priority as 'low' | 'medium' | 'high',
        assigneeId: task.assigneeId,
        sprintId: task.sprintId,
        storyPoints: task.storyPoints,
        labels: task.labels,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt || task.createdAt,
        comments: task.comments || [],
        timeRecords: task.timeRecords || []
      })),
      sprints: project.sprints || [],
      createdAt: project.createdAt,
      lastUpdated: project.lastUpdated
    })),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUnifiedTasks = (projectId: string) => {
  const { currentProject } = useProject();
  const contextTasks = currentProject?.tasks || [];
  
  return useQuery({
    queryKey: ['unified-tasks', projectId],
    queryFn: () => fetchTasks(projectId),
    enabled: !!projectId,
    initialData: contextTasks.map(task => ({
      id: task.id,
      projectId: projectId,
      title: task.title,
      description: task.description,
      status: task.status as 'todo' | 'in-progress' | 'done',
      priority: task.priority as 'low' | 'medium' | 'high',
      assigneeId: task.assigneeId,
      sprintId: task.sprintId,
      storyPoints: task.storyPoints,
      labels: task.labels,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt || task.createdAt,
      comments: task.comments || [],
      timeRecords: task.timeRecords || []
    })),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateUnifiedTask = () => {
  const queryClient = useQueryClient();
  const { createTask: contextCreateTask, currentProject } = useProject();
  
  return useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      // Update TanStack Query cache
      queryClient.invalidateQueries({ queryKey: ['unified-tasks', newTask.projectId] });
      queryClient.invalidateQueries({ queryKey: ['unified-projects'] });
      
      // Update Context API
      if (currentProject) {
        contextCreateTask(currentProject.id, {
          title: newTask.title,
          description: newTask.description,
          status: newTask.status,
          priority: newTask.priority,
          assigneeId: newTask.assigneeId,
          sprintId: newTask.sprintId,
          storyPoints: newTask.storyPoints,
          dueDate: newTask.dueDate,
          labelIds: newTask.labels?.map(label => label.id)
        });
      }
    },
  });
};

export const useUpdateUnifiedTask = () => {
  const queryClient = useQueryClient();
  const { updateTask: contextUpdateTask, currentProject } = useProject();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<UnifiedTask> }) => 
      updateTask(id, updates),
    onSuccess: (updatedTask) => {
      // Update TanStack Query cache
      queryClient.invalidateQueries({ queryKey: ['unified-tasks', updatedTask.projectId] });
      queryClient.invalidateQueries({ queryKey: ['unified-projects'] });
      
      // Update Context API
      if (currentProject) {
        contextUpdateTask(currentProject.id, updatedTask.id, {
          title: updatedTask.title,
          description: updatedTask.description,
          status: updatedTask.status,
          priority: updatedTask.priority,
          assigneeId: updatedTask.assigneeId,
          sprintId: updatedTask.sprintId,
          storyPoints: updatedTask.storyPoints,
          dueDate: updatedTask.dueDate
        });
      }
    },
  });
};
