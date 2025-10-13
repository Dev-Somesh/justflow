
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  LayoutDashboard, 
  Kanban, 
  Users, 
  Settings,
  Target,
  HelpCircle,
  LogOut,
  Menu,
} from 'lucide-react';
import { cn, responsive } from '@/utils/theme';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProject } from '@/contexts/ProjectContext';
import { useTasks } from '@/lib/api/tasks';
import Logo from '@/components/ui/Logo';
import { useToast } from '@/components/ui/use-toast';

const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Added useLocation to properly detect current path
  const { toast } = useToast();
  const { currentProject } = useProject();
  const { data: apiTasks = [] } = useTasks(currentProject?.id || 'project-1');
  
  const highPriorityCount = apiTasks.filter(t => t.priority === 'high').length;
  const pendingTasksCount = apiTasks.filter(t => t.status !== 'done').length;
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
    return location.pathname === path; // Use location.pathname for accurate route matching
  };
  
  const handleNavigation = (path: string, event: React.MouseEvent) => {
    event.preventDefault();
    navigate(path);
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
        {/* Top nav removed to avoid duplication with sidebar */}
        <div className="flex items-center ml-4 gap-2">
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={(e) => handleNavigation('/help', e)}
                  aria-label="Open help and documentation"
                >
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
                <Button variant="outline" size="sm" className="ml-2" onClick={handleLogout}
                  aria-label="Log out"
                >
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
