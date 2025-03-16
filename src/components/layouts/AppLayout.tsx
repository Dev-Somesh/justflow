
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Kanban, 
  Calendar, 
  Users, 
  Settings, 
  Menu,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import UserAvatar from '@/components/ui/UserAvatar';
import { useProject } from '@/contexts/ProjectContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { users } = useProject();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/board', label: 'Board', icon: Kanban },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/team', label: 'Team', icon: Users },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-plane-gray-light">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white h-screen flex flex-col border-r border-gray-200 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-plane-purple flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="font-bold text-lg">Plane</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8"
          >
            {sidebarCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      location.pathname === item.path
                        ? "bg-plane-purple-light bg-opacity-10 text-plane-purple"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <item.icon size={18} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <UserAvatar 
              src={users[0].avatar} 
              name={users[0].name} 
              size="sm" 
            />
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <div className="font-medium truncate">{users[0].name}</div>
                <div className="text-xs text-gray-500 truncate">Administrator</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-full p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
