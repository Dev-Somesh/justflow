import React, { useState, useEffect } from 'react';
import EnhancedAppHeader from './EnhancedAppHeader';
import AppSidebar from './AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';

interface EnhancedAppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const EnhancedAppLayout: React.FC<EnhancedAppLayoutProps> = ({ 
  children, 
  className 
}) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Enhanced Header */}
      <header className={cn(
        "sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/50 transition-all duration-200",
        isScrolled && "shadow-sm"
      )}>
        <EnhancedAppHeader onMenuClick={() => setSidebarOpen(true)} />
      </header>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <div className={cn(
          "transition-all duration-300 ease-in-out",
          isMobile ? (
            sidebarOpen 
              ? "fixed inset-0 z-30 bg-black/50" 
              : "hidden"
          ) : "relative"
        )}>
          {isMobile && sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-30"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          <div className={cn(
            "bg-white border-r border-gray-200 h-full transition-transform duration-300 ease-in-out",
            isMobile ? (
              sidebarOpen 
                ? "fixed left-0 top-0 z-50 w-64 h-full transform translate-x-0" 
                : "fixed left-0 top-0 z-50 w-64 h-full transform -translate-x-full"
            ) : "w-64"
          )}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="p-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <AppSidebar />
          </div>
        </div>

        {/* Main Content Area */}
        <main className={cn(
          "flex-1 min-h-screen transition-all duration-300 overflow-x-hidden",
          isMobile ? "w-full" : "ml-0"
        )}>
          <div className="relative w-full">
            {/* Content Container */}
            <div className={cn(
              "min-h-screen w-full",
              className
            )}>
              {children}
            </div>

            {/* Floating Action Button for Mobile */}
            {isMobile && (
              <div className="fixed bottom-6 right-6 z-20">
                <Button
                  size="lg"
                  className="rounded-full shadow-lg h-14 w-14 p-0"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Loading Overlay */}
      <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 hidden" id="loading-overlay">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAppLayout;
