import React, { useState } from 'react';
import { Module, ModuleStats } from '@/types/module';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Calendar, Users, Target, TrendingUp, Archive, Star } from 'lucide-react';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';

interface ModulesListProps {
  modules: Module[];
  onModuleSelect: (module: Module) => void;
  onCreateModule: () => void;
  onUpdateModule: (module: Module) => void;
  onDeleteModule: (moduleId: string) => void;
  onArchiveModule: (moduleId: string) => void;
  onToggleFavorite: (moduleId: string) => void;
}

export const ModulesList: React.FC<ModulesListProps> = ({
  modules,
  onModuleSelect,
  onCreateModule,
  onUpdateModule,
  onDeleteModule,
  onArchiveModule,
  onToggleFavorite,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'archived' | 'favorites'>('all');

  const filteredModules = modules.filter(module => {
    switch (filter) {
      case 'active':
        return !module.is_archived;
      case 'archived':
        return module.is_archived;
      case 'favorites':
        return module.is_favorite;
      default:
        return true;
    }
  });

  const getModuleStatus = (module: Module) => {
    if (module.is_archived) return { label: 'Archived', color: 'bg-gray-500' };
    if (module.completed_at) return { label: 'Completed', color: 'bg-green-500' };
    if (module.target_date && isAfter(new Date(), new Date(module.target_date))) {
      return { label: 'Overdue', color: 'bg-red-500' };
    }
    return { label: 'Active', color: 'bg-blue-500' };
  };

  const getDaysRemaining = (module: Module) => {
    if (!module.target_date) return null;
    const now = new Date();
    const targetDate = new Date(module.target_date);
    return differenceInDays(targetDate, now);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Modules</h2>
          <Badge variant="secondary">{modules.length} modules</Badge>
        </div>
        <Button onClick={onCreateModule} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Module</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'all', label: 'All' },
          { key: 'active', label: 'Active' },
          { key: 'favorites', label: 'Favorites' },
          { key: 'archived', label: 'Archived' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredModules.map((module) => {
          const status = getModuleStatus(module);
          const daysRemaining = getDaysRemaining(module);
          
          return (
            <Card 
              key={module.id} 
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                module.is_archived ? 'opacity-60' : ''
              }`}
              onClick={() => onModuleSelect(module)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg font-semibold line-clamp-2">
                        {module.name}
                      </CardTitle>
                      {module.is_favorite && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    {module.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {module.description}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onModuleSelect(module)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateModule(module)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleFavorite(module.id)}>
                        {module.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                      </DropdownMenuItem>
                      {!module.is_archived ? (
                        <DropdownMenuItem onClick={() => onArchiveModule(module.id)}>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onArchiveModule(module.id)}>
                          Unarchive
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => onDeleteModule(module.id)}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Status and Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className={`${status.color} text-white`}>
                      {status.label}
                    </Badge>
                    <span className="text-sm font-medium">{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-gray-400" />
                    <span>{module.total_issues} issues</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span>{module.completed_issues} done</span>
                  </div>
                </div>

                {/* Dates */}
                {(module.start_date || module.target_date) && (
                  <div className="space-y-2 text-sm text-gray-600">
                    {module.start_date && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Started {format(new Date(module.start_date), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                    {module.target_date && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Due {format(new Date(module.target_date), 'MMM dd, yyyy')}
                          {daysRemaining !== null && (
                            <span className={`ml-2 ${daysRemaining < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                              ({daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`})
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Lead and Members */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={module.lead.avatar} />
                      <AvatarFallback className="text-xs">
                        {module.lead.display_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{module.lead.display_name}</span>
                    {module.members.length > 1 && (
                      <Badge variant="outline" className="text-xs">
                        +{module.members.length - 1} members
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Target className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? "Get started by creating your first module"
              : `No ${filter} modules at the moment`
            }
          </p>
          {filter === 'all' && (
            <Button onClick={onCreateModule}>
              <Plus className="h-4 w-4 mr-2" />
              Create Module
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
