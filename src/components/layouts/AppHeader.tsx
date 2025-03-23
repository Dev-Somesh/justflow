
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  LayoutDashboard, 
  Kanban, 
  Users, 
  Settings,
  AlertTriangle,
  Clock,
  Target,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProject } from '@/contexts/ProjectContext';
import Logo from '@/components/ui/Logo';
import { useToast } from '@/components/ui/use-toast';

const AppHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentProject, tasks } = useProject();
  
  const highPriorityCount = tasks.filter(t => t.priority === 'high').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'done').length;
  const username = sessionStorage.getItem('username') || 'admin';
  
  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem('loginSuccess');
    sessionStorage.removeItem('username');
    
    // Show toast notification
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of JustFlow.",
    });
    
    // Redirect to home page
    navigate('/');
  };
  
  const mainRoutes = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/dashboard',
    },
    {
      name: 'Board',
      icon: <Kanban className="h-5 w-5" />,
      path: '/board',
    },
    {
      name: 'Calendar',
      icon: <Calendar className="h-5 w-5" />,
      path: '/calendar',
    },
    {
      name: 'Team',
      icon: <Users className="h-5 w-5" />,
      path: '/team',
    },
    {
      name: 'Epics',
      icon: <Target className="h-5 w-5" />,
      path: '/epics',
    },
    {
      name: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      path: '/settings',
    },
  ];
  
  const isActive = (path: string) => {
    return window.location.pathname === path;
  };
  
  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between px-4 h-14">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <Logo size="sm" />
          <div className="font-semibold text-xl text-blue-600 font-mono ml-2">JustFlow</div>
        </div>
        {currentProject && (
          <div className="text-sm text-gray-500 hidden md:block">
            / {currentProject.name}
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        <nav className="hidden md:flex items-center gap-1">
          {mainRoutes.map((route) => (
            <Button
              key={route.path}
              variant={isActive(route.path) ? "default" : "ghost"}
              size="sm"
              className="gap-2"
              onClick={() => navigate(route.path)}
            >
              {route.icon}
              <span className="hidden lg:inline">{route.name}</span>
            </Button>
          ))}
        </nav>
        
        <div className="flex items-center ml-4 gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" size="icon" className="relative" onClick={() => navigate('/board?priority=high')}>
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  {highPriorityCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {highPriorityCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>High Priority Tasks</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" size="icon" className="relative" onClick={() => navigate('/board?status=in-progress')}>
                  <Clock className="h-5 w-5 text-blue-500" />
                  {pendingTasksCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {pendingTasksCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pending Tasks</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" size="icon" onClick={() => navigate('/help')}>
                  <HelpCircle className="h-5 w-5 text-gray-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help & Documentation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" size="sm" className="ml-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Logout ({username})</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Log out from JustFlow</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
