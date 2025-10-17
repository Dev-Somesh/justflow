import React, { useState, useEffect } from 'react';
import EnhancedAppLayout from '@/components/layouts/EnhancedAppLayout';
import KanbanBoard from '@/components/board/KanbanBoard';
import TaskModal from '@/components/modals/TaskModal';
import NewTaskModal from '@/components/modals/NewTaskModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProject, TaskStatus } from '@/contexts/ProjectContext';
import { 
  Plus, 
  Filter, 
  Search, 
  SlidersHorizontal, 
  View,
  Calendar,
  Users,
  Target,
  MoreHorizontal,
  Grid3X3,
  List,
  BarChart3,
  Settings
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import SprintSelector from '@/components/sprint/SprintSelector';
import StoryPointsInfo from '@/components/dashboard/StoryPointsInfo';
import { useToast } from '@/hooks/use-toast';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { PageSkeleton } from '@/components/ui/LoadingSkeletons';

const EnhancedBoard = () => {
  const { toast } = useToast();
  const { currentProject, tasks } = useProject();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('todo');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [activeFilters, setActiveFilters] = useState<{
    priority?: string;
    status?: string;
    assignee?: string;
    taskId?: string;
    sprintId?: string;
  }>({});
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Process URL query parameters for filtering
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const filters: typeof activeFilters = {};
      
      if (params.has('priority')) filters.priority = params.get('priority') || undefined;
      if (params.has('status')) filters.status = params.get('status') || undefined;
      if (params.has('assignee')) filters.assignee = params.get('assignee') || undefined;
      if (params.has('taskId')) filters.taskId = params.get('taskId') || undefined;
      if (params.has('sprintId')) filters.sprintId = params.get('sprintId') || undefined;
      
      setActiveFilters(filters);
      
      // Open task modal if taskId is provided
      if (filters.taskId) {
        setSelectedTaskId(filters.taskId);
        setIsTaskModalOpen(true);
      }
    } catch (error) {
      console.error('Error processing URL parameters:', error);
      setError('Failed to process URL parameters');
    }
  }, [location.search]);

  // Handle task selection
  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskModalOpen(true);
  };

  // Handle new task creation
  const handleNewTask = (status: TaskStatus) => {
    setNewTaskStatus(status);
    setIsNewTaskModalOpen(true);
  };

  // Handle task creation success
  const handleTaskCreated = () => {
    setIsNewTaskModalOpen(false);
    toast({
      title: "Task created",
      description: "Your new task has been successfully created.",
    });
  };

  // Handle task update success
  const handleTaskUpdated = () => {
    setIsTaskModalOpen(false);
    setSelectedTaskId(null);
    toast({
      title: "Task updated",
      description: "Your task has been successfully updated.",
    });
  };

  // Handle task deletion
  const handleTaskDeleted = () => {
    setIsTaskModalOpen(false);
    setSelectedTaskId(null);
    toast({
      title: "Task deleted",
      description: "Your task has been successfully deleted.",
    });
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = !activeFilters.priority || task.priority === activeFilters.priority;
    const matchesStatus = !activeFilters.status || task.status === activeFilters.status;
    const matchesAssignee = !activeFilters.assignee || task.assignee === activeFilters.assignee;
    
    return matchesSearch && matchesPriority && matchesStatus && matchesAssignee;
  });

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    highPriority: tasks.filter(t => t.priority === 'high').length,
    overdue: tasks.filter(t => {
      if (!t.dueDate) return false;
      return new Date(t.dueDate) < new Date() && t.status !== 'done';
    }).length,
  };

  if (error) {
    return (
      <EnhancedAppLayout>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </EnhancedAppLayout>
    );
  }

  return (
    <EnhancedAppLayout>
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Board</h1>
            <p className="text-gray-600 mt-1">
              {currentProject?.name || 'No project selected'} • {taskStats.total} tasks
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{taskStats.total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{taskStats.todo}</div>
              <div className="text-sm text-gray-500">To Do</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{taskStats.inProgress}</div>
              <div className="text-sm text-gray-500">In Progress</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{taskStats.done}</div>
              <div className="text-sm text-gray-500">Done</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{taskStats.highPriority}</div>
              <div className="text-sm text-gray-500">High Priority</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{taskStats.overdue}</div>
              <div className="text-sm text-gray-500">Overdue</div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={activeFilters.priority || ''} onValueChange={(value) => 
                  setActiveFilters(prev => ({ ...prev, priority: value || undefined }))
                }>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={activeFilters.status || ''} onValueChange={(value) => 
                  setActiveFilters(prev => ({ ...prev, status: value || undefined }))
                }>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      More Filters
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Additional Filters</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Assignee</DropdownMenuItem>
                    <DropdownMenuItem>Due Date</DropdownMenuItem>
                    <DropdownMenuItem>Labels</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="kanban" className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                Kanban
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <SprintSelector />
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="kanban" className="space-y-4">
            <ErrorBoundary>
              <KanbanBoard 
                tasks={filteredTasks}
                onTaskClick={handleTaskClick}
                onNewTask={handleNewTask}
              />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Task List View</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          task.priority === 'urgent' ? 'bg-red-500' :
                          task.priority === 'high' ? 'bg-orange-500' :
                          task.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`} />
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-gray-500">{task.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{task.status}</Badge>
                        <Button variant="ghost" size="sm" onClick={() => handleTaskClick(task.id)}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
                  <p className="text-gray-500">Calendar view coming soon!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        {isTaskModalOpen && selectedTaskId && (
          <ErrorBoundary>
            <TaskModal
              taskId={selectedTaskId}
              isOpen={isTaskModalOpen}
              onClose={() => {
                setIsTaskModalOpen(false);
                setSelectedTaskId(null);
              }}
              onUpdate={handleTaskUpdated}
              onDelete={handleTaskDeleted}
            />
          </ErrorBoundary>
        )}

        {isNewTaskModalOpen && (
          <ErrorBoundary>
            <NewTaskModal
              projectId={currentProject?.id || 'project-1'}
              initialStatus={newTaskStatus}
              isOpen={isNewTaskModalOpen}
              onClose={() => setIsNewTaskModalOpen(false)}
              onSuccess={handleTaskCreated}
            />
          </ErrorBoundary>
        )}
      </div>
    </EnhancedAppLayout>
  );
};

export default EnhancedBoard;
