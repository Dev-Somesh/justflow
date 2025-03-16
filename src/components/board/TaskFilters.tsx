
import React, { useState } from 'react';
import { 
  useProject, 
  TaskFilters as TaskFiltersType, 
  TaskPriority, 
  TaskStatus 
} from '@/contexts/ProjectContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Search, Filter, X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface TaskFiltersProps {
  projectId: string;
  onFilterChange: (query: string, filters: TaskFiltersType) => void;
}

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const TaskFilters: React.FC<TaskFiltersProps> = ({ projectId, onFilterChange }) => {
  const { users, availableLabels } = useProject();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onFilterChange(newQuery, filters);
  };

  const handleFilterChange = (newFilters: TaskFiltersType) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(query, updatedFilters);
  };

  const clearFilters = () => {
    setQuery('');
    setFilters({});
    onFilterChange('', {});
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(
    value => Array.isArray(value) ? value.length > 0 : value !== undefined
  ).length;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={query}
            onChange={handleQueryChange}
            className="pl-9"
          />
        </div>
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h3 className="font-medium">Filter tasks</h3>
              
              <div>
                <label className="text-sm font-medium mb-1 block text-gray-500">Status</label>
                <div className="flex flex-wrap gap-1">
                  {statusOptions.map(option => (
                    <Badge 
                      key={option.value}
                      variant={filters.status?.includes(option.value as TaskStatus) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        const currentStatuses = filters.status || [];
                        const newStatuses = currentStatuses.includes(option.value as TaskStatus)
                          ? currentStatuses.filter(s => s !== option.value)
                          : [...currentStatuses, option.value as TaskStatus];
                        handleFilterChange({ status: newStatuses });
                      }}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block text-gray-500">Priority</label>
                <div className="flex flex-wrap gap-1">
                  {priorityOptions.map(option => (
                    <Badge 
                      key={option.value}
                      variant={filters.priority?.includes(option.value as TaskPriority) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        const currentPriorities = filters.priority || [];
                        const newPriorities = currentPriorities.includes(option.value as TaskPriority)
                          ? currentPriorities.filter(p => p !== option.value)
                          : [...currentPriorities, option.value as TaskPriority];
                        handleFilterChange({ priority: newPriorities });
                      }}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block text-gray-500">Assignee</label>
                <Select 
                  value={filters.assigneeId?.[0] || ''}
                  onValueChange={(value) => {
                    handleFilterChange({ assigneeId: value ? [value] : [] });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any assignee</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block text-gray-500">Labels</label>
                <div className="flex flex-wrap gap-1">
                  {availableLabels.map(label => (
                    <Badge 
                      key={label.id}
                      variant={filters.labelIds?.includes(label.id) ? 'default' : 'outline'}
                      style={{ backgroundColor: filters.labelIds?.includes(label.id) ? label.color : 'transparent', 
                              color: filters.labelIds?.includes(label.id) ? 'white' : 'currentColor',
                              borderColor: label.color }}
                      className="cursor-pointer"
                      onClick={() => {
                        const currentLabels = filters.labelIds || [];
                        const newLabels = currentLabels.includes(label.id)
                          ? currentLabels.filter(id => id !== label.id)
                          : [...currentLabels, label.id];
                        handleFilterChange({ labelIds: newLabels });
                      }}
                    >
                      {label.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block text-gray-500">Due Date</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs mb-1">From</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left text-xs h-8"
                        >
                          <CalendarIcon className="mr-2 h-3 w-3" />
                          {filters.dueDateFrom ? (
                            format(new Date(filters.dueDateFrom), "PP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.dueDateFrom ? new Date(filters.dueDateFrom) : undefined}
                          onSelect={(date) => handleFilterChange({ dueDateFrom: date?.toISOString() })}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <p className="text-xs mb-1">To</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left text-xs h-8"
                        >
                          <CalendarIcon className="mr-2 h-3 w-3" />
                          {filters.dueDateTo ? (
                            format(new Date(filters.dueDateTo), "PP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.dueDateTo ? new Date(filters.dueDateTo) : undefined}
                          onSelect={(date) => handleFilterChange({ dueDateTo: date?.toISOString() })}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="ghost" onClick={clearFilters} className="mr-2">
                  <X className="mr-1 h-4 w-4" />
                  Clear
                </Button>
                <Button onClick={() => setShowFilters(false)}>Apply</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Active filters display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {query && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {query}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => {
                  setQuery('');
                  onFilterChange('', filters);
                }}
              />
            </Badge>
          )}
          
          {filters.status?.map(status => (
            <Badge key={status} variant="secondary" className="flex items-center gap-1">
              Status: {statusOptions.find(o => o.value === status)?.label}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => {
                  const newStatuses = filters.status?.filter(s => s !== status) || [];
                  handleFilterChange({ status: newStatuses });
                }}
              />
            </Badge>
          ))}
          
          {filters.priority?.map(priority => (
            <Badge key={priority} variant="secondary" className="flex items-center gap-1">
              Priority: {priorityOptions.find(o => o.value === priority)?.label}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => {
                  const newPriorities = filters.priority?.filter(p => p !== priority) || [];
                  handleFilterChange({ priority: newPriorities });
                }}
              />
            </Badge>
          ))}
          
          {filters.assigneeId?.map(id => {
            const label = id === 'unassigned' 
              ? 'Unassigned' 
              : `Assignee: ${users.find(u => u.id === id)?.name || 'Unknown'}`;
            
            return (
              <Badge key={id} variant="secondary" className="flex items-center gap-1">
                {label}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => handleFilterChange({ assigneeId: [] })}
                />
              </Badge>
            );
          })}
          
          {filters.labelIds?.map(id => {
            const label = availableLabels.find(l => l.id === id);
            
            return (
              <Badge 
                key={id} 
                variant="secondary" 
                className="flex items-center gap-1"
                style={{ borderLeft: `3px solid ${label?.color || 'gray'}` }}
              >
                Label: {label?.name || 'Unknown'}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => {
                    const newLabels = filters.labelIds?.filter(l => l !== id) || [];
                    handleFilterChange({ labelIds: newLabels });
                  }}
                />
              </Badge>
            );
          })}
          
          {(filters.dueDateFrom || filters.dueDateTo) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Due date: {filters.dueDateFrom ? format(new Date(filters.dueDateFrom), "MMM d") : 'Any'} 
              {' '} to {' '}
              {filters.dueDateTo ? format(new Date(filters.dueDateTo), "MMM d") : 'Any'}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleFilterChange({ dueDateFrom: undefined, dueDateTo: undefined })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
