export function seedDemoData() {
  if (!localStorage.getItem('justflow.projects')) {
    const projects = [
      { id: 'project-1', name: 'Demo Project', description: 'Sample project for JustFlow' },
    ];
    localStorage.setItem('justflow.projects', JSON.stringify(projects));
  }
  if (!localStorage.getItem('justflow.tasks')) {
    const now = new Date().toISOString();
    const tasks = [
      { id: 't1', projectId: 'project-1', title: 'Setup repository', status: 'todo', priority: 'medium', createdAt: now },
      { id: 't2', projectId: 'project-1', title: 'Design board layout', status: 'in-progress', priority: 'high', createdAt: now },
      { id: 't3', projectId: 'project-1', title: 'Implement drag and drop', status: 'done', priority: 'medium', createdAt: now },
    ];
    localStorage.setItem('justflow.tasks', JSON.stringify(tasks));
  }
}



