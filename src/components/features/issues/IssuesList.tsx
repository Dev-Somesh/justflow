import React, { useState } from 'react';
import { Issue, IssueFilter, ViewProps } from '@/types/issue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Filter, Search, Calendar, User, Tag, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface IssuesListProps {
  issues: Issue[];
  filters: IssueFilter[];
  onFilterChange: (filter: IssueFilter) => void;
  onIssueSelect: (issue: Issue) => void;
  onCreateIssue: () => void;
  onUpdateIssue: (issue: Issue) => void;
  onDeleteIssue: (issueId: string) => void;
}

export const IssuesList: React.FC<IssuesListProps> = ({
  issues,
  filters,
  onFilterChange,
  onIssueSelect,
  onCreateIssue,
  onUpdateIssue,
  onDeleteIssue,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<IssueFilter | null>(null);
  const [groupBy, setGroupBy] = useState<'state' | 'priority' | 'assignees' | 'labels'>('state');

  const filteredIssues = issues.filter(issue => {
    if (searchQuery) {
      return issue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'todo': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const groupedIssues = filteredIssues.reduce((acc, issue) => {
    let key: string;
    switch (groupBy) {
      case 'state':
        key = issue.state;
        break;
      case 'priority':
        key = issue.priority;
        break;
      case 'assignees':
        key = issue.assignees.length > 0 ? issue.assignees[0].id : 'unassigned';
        break;
      case 'labels':
        key = issue.labels.length > 0 ? issue.labels[0].id : 'unlabeled';
        break;
      default:
        key = 'all';
    }
    
    if (!acc[key]) acc[key] = [];
    acc[key].push(issue);
    return acc;
  }, {} as Record<string, Issue[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Issues</h2>
          <Badge variant="secondary">{issues.length} issues</Badge>
        </div>
        <Button onClick={onCreateIssue} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Issue</span>
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={groupBy} onValueChange={(value: any) => setGroupBy(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="state">State</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="assignees">Assignees</SelectItem>
            <SelectItem value="labels">Labels</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Issues Grid */}
      <div className="space-y-6">
        {Object.entries(groupedIssues).map(([groupKey, groupIssues]) => (
          <div key={groupKey} className="space-y-3">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold capitalize">
                {groupBy === 'assignees' && groupKey === 'unassigned' ? 'Unassigned' : 
                 groupBy === 'labels' && groupKey === 'unlabeled' ? 'Unlabeled' : 
                 groupKey}
              </h3>
              <Badge variant="outline">{groupIssues.length}</Badge>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groupIssues.map((issue) => (
                <Card 
                  key={issue.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onIssueSelect(issue)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getStateColor(issue.state)}`} />
                        <CardTitle className="text-sm font-medium line-clamp-2">
                          {issue.name}
                        </CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => onIssueSelect(issue)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateIssue(issue)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onDeleteIssue(issue.id)}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Description */}
                      {issue.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {issue.description}
                        </p>
                      )}
                      
                      {/* Labels */}
                      {issue.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {issue.labels.slice(0, 3).map((label) => (
                            <Badge key={label.id} variant="secondary" className="text-xs">
                              {label.name}
                            </Badge>
                          ))}
                          {issue.labels.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{issue.labels.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {/* Assignees */}
                      {issue.assignees.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <div className="flex -space-x-2">
                            {issue.assignees.slice(0, 3).map((assignee) => (
                              <Avatar key={assignee.id} className="h-6 w-6 border-2 border-white">
                                <AvatarImage src={assignee.avatar} />
                                <AvatarFallback className="text-xs">
                                  {assignee.display_name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {issue.assignees.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                                +{issue.assignees.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Priority and Dates */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(issue.priority)}`} />
                          <span className="capitalize">{issue.priority}</span>
                        </div>
                        {issue.target_date && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(issue.target_date), 'MMM dd')}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Sub-issues count */}
                      {issue.sub_issues_count > 0 && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <AlertCircle className="h-3 w-3" />
                          <span>{issue.sub_issues_count} sub-issues</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
