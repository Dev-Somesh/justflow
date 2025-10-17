import { useQuery } from "@tanstack/react-query";

export type ApiProject = {
  id: string;
  name: string;
  description?: string;
  dueDate?: string;
  team?: { id: string; name: string; role?: string }[];
};

const list = async (): Promise<ApiProject[]> => {
  const res = await fetch('/api/projects');
  if (!res.ok) throw new Error('Failed to fetch projects');
  const data = await res.json();
  return data;
};

export const useProjects = () => {
  return useQuery({ queryKey: ['projects'], queryFn: list });
};



