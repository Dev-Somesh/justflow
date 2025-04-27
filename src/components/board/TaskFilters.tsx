import React, { useState, useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import UserAvatar from '@/components/ui/UserAvatar';
import { 
  Filter, 
  CalendarIcon,
  X,
  CheckSquare,
  ArrowDownAZ,
  CalendarRange,
  Tag,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import type { TaskFilters as TaskFiltersType } from '@/contexts/ProjectContext';
import { DateRange } from 'react-day-picker';

interface TaskFiltersProps {
  projectId: string;
  onFilterChange: (search: string, filters: TaskFiltersType) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ projectId, onFilterChange }) => {
  const { users, availableLabels, getSprints } = useProject();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Get all sprints for the project
  const sprints = getSprints(projectId);
  
  // Update filter count
  useEffect(() => {
    let count = 0;
    if (filters.status && filters.status.length) count++;
    if (filters.priority && filters.priority.length) count++;
    if (filters.assigneeId && filters.assigneeId.length) count++;
    if (filters.labelIds && filters.labelIds.length) count++;
    if (filters.dueDateFrom || filters.dueDateTo) count++;
    if (filters.sprintId && filters.sprintId.length) count++;
    setActiveFiltersCount(count);
  }, [filters]);
  
  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange(search, filters);
  }, [search, filters, onFilterChange]);
  
  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setFilters({});
    setDateRange(undefined);
  };
  
  // Toggle status filter
  const toggleStatusFilter = (status: string) => {
    setFilters(prev => {
      const currentStatuses = prev.status || [];
      const newStatuses = currentStatuses.includes(status as any)
        ? currentStatuses.filter(s => s !== status)
        : [...currentStatuses, status] as any;
      
      return {
        ...prev,
        status: newStatuses.length > 0 ? newStatuses : undefined
      };
    });
  };
  
  // Toggle priority filter
  const togglePriorityFilter = (priority: string) => {
    setFilters(prev => {
      const currentPriorities = prev.priority || [];
      const newPriorities = currentPriorities.includes(priority as any)
        ? currentPriorities.filter(p => p !== priority)
        : [...currentPriorities, priority] as any;
      
      return {
        ...prev,
        priority: newPriorities.length > 0 ? newPriorities : undefined
      };
    });
  };
  
  // Toggle assignee filter
  const toggleAssigneeFilter = (userId: string) => {
    setFilters(prev => {
      const currentAssignees = prev.assigneeId || [];
      const newAssignees = currentAssignees.includes(userId)
        ? currentAssignees.filter(id => id !== userId)
        : [...currentAssignees, userId];
      
      return {
        ...prev,
        assigneeId: newAssignees.length > 0 ? newAssignees : undefined
      };
    });
  };
  
  // Toggle label filter
  const toggleLabelFilter = (labelId: string) => {
    setFilters(prev => {
      const currentLabels = prev.labelIds || [];
      const newLabels = currentLabels.includes(labelId)
        ? currentLabels.filter(id => id !== labelId)
        : [...currentLabels, labelId];
      
      return {
        ...prev,
        labelIds: newLabels.length > 0 ? newLabels : undefined
      };
    });
  };
  
  // Toggle sprint filter
  const toggleSprintFilter = (sprintId: string) => {
    setFilters(prev => {
      const currentSprints = prev.sprintId || [];
      const newSprints = currentSprints.includes(sprintId)
        ? currentSprints.filter(id => id !== sprintId)
        : [...currentSprints, sprintId];
      
      return {
        ...prev,
        sprintId: newSprints.length > 0 ? newSprints : undefined
      };
    });
  };
  
  // Update date range filter
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    setFilters(prev => ({
      ...prev,
      dueDateFrom: range?.from ? format(range.from, 'yyyy-MM-dd') : undefined,
      dueDateTo: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined
    }));
  };
  
  // Check if a filter is active
  const isFilterActive = (type: string, value: string) => {
    switch (type) {
      case 'status':
        return filters.status?.includes(value as any) || false;
      case 'priority':
        return filters.priority?.includes(value as any) || false;
      case 'assignee':
        return filters.assigneeId?.includes(value) || false;
      case 'label':
        return filters.labelIds?.includes(value) || false;
      case 'sprint':
        return filters.sprintId?.includes(value) || false;
      default:
        return false;
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-2 mb-2">
        <div className="relative grow">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <ArrowDownAZ className="h-4 w-4 absolute top-3 left-3 text-gray-400" />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearch('')}
              className="absolute top-2 right-2 h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                {activeFiltersCount > 0 && (
                  <Badge className="ml-1 bg-primary text-primary-foreground h-5 w-5 p-0 text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs">Status</DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => toggleStatusFilter('todo')}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>To Do</span>
                  {isFilterActive('status', 'todo') && <CheckSquare className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => toggleStatusFilter('in-progress')}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>In Progress</span>
                  {isFilterActive('status', 'in-progress') && <CheckSquare className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => toggleStatusFilter('done')}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>Done</span>
                  {isFilterActive('status', 'done') && <CheckSquare className="h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs">Priority</DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => togglePriorityFilter('high')}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-priority-high rounded-full"></div>
                    <span>High</span>
                  </div>
                  {isFilterActive('priority', 'high') && <CheckSquare className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => togglePriorityFilter('medium')}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-priority-medium rounded-full"></div>
                    <span>Medium</span>
                  </div>
                  {isFilterActive('priority', 'medium') && <CheckSquare className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => togglePriorityFilter('low')}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-priority-low rounded-full"></div>
                    <span>Low</span>
                  </div>
                  {isFilterActive('priority', 'low') && <CheckSquare className="h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex items-center gap-1 text-xs">
                  <User className="h-3 w-3" />
                  <span>Assignees</span>
                </DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => toggleAssigneeFilter('unassigned')}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>Unassigned</span>
                  {isFilterActive('assignee', 'unassigned') && <CheckSquare className="h-4 w-4" />}
                </DropdownMenuItem>
                {users.map(user => (
                  <DropdownMenuItem 
                    key={user.id}
                    onClick={() => toggleAssigneeFilter(user.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <UserAvatar src={user.avatar} name={user.name} size="sm" />
                      <span>{user.name}</span>
                    </div>
                    {isFilterActive('assignee', user.id) && <CheckSquare className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex items-center gap-1 text-xs">
                  <Tag className="h-3 w-3" />
                  <span>Sprints</span>
                </DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => toggleSprintFilter('none')}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>No Sprint</span>
                  {isFilterActive('sprint', 'none') && <CheckSquare className="h-4 w-4" />}
                </DropdownMenuItem>
                {sprints.map(sprint => (
                  <DropdownMenuItem 
                    key={sprint.id}
                    onClick={() => toggleSprintFilter(sprint.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>{sprint.name}</span>
                    {isFilterActive('sprint', sprint.id) && <CheckSquare className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs">Labels</DropdownMenuLabel>
                {availableLabels.map(label => (
                  <DropdownMenuItem 
                    key={label.id}
                    onClick={() => toggleLabelFilter(label.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: label.color }}
                      ></div>
                      <span>{label.name}</span>
                    </div>
                    {isFilterActive('label', label.id) && <CheckSquare className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="w-full mt-2 text-xs"
                >
                  Clear all filters
                </Button>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarRange className="h-4 w-4" />
                <span>Due Date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-3 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Date Range</h3>
                  {(dateRange?.from || dateRange?.to) && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDateRangeSelect(undefined)}
                      className="h-8 px-2 py-1"
                    >
                      Reset
                    </Button>
                  )}
                </div>
                {dateRange?.from && dateRange.to ? (
                  <div className="text-xs text-gray-500 pt-1">
                    {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 pt-1">
                    Select a date range
                  </div>
                )}
              </div>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleDateRangeSelect}
                numberOfMonths={1}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.status?.map(status => (
            <Badge 
              key={status} 
              variant="outline" 
              className="flex items-center gap-1 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleStatusFilter(status)}
            >
              Status: {status}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          
          {filters.priority?.map(priority => (
            <Badge 
              key={priority} 
              variant="outline" 
              className="flex items-center gap-1 cursor-pointer hover:bg-gray-100"
              onClick={() => togglePriorityFilter(priority)}
            >
              Priority: {priority}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          
          {filters.assigneeId?.map(assigneeId => {
            if (assigneeId === 'unassigned') {
              return (
                <Badge 
                  key={assigneeId} 
                  variant="outline" 
                  className="flex items-center gap-1 cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleAssigneeFilter(assigneeId)}
                >
                  Unassigned
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              );
            }
            
            const user = users.find(u => u.id === assigneeId);
            return (
              <Badge 
                key={assigneeId} 
                variant="outline" 
                className="flex items-center gap-1 cursor-pointer hover:bg-gray-100"
                onClick={() => toggleAssigneeFilter(assigneeId)}
              >
                <User className="h-3 w-3 mr-1" />
                {user ? user.name : assigneeId}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            );
          })}
          
          {filters.sprintId?.map(sprintId => {
            if (sprintId === 'none') {
              return (
                <Badge 
                  key={sprintId} 
                  variant="outline" 
                  className="flex items-center gap-1 cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSprintFilter(sprintId)}
                >
                  No Sprint
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              );
            }
            
            const sprint = sprints.find(s => s.id === sprintId);
            return (
              <Badge 
                key={sprintId} 
                variant="outline" 
                className="flex items-center gap-1 cursor-pointer hover:bg-gray-100"
                onClick={() => toggleSprintFilter(sprintId)}
              >
                Sprint: {sprint ? sprint.name : sprintId}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            );
          })}
          
          {filters.labelIds?.map(labelId => {
            const label = availableLabels.find(l => l.id === labelId);
            return (
              <Badge 
                key={labelId} 
                variant="outline" 
                className="flex items-center gap-1 cursor-pointer hover:bg-gray-100"
                onClick={() => toggleLabelFilter(labelId)}
              >
                <div 
                  className="w-2 h-2 rounded-full mr-1" 
                  style={{ backgroundColor: label?.color || '#ccc' }}
                ></div>
                {label ? label.name : labelId}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            );
          })}
          
          {(filters.dueDateFrom || filters.dueDateTo) && (
            <Badge 
              variant="outline" 
              className="flex items-center gap-1 cursor-pointer hover:bg-gray-100"
              onClick={() => handleDateRangeSelect({})}
            >
              <CalendarIcon className="h-3 w-3 mr-1" />
              Due: {filters.dueDateFrom && format(new Date(filters.dueDateFrom), 'MMM d')}
              {filters.dueDateFrom && filters.dueDateTo && ' - '}
              {filters.dueDateTo && format(new Date(filters.dueDateTo), 'MMM d')}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-xs h-6">
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
