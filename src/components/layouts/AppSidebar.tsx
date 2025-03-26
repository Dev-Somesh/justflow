
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  LayoutDashboard, 
  Kanban, 
  Users, 
  Settings,
  ListFilter,
  ChevronDown,
  ChevronUp,
  Target,
  Shield,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProject } from '@/contexts/ProjectContext';
import UserAvatar from '@/components/ui/UserAvatar';
import AdminPanel from '@/components/admin/AdminPanel';
import Logo from '@/components/ui/Logo';

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentProject, users } = useProject();
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  
  // Get first user as current user (in a real app, this would be the logged-in user)
  const currentUser = users[0];
  
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
    return location.pathname === path;
  };
  
  return (
    <div className="w-64 border-r border-gray-200 bg-white h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center mb-2">
          <Logo size="sm" />
          <h1 className="text-lg font-semibold font-mono text-blue-600 ml-2">JustFlow</h1>
        </div>
        {currentProject && (
          <p className="text-sm text-gray-500 mt-1 truncate">{currentProject.name}</p>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          <nav className="space-y-1">
            {mainRoutes.map((route) => (
              <Button
                key={route.path}
                variant={isActive(route.path) ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate(route.path)}
              >
                {route.icon}
                <span className="ml-3">{route.name}</span>
              </Button>
            ))}
          </nav>
          
          <div className="mt-6">
            <div 
              className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 cursor-pointer"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <div className="flex items-center">
                <ListFilter className="h-4 w-4 mr-2" />
                <span>Filters</span>
              </div>
              {isFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            
            {isFilterOpen && (
              <div className="pl-4 pr-2 pb-2 space-y-1">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-sm" 
                  onClick={() => navigate('/board?priority=high')}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                  High Priority
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-sm" 
                  onClick={() => navigate('/board?assignee=user-1')}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  Assigned to me
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-sm" 
                  onClick={() => navigate('/board?status=in-progress')}
                >
                  <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                  In Progress
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-sm" 
                  onClick={() => navigate('/board?due=overdue')}
                >
                  <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                  Overdue
                </Button>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
      
      <div className="border-t border-gray-200 p-4">
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={() => setIsAdminPanelOpen(true)}
        >
          <UserAvatar src={currentUser.avatar} name={currentUser.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{currentUser.name}</p>
            <p className="text-xs text-gray-500 truncate">{currentUser.role}</p>
          </div>
          <Shield className="h-5 w-5 text-blue-600" />
        </div>
      </div>
      
      <AdminPanel 
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
      />
    </div>
  );
};

export default AppSidebar;
