import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  HelpCircle,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  Zap,
  Target,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { cn } from '@/lib/utils';

interface EnhancedAppHeaderProps {
  onMenuClick?: () => void;
}

const EnhancedAppHeader: React.FC<EnhancedAppHeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { currentProject } = useProject();
  const { data: apiTasks = [] } = useTasks(currentProject?.id || 'project-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const highPriorityCount = apiTasks.filter(t => t.priority === 'high').length;
  const urgentCount = apiTasks.filter(t => t.priority === 'urgent').length;
  const pendingTasksCount = apiTasks.filter(t => t.status !== 'done').length;
  const username = sessionStorage.getItem('username') || 'admin';
  const userInitials = username.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleLogout = () => {
    sessionStorage.removeItem('loginSuccess');
    sessionStorage.removeItem('username');
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of JustFlow.",
    });
    
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const quickActions = [
    { label: 'New Task', icon: Target, action: () => navigate('/board?action=create') },
    { label: 'New Sprint', icon: Activity, action: () => navigate('/cycles?action=create') },
    { label: 'Analytics', icon: Zap, action: () => navigate('/analytics') },
  ];

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Logo size="sm" />
            <div className="hidden sm:block">
              <div className="font-bold text-xl text-gray-900">JustFlow</div>
              <div className="text-xs text-gray-500 -mt-1">Project Management</div>
            </div>
          </div>

          {/* Project Breadcrumb */}
          {currentProject && (
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span>/</span>
              <span className="font-medium text-gray-900">{currentProject.name}</span>
            </div>
          )}
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks, projects, or people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 transition-all duration-200"
            />
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Quick Actions */}
          <div className="hidden lg:flex items-center space-x-1">
            {quickActions.map((action, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={action.action}
                      className="h-9 px-3"
                    >
                      <action.icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{action.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          {/* Notifications */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-9 w-9">
                  <Bell className="h-4 w-4" />
                  {(urgentCount > 0 || highPriorityCount > 0) && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {urgentCount + highPriorityCount}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Task Counter */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">{pendingTasksCount}</span>
            </div>
            <span className="text-xs text-gray-500">active</span>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`/avatars/${username.toLowerCase().replace(' ', '-')}.jpg`} />
                  <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{username}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentProject?.name || 'No project selected'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/help')}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDarkMode(!isDarkMode)}>
                {isDarkMode ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                <span>{isDarkMode ? 'Light' : 'Dark'} Mode</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 bg-gray-50 border-gray-200"
          />
        </form>
      </div>
    </header>
  );
};

export default EnhancedAppHeader;
