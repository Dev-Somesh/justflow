
import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Logo from '@/components/ui/Logo';
import AppFooter from '@/components/layouts/AppFooter';
import { Code, Key, Lock, Send } from 'lucide-react';

const APIDocumentation = () => {
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
            <Link to="/guides" className="text-gray-600 hover:text-blue-600 transition-colors">Guides</Link>
            <Link to="/api-docs" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">API</Link>
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Login</Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow container mx-auto py-12 px-4 bg-[url('/pattern-bg.svg')] bg-cover bg-center">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md backdrop-blur-sm bg-white/90">
          <h1 className="text-3xl font-bold mb-8 text-center">API Documentation</h1>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">JustFlow API Overview</h2>
                    <p className="text-gray-700 mb-4">
                      The JustFlow API allows you to programmatically access and manipulate your projects, tasks, sprints, and team data. You can use the API to integrate JustFlow with your custom tools or automate workflows.
                    </p>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="font-medium mb-2">Base URL</h3>
                      <code className="bg-gray-800 text-white p-2 rounded block overflow-x-auto">
                        https://api.justflow.dev/v1
                      </code>
                    </div>
                    
                    <h3 className="font-medium mb-2">Response Format</h3>
                    <p className="text-gray-700 mb-4">
                      All API responses are returned in JSON format. Successful responses will have a 2xx status code. Errors will have a 4xx or 5xx status code and include an error message.
                    </p>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="font-medium mb-2">Example Success Response</h3>
                      <pre className="bg-gray-800 text-white p-2 rounded block overflow-x-auto whitespace-pre"><code>{`{
  "status": "success",
  "data": {
    "id": "project-123",
    "name": "Website Redesign",
    "description": "Redesign the company website"
  }
}`}</code></pre>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="font-medium mb-2">Example Error Response</h3>
                      <pre className="bg-gray-800 text-white p-2 rounded block overflow-x-auto whitespace-pre"><code>{`{
  "status": "error",
  "message": "Project not found",
  "code": "NOT_FOUND",
  "statusCode": 404
}`}</code></pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="authentication">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                      <Key className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">API Keys</h3>
                        <p className="text-gray-700 mb-4">
                          All API requests require authentication using API keys. To obtain an API key:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 ml-4">
                          <li>Log in to your JustFlow account</li>
                          <li>Navigate to Settings &gt; API Keys</li>
                          <li>Click "Generate New API Key"</li>
                          <li>Name your key based on its intended use</li>
                          <li>Copy your API key (it will only be shown once)</li>
                        </ol>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <Lock className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Authentication Methods</h3>
                        <p className="text-gray-700 mb-4">
                          There are two ways to authenticate your API requests:
                        </p>
                        
                        <h4 className="font-medium mt-4 mb-2">1. Authorization Header</h4>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <code className="bg-gray-800 text-white p-2 rounded block overflow-x-auto">
                            Authorization: Bearer YOUR_API_KEY
                          </code>
                        </div>
                        
                        <h4 className="font-medium mt-4 mb-2">2. Query Parameter</h4>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <code className="bg-gray-800 text-white p-2 rounded block overflow-x-auto">
                            https://api.justflow.dev/v1/projects?api_key=YOUR_API_KEY
                          </code>
                        </div>
                        
                        <p className="text-gray-700 mt-4">
                          For security reasons, we recommend using the Authorization header method.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <Code className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Rate Limiting</h3>
                        <p className="text-gray-700 mb-4">
                          API requests are subject to rate limiting to ensure service stability:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>Free tier: 60 requests per minute</li>
                          <li>Pro tier: 120 requests per minute</li>
                          <li>Enterprise tier: 600 requests per minute</li>
                        </ul>
                        <p className="text-gray-700 mt-4">
                          Rate limit information is included in the response headers:
                        </p>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-2">
                          <code className="block">
                            X-RateLimit-Limit: 60<br />
                            X-RateLimit-Remaining: 58<br />
                            X-RateLimit-Reset: 1633027200
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="endpoints">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
                    
                    {/* Projects */}
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-lg font-medium mb-4">Projects</h3>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">GET</span>
                            <code>/projects</code>
                          </div>
                          <p className="text-sm text-gray-600">List all projects</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">GET</span>
                            <code>/projects/{'{projectId}'}</code>
                          </div>
                          <p className="text-sm text-gray-600">Get a specific project</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">POST</span>
                            <code>/projects</code>
                          </div>
                          <p className="text-sm text-gray-600">Create a new project</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">PUT</span>
                            <code>/projects/{'{projectId}'}</code>
                          </div>
                          <p className="text-sm text-gray-600">Update a project</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">DELETE</span>
                            <code>/projects/{'{projectId}'}</code>
                          </div>
                          <p className="text-sm text-gray-600">Delete a project</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tasks */}
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-lg font-medium mb-4">Tasks</h3>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">GET</span>
                            <code>/projects/{'{projectId}'}/tasks</code>
                          </div>
                          <p className="text-sm text-gray-600">List all tasks in a project</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">GET</span>
                            <code>/tasks/{'{taskId}'}</code>
                          </div>
                          <p className="text-sm text-gray-600">Get a specific task</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">POST</span>
                            <code>/projects/{'{projectId}'}/tasks</code>
                          </div>
                          <p className="text-sm text-gray-600">Create a new task</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">PUT</span>
                            <code>/tasks/{'{taskId}'}</code>
                          </div>
                          <p className="text-sm text-gray-600">Update a task</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">DELETE</span>
                            <code>/tasks/{'{taskId}'}</code>
                          </div>
                          <p className="text-sm text-gray-600">Delete a task</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Sprints & Epics */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Sprints & Epics</h3>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">GET</span>
                            <code>/projects/{'{projectId}'}/sprints</code>
                          </div>
                          <p className="text-sm text-gray-600">List all sprints in a project</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">GET</span>
                            <code>/projects/{'{projectId}'}/epics</code>
                          </div>
                          <p className="text-sm text-gray-600">List all epics in a project</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">POST</span>
                            <code>/projects/{'{projectId}'}/sprints</code>
                          </div>
                          <p className="text-sm text-gray-600">Create a new sprint</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">POST</span>
                            <code>/projects/{'{projectId}'}/epics</code>
                          </div>
                          <p className="text-sm text-gray-600">Create a new epic</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="examples">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                      <Send className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Example API Requests</h3>
                        <p className="text-gray-700 mb-4">
                          Here are some example API requests using various programming languages:
                        </p>
                        
                        <h4 className="font-medium mt-4 mb-2">Create a Task (cURL)</h4>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <pre className="bg-gray-800 text-white p-2 rounded block overflow-x-auto whitespace-pre"><code>{`curl -X POST https://api.justflow.dev/v1/projects/project-123/tasks \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Implement login page",
    "description": "Create the login page with username/password fields",
    "status": "todo",
    "priority": "high",
    "assigneeId": "user-456"
  }'`}</code></pre>
                        </div>
                        
                        <h4 className="font-medium mt-4 mb-2">List Tasks (JavaScript)</h4>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <pre className="bg-gray-800 text-white p-2 rounded block overflow-x-auto whitespace-pre"><code>{`fetch('https://api.justflow.dev/v1/projects/project-123/tasks', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  // Handle response data
  return data;
})
.catch(error => console.error('Error:', error));`}</code></pre>
                        </div>
                        
                        <h4 className="font-medium mt-4 mb-2">Update Task Status (Python)</h4>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <pre className="bg-gray-800 text-white p-2 rounded block overflow-x-auto whitespace-pre"><code>{`import requests

api_key = "YOUR_API_KEY"
task_id = "task-789"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

data = {
    "status": "in-progress"
}

response = requests.put(
    f"https://api.justflow.dev/v1/tasks/{task_id}",
    headers=headers,
    json=data
)

print(response.json())`}</code></pre>
                        </div>
                        
                        <div className="mt-6">
                          <p className="text-gray-700">
                            For more examples and detailed information, please refer to our full API reference documentation available in your JustFlow account after logging in.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Ready to integrate with JustFlow?</p>
            <div className="flex justify-center gap-4">
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Sign in to get your API key
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <AppFooter />
    </div>
  );
};

export default APIDocumentation;
