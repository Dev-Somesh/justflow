import React, { useState } from 'react';
import { Cycle, CycleStats } from '@/types/cycle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Calendar, Users, Target, TrendingUp, Clock } from 'lucide-react';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';

interface CyclesListProps {
  cycles: Cycle[];
  onCycleSelect: (cycle: Cycle) => void;
  onCreateCycle: () => void;
  onUpdateCycle: (cycle: Cycle) => void;
  onDeleteCycle: (cycleId: string) => void;
  onStartCycle: (cycleId: string) => void;
  onCompleteCycle: (cycleId: string) => void;
}

export const CyclesList: React.FC<CyclesListProps> = ({
  cycles,
  onCycleSelect,
  onCreateCycle,
  onUpdateCycle,
  onDeleteCycle,
  onStartCycle,
  onCompleteCycle,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');

  const filteredCycles = cycles.filter(cycle => {
    const now = new Date();
    const startDate = new Date(cycle.start_date);
    const endDate = new Date(cycle.end_date);
    
    switch (filter) {
      case 'active':
        return cycle.is_started && !cycle.is_completed && isAfter(now, startDate) && isBefore(now, endDate);
      case 'upcoming':
        return !cycle.is_started && isAfter(startDate, now);
      case 'completed':
        return cycle.is_completed;
      default:
        return true;
    }
  });

  const getCycleStatus = (cycle: Cycle) => {
    const now = new Date();
    const startDate = new Date(cycle.start_date);
    const endDate = new Date(cycle.end_date);
    
    if (cycle.is_completed) return { label: 'Completed', color: 'bg-green-500' };
    if (cycle.is_started && isAfter(now, endDate)) return { label: 'Overdue', color: 'bg-red-500' };
    if (cycle.is_started) return { label: 'Active', color: 'bg-blue-500' };
    if (isAfter(now, startDate)) return { label: 'Started', color: 'bg-yellow-500' };
    return { label: 'Upcoming', color: 'bg-gray-500' };
  };

  const getDaysRemaining = (cycle: Cycle) => {
    const now = new Date();
    const endDate = new Date(cycle.end_date);
    return differenceInDays(endDate, now);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Cycles</h2>
          <Badge variant="secondary">{cycles.length} cycles</Badge>
        </div>
        <Button onClick={onCreateCycle} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Cycle</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'all', label: 'All' },
          { key: 'active', label: 'Active' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'completed', label: 'Completed' },
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

      {/* Cycles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCycles.map((cycle) => {
          const status = getCycleStatus(cycle);
          const daysRemaining = getDaysRemaining(cycle);
          
          return (
            <Card 
              key={cycle.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onCycleSelect(cycle)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {cycle.name}
                    </CardTitle>
                    {cycle.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {cycle.description}
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
                      <DropdownMenuItem onClick={() => onCycleSelect(cycle)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateCycle(cycle)}>
                        Edit
                      </DropdownMenuItem>
                      {!cycle.is_started && (
                        <DropdownMenuItem onClick={() => onStartCycle(cycle.id)}>
                          Start Cycle
                        </DropdownMenuItem>
                      )}
                      {cycle.is_started && !cycle.is_completed && (
                        <DropdownMenuItem onClick={() => onCompleteCycle(cycle.id)}>
                          Complete Cycle
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => onDeleteCycle(cycle.id)}
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
                    <span className="text-sm font-medium">{cycle.progress}%</span>
                  </div>
                  <Progress value={cycle.progress} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-gray-400" />
                    <span>{cycle.total_issues} issues</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span>{cycle.completed_issues} done</span>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(cycle.start_date), 'MMM dd')} - {format(new Date(cycle.end_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  {daysRemaining > 0 && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{daysRemaining} days remaining</span>
                    </div>
                  )}
                </div>

                {/* Owner */}
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={cycle.owned_by.avatar} />
                    <AvatarFallback className="text-xs">
                      {cycle.owned_by.display_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">{cycle.owned_by.display_name}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCycles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cycles found</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? "Get started by creating your first cycle"
              : `No ${filter} cycles at the moment`
            }
          </p>
          {filter === 'all' && (
            <Button onClick={onCreateCycle}>
              <Plus className="h-4 w-4 mr-2" />
              Create Cycle
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
