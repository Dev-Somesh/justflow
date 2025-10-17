import { http, HttpResponse } from 'msw';

const STORAGE_KEY = 'justflow.workflows';

const load = () => {
  const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

const save = (list: any[]) => {
  globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(list));
};

export const handlers = [
  http.get('/api/workflows', async () => {
    return HttpResponse.json(load());
  }),
  http.post('/api/workflows', async ({ request }) => {
    const body = await request.json();
    const list = load();
    list.push(body);
    save(list);
    return HttpResponse.json(body, { status: 201 });
  }),
  // Projects
  http.get('/api/projects', async () => {
    const raw = localStorage.getItem('justflow.projects');
    const data = raw ? JSON.parse(raw) : [];
    return HttpResponse.json(data);
  }),
  http.post('/api/projects', async ({ request }) => {
    const body = await request.json();
    const raw = localStorage.getItem('justflow.projects');
    const list = raw ? JSON.parse(raw) : [];
    list.push(body);
    localStorage.setItem('justflow.projects', JSON.stringify(list));
    return HttpResponse.json(body, { status: 201 });
  }),
  // Tasks (scoped by projectId query param for simplicity)
  http.get('/api/tasks', async ({ request }) => {
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');
    const raw = localStorage.getItem('justflow.tasks');
    const list = raw ? JSON.parse(raw) : [];
    const result = projectId ? list.filter((t: any) => t.projectId === projectId) : list;
    return HttpResponse.json(result);
  }),
  http.post('/api/tasks', async ({ request }) => {
    const body = await request.json();
    const raw = localStorage.getItem('justflow.tasks');
    const list = raw ? JSON.parse(raw) : [];
    list.push(body);
    localStorage.setItem('justflow.tasks', JSON.stringify(list));
    return HttpResponse.json(body, { status: 201 });
  }),
  http.put('/api/tasks/:id', async ({ params, request }) => {
    const body = await request.json();
    const raw = localStorage.getItem('justflow.tasks');
    const list = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex((t: any) => t.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    list[idx] = { ...list[idx], ...body };
    localStorage.setItem('justflow.tasks', JSON.stringify(list));
    return HttpResponse.json(list[idx]);
  }),
];


