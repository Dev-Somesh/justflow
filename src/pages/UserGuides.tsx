
import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Logo from '@/components/ui/Logo';
import AppFooter from '@/components/layouts/AppFooter';
import { Bookmark, Layout, Kanban, CalendarDays, Users, Layers, BarChart, Settings } from 'lucide-react';

const UserGuides = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Logo size="sm" />
            <span className="font-mono font-semibold text-xl text-blue-600 ml-2">JustFlow</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</Link>
            <Link to="/faqs" className="text-gray-600 hover:text-blue-600 transition-colors">FAQs</Link>
            <Link to="/guides" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Guides</Link>
            <Link to="/api-docs" className="text-gray-600 hover:text-blue-600 transition-colors">API</Link>
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Login</Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow container mx-auto py-12 px-4 bg-[url('/pattern-bg.svg')] bg-cover bg-center">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md backdrop-blur-sm bg-white/90">
          <h1 className="text-3xl font-bold mb-8 text-center">User Guides</h1>
          
          <Tabs defaultValue="getting-started" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="board">Boards & Tasks</TabsTrigger>
              <TabsTrigger value="sprints">Sprints & Epics</TabsTrigger>
              <TabsTrigger value="teams">Team Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="getting-started">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                      <Bookmark className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Creating Your First Project</h3>
                        <p className="text-gray-700 mb-4">
                          After logging in, you'll be directed to the Dashboard. To create a new project:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 ml-4">
                          <li>Click the "New Project" button on the dashboard</li>
                          <li>Fill in the project name and description</li>
                          <li>Optionally, invite team members</li>
                          <li>Click "Create Project" to finish</li>
                        </ol>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <Layout className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Navigating the Interface</h3>
                        <p className="text-gray-700 mb-4">
                          JustFlow's interface is designed to be intuitive and easy to use:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li><strong>Dashboard</strong>: Overview of all projects and recent activity</li>
                          <li><strong>Board</strong>: Kanban view of tasks organized by status</li>
                          <li><strong>Calendar</strong>: Timeline view of tasks and deadlines</li>
                          <li><strong>Team</strong>: Manage team members and roles</li>
                          <li><strong>Epics</strong>: Organize large features or initiatives</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <Settings className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Configuring Your Workspace</h3>
                        <p className="text-gray-700 mb-4">
                          Customize JustFlow to fit your team's workflow:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>Update project settings in the Settings tab</li>
                          <li>Create custom labels for tasks</li>
                          <li>Set up notification preferences</li>
                          <li>Integrate with external tools like Slack or GitHub</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="board">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                      <Kanban className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Working with Boards</h3>
                        <p className="text-gray-700 mb-4">
                          The Board view is a Kanban-style interface for managing tasks:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>Tasks are organized into columns by status (Todo, In Progress, Done)</li>
                          <li>Drag and drop tasks between columns to update their status</li>
                          <li>Click on a task to view details or make edits</li>
                          <li>Use filters to focus on specific priorities, assignees, or labels</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <Layers className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Creating and Managing Tasks</h3>
                        <p className="text-gray-700 mb-4">
                          Tasks are the basic unit of work in JustFlow:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 ml-4">
                          <li>Click the "+" button in any column to create a new task</li>
                          <li>Add a title, description, priority, and assignee</li>
                          <li>Set a due date and add labels as needed</li>
                          <li>Optionally, assign to a sprint or epic</li>
                          <li>Add comments to discuss the task with your team</li>
                          <li>Track time spent on the task</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sprints">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                      <CalendarDays className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Sprint Planning and Management</h3>
                        <p className="text-gray-700 mb-4">
                          Sprints are time-boxed periods (usually 1-4 weeks) for completing a set of tasks:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 ml-4">
                          <li>Navigate to the Board or Epics page and click "New Sprint"</li>
                          <li>Set a name, goal, start date, and end date</li>
                          <li>Assign tasks to the sprint by dragging them or using the task modal</li>
                          <li>Assign story points to estimate task effort</li>
                          <li>Monitor sprint progress using the burndown chart</li>
                          <li>Complete a sprint when all tasks are done</li>
                        </ol>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <Layers className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Working with Epics</h3>
                        <p className="text-gray-700 mb-4">
                          Epics are large bodies of work that can span multiple sprints:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 ml-4">
                          <li>Go to the Epics page and click "New Epic"</li>
                          <li>Add a name, description, and color for the epic</li>
                          <li>Create tasks within the epic or assign existing tasks</li>
                          <li>Track epic progress as tasks are completed</li>
                          <li>View epic details to see all associated tasks</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="teams">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                      <Users className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Managing Team Members</h3>
                        <p className="text-gray-700 mb-4">
                          Add and manage team members in JustFlow:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 ml-4">
                          <li>Navigate to the Team page</li>
                          <li>Click "Add Member" to invite new team members</li>
                          <li>Assign roles (Admin, Manager, or Member)</li>
                          <li>Admins can assign multiple roles to team members</li>
                          <li>Remove members or update their roles as needed</li>
                        </ol>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <BarChart className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Team Workload and Performance</h3>
                        <p className="text-gray-700 mb-4">
                          Monitor team performance and workload:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>View team workload from the Dashboard</li>
                          <li>Check individual performance metrics</li>
                          <li>Balance work across team members</li>
                          <li>Track velocity over time with sprint reports</li>
                          <li>Identify bottlenecks or areas for improvement</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Need more specific help?</p>
            <div className="flex justify-center gap-4">
              <Link to="/faqs" className="text-blue-600 hover:underline">View FAQs</Link>
              <Link to="/api-docs" className="text-blue-600 hover:underline">API Documentation</Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <AppFooter />
    </div>
  );
};

export default UserGuides;
