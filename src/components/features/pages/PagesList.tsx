import React, { useState } from 'react';
import { Page, PageTemplate } from '@/types/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MoreHorizontal, Search, Star, Lock, Users, FileText, Calendar, User, Globe, Lock as LockIcon } from 'lucide-react';
import { format } from 'date-fns';

interface PagesListProps {
  pages: Page[];
  templates: PageTemplate[];
  onPageSelect: (page: Page) => void;
  onCreatePage: () => void;
  onCreateFromTemplate: (template: PageTemplate) => void;
  onUpdatePage: (page: Page) => void;
  onDeletePage: (pageId: string) => void;
  onToggleFavorite: (pageId: string) => void;
  onToggleLock: (pageId: string) => void;
  onSharePage: (page: Page) => void;
}

export const PagesList: React.FC<PagesListProps> = ({
  pages,
  templates,
  onPageSelect,
  onCreatePage,
  onCreateFromTemplate,
  onUpdatePage,
  onDeletePage,
  onToggleFavorite,
  onToggleLock,
  onSharePage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites' | 'private' | 'public' | 'workspace'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'updated_at'>('updated_at');

  const filteredPages = pages
    .filter(page => {
      if (searchQuery) {
        return page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               page.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               page.content.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .filter(page => {
      switch (filter) {
        case 'favorites':
          return page.is_favorite;
        case 'private':
          return page.access === 'private';
        case 'public':
          return page.access === 'public';
        case 'workspace':
          return page.access === 'workspace';
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'updated_at':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        default:
          return 0;
      }
    });

  const getAccessIcon = (access: string) => {
    switch (access) {
      case 'private':
        return <LockIcon className="h-4 w-4 text-gray-500" />;
      case 'public':
        return <Globe className="h-4 w-4 text-green-500" />;
      case 'workspace':
        return <Users className="h-4 w-4 text-blue-500" />;
      default:
        return <LockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAccessColor = (access: string) => {
    switch (access) {
      case 'private':
        return 'bg-gray-100 text-gray-700';
      case 'public':
        return 'bg-green-100 text-green-700';
      case 'workspace':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Pages</h2>
          <Badge variant="secondary">{pages.length} pages</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Page</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onCreatePage}>
                <FileText className="h-4 w-4 mr-2" />
                Blank Page
              </DropdownMenuItem>
              {templates.length > 0 && (
                <>
                  <div className="px-2 py-1 text-xs font-medium text-gray-500">Templates</div>
                  {templates.slice(0, 5).map((template) => (
                    <DropdownMenuItem 
                      key={template.id} 
                      onClick={() => onCreateFromTemplate(template)}
                    >
                      {template.name}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pages</SelectItem>
            <SelectItem value="favorites">Favorites</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="workspace">Workspace</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="created_at">Created</SelectItem>
            <SelectItem value="updated_at">Updated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pages Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPages.map((page) => (
          <Card 
            key={page.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onPageSelect(page)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {page.name}
                    </CardTitle>
                    {page.is_favorite && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                    {page.is_locked && (
                      <Lock className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  {page.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {page.description}
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
                    <DropdownMenuItem onClick={() => onPageSelect(page)}>
                      Open
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdatePage(page)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleFavorite(page.id)}>
                      {page.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleLock(page.id)}>
                      {page.is_locked ? 'Unlock' : 'Lock'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSharePage(page)}>
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDeletePage(page.id)}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Access Level */}
              <div className="flex items-center space-x-2">
                {getAccessIcon(page.access)}
                <Badge className={getAccessColor(page.access)}>
                  {page.access}
                </Badge>
              </div>

              {/* Content Preview */}
              <div className="text-sm text-gray-600 line-clamp-3">
                {page.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>{page.sub_pages_count} sub-pages</span>
                  </div>
                  {page.collaborators.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{page.collaborators.length}</span>
                    </div>
                  )}
                </div>
                <div className="text-xs">
                  v{page.version}
                </div>
              </div>

              {/* Author and Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={page.created_by.avatar} />
                    <AvatarFallback className="text-xs">
                      {page.created_by.display_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">{page.created_by.display_name}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {format(new Date(page.updated_at), 'MMM dd')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FileText className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pages found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? "No pages match your search"
              : filter === 'all' 
                ? "Get started by creating your first page"
                : `No ${filter} pages at the moment`
            }
          </p>
          {!searchQuery && filter === 'all' && (
            <Button onClick={onCreatePage}>
              <Plus className="h-4 w-4 mr-2" />
              Create Page
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
