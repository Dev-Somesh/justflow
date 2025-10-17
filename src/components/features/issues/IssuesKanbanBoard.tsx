import React, { useState } from 'react';
import { Issue, IssueFilter } from '@/types/issue';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, RefreshCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface IssuesKanbanBoardProps {
  issues: Issue[];
  onIssueSelect: (issue: Issue) => void;
  onUpdateIssue: (issue: Issue) => void;
  onDeleteIssue: (issueId: string) => void;
  onCreateIssue: (state: string) => void;
  filters?: IssueFilter[];
  onFilterChange?: (filter: IssueFilter) => void;
}

interface ColumnConfig {
  id: string;
  title: string;
  color: string;
}

const columns: ColumnConfig[] = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-500' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'completed', title: 'Completed', color: 'bg-green-500' },
  { id: 'cancelled', title: 'Cancelled', color: 'bg-red-500' },
];

const IssuesKanbanBoard: React.FC<IssuesKanbanBoardProps> = ({
  issues,
  onIssueSelect,
  onUpdateIssue,
  onDeleteIssue,
  onCreateIssue,
  filters = [],
  onFilterChange,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Show loading feedback
    setIsLoading(true);

    try {
      // Find the issue being moved
      const issue = issues.find(i => i.id === draggableId);
      if (!issue) {
        throw new Error('Issue not found');
      }

      // Update the issue state
      const updatedIssue = { ...issue, state: destination.droppableId };
      onUpdateIssue(updatedIssue);
      
      // Show success toast
      toast({
        title: "Issue updated",
        description: `Issue moved to ${destination.droppableId.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error("Failed to update issue status:", error);
      setHasError(true);
      
      // Show error toast
      toast({
        title: "Failed to update issue",
        description: "There was an error updating the issue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    toast({
      title: "Refreshing board",
      description: "Attempting to reload board data...",
    });
  };

  // Get issues for each column
  const getIssuesByState = (state: string) => {
    return issues.filter(issue => issue.state === state);
  };

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Failed to load issues</h3>
        <p className="text-gray-500 mb-4 text-center max-w-md">
          There was an error loading the issues. This could be due to a connection issue or server error.
        </p>
        <Button onClick={handleRetry} className="flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        {columns.map((column) => {
          const columnIssues = getIssuesByState(column.id);
          
          return (
            <div key={column.id} className="flex flex-col h-full min-w-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                  <h3 className="font-medium">{column.title}</h3>
                  <span className="text-sm text-gray-500 ml-1">({columnIssues.length})</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => onCreateIssue(column.id)}
                >
                  <Plus size={16} />
                </Button>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-50 rounded-md p-3 min-h-[300px] flex-1"
                  >
                    {isLoading ? (
                      // Loading skeletons
                      [...Array(3)].map((_, index) => (
                        <Card key={`skeleton-${index}`} className="mb-3 animate-pulse">
                          <CardContent className="p-4">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      columnIssues.map((issue, index) => (
                        <Draggable key={issue.id} draggableId={issue.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card 
                                className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => onIssueSelect(issue)}
                              >
                                <CardContent className="p-4">
                                  <div className="space-y-3">
                                    {/* Issue Title */}
                                    <div className="flex items-start justify-between">
                                      <h4 className="font-medium text-sm line-clamp-2">
                                        {issue.name}
                                      </h4>
                                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(issue.priority)} ml-2 flex-shrink-0`} />
                                    </div>
                                    
                                    {/* Description */}
                                    {issue.description && (
                                      <p className="text-xs text-gray-600 line-clamp-2">
                                        {issue.description}
                                      </p>
                                    )}
                                    
                                    {/* Labels */}
                                    {issue.labels.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {issue.labels.slice(0, 2).map((label) => (
                                          <Badge key={label.id} variant="secondary" className="text-xs px-1 py-0">
                                            {label.name}
                                          </Badge>
                                        ))}
                                        {issue.labels.length > 2 && (
                                          <Badge variant="secondary" className="text-xs px-1 py-0">
                                            +{issue.labels.length - 2}
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                    
                                    {/* Assignees */}
                                    {issue.assignees.length > 0 && (
                                      <div className="flex items-center space-x-1">
                                        <div className="flex -space-x-1">
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
                                    
                                    {/* Due Date */}
                                    {issue.target_date && (
                                      <div className="text-xs text-gray-500">
                                        Due: {format(new Date(issue.target_date), 'MMM dd')}
                                      </div>
                                    )}
                                    
                                    {/* Sub-issues count */}
                                    {issue.sub_issues_count > 0 && (
                                      <div className="text-xs text-gray-500">
                                        {issue.sub_issues_count} sub-issues
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {!isLoading && columnIssues.length === 0 && (
                      <div className="flex items-center justify-center h-32 text-gray-400">
                        <div className="text-center">
                          <div className="text-sm">No issues</div>
                        </div>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default IssuesKanbanBoard;
