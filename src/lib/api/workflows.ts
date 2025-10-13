import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Workflow } from "@/lib/types/workflow";

const STORAGE_KEY = "justflow.workflows";

const load = (): Workflow[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  try {
    return raw ? (JSON.parse(raw) as Workflow[]) : [];
  } catch {
    return [];
  }
};

const save = (workflows: Workflow[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
};

export const workflowsApi = {
  list: async (): Promise<Workflow[]> => {
    return load();
  },
  get: async (id: string): Promise<Workflow | undefined> => {
    return load().find((w) => w.id === id);
  },
  create: async (wf: Workflow): Promise<Workflow> => {
    const list = load();
    list.push(wf);
    save(list);
    return wf;
  },
  update: async (id: string, updates: Partial<Workflow>): Promise<Workflow | undefined> => {
    const list = load();
    const idx = list.findIndex((w) => w.id === id);
    if (idx === -1) return undefined;
    const updated = { ...list[idx], ...updates, updatedAt: new Date().toISOString() } as Workflow;
    list[idx] = updated;
    save(list);
    return updated;
  },
  delete: async (id: string): Promise<void> => {
    const list = load().filter((w) => w.id !== id);
    save(list);
  },
};

// React Query hooks
export const useWorkflows = () => {
  return useQuery({ queryKey: ["workflows"], queryFn: workflowsApi.list });
};

export const useWorkflow = (id: string | undefined) => {
  return useQuery({ queryKey: ["workflows", id], queryFn: () => (id ? workflowsApi.get(id) : Promise.resolve(undefined)), enabled: !!id });
};

export const useCreateWorkflow = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: workflowsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workflows"] }),
  });
};

export const useUpdateWorkflow = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Workflow> }) => workflowsApi.update(id, updates),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["workflows"] });
      qc.invalidateQueries({ queryKey: ["workflows", id] });
    },
  });
};

export const useDeleteWorkflow = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: workflowsApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workflows"] }),
  });
};


