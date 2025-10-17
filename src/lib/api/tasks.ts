import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type ApiTask = {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  assigneeId?: string;
  sprintId?: string;
  storyPoints?: number;
  labels?: { id: string; name: string; color: string }[];
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

const list = async (projectId: string): Promise<ApiTask[]> => {
  const res = await fetch(`/api/tasks?projectId=${encodeURIComponent(projectId)}`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  const data = await res.json();
  return data;
};

const create = async (task: ApiTask): Promise<ApiTask> => {
  const res = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(task) });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
};

const update = async (id: string, updates: Partial<ApiTask>): Promise<ApiTask> => {
  const res = await fetch(`/api/tasks/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
};

export const useTasks = (projectId: string) => {
  return useQuery({ queryKey: ['tasks', projectId], queryFn: () => list(projectId), enabled: !!projectId });
};

export const useCreateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: (task) => {
      qc.invalidateQueries({ queryKey: ['tasks', task.projectId] });
    }
  });
};

export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ApiTask> }) => update(id, updates),
    onSuccess: (_task, variables) => {
      // Best-effort invalidate all tasks; if projectId known, caller can also invalidate specific key
      qc.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
};


