
  // Update the addTask function to include projectId
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
                projectId: projectId, // Explicitly set projectId to match the project
              },
            ],
          };
        }
        return project;
      });
    });
  };
