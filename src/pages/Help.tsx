
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Book, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const Help = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('faqs');
  const location = useLocation();
  const navigate = useNavigate();
  
  // Process URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has('tab')) {
      const tab = params.get('tab');
      if (['faqs', 'guides', 'api'].includes(tab!)) {
        setActiveTab(tab!);
      }
    }
    
    if (params.has('search')) {
      setSearchQuery(params.get('search') || '');
    }
  }, [location.search]);
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const params = new URLSearchParams(location.search);
    params.set('tab', value);
    navigate(`/help?${params.toString()}`);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams(location.search);
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    
    navigate(`/help?${params.toString()}`);
  };
  
  const handleSupportRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Support request sent",
      description: "We'll get back to you as soon as possible.",
    });
  };
  
  const faqs = [
    {
      question: "How do I create a new task?",
      answer: "Click the 'Add Task' button in the Board view, or click the plus icon on any column to add a task directly to that column."
    },
    {
      question: "How do I track time for a task?",
      answer: "Open any task and use the time tracking feature in the task details. You can start/stop the timer or add time manually."
    },
    {
      question: "How do I assign tasks to team members?",
      answer: "Open a task and select a team member from the assignee dropdown. You can also drag and drop tasks between team members on the Team view."
    },
    {
      question: "What are Story Points?",
      answer: "Story Points are a way to estimate the effort required to complete a task. The higher the number, the more complex the task is considered to be."
    },
    {
      question: "How do Sprints work?",
      answer: "Sprints are time-boxed periods (usually 1-4 weeks) where teams commit to completing a set of tasks. You can create a new sprint, add tasks to it, and track progress."
    },
    {
      question: "How do I create a new project?",
      answer: "From the dashboard, click on the 'New Project' button and fill in the project details form."
    },
    {
      question: "Can I export my data?",
      answer: "Yes, you can export project data as CSV or JSON from the Project Settings page."
    },
    {
      question: "How do I use filters on the Board?",
      answer: "Use the filter controls above the board to filter tasks by assignee, priority, labels, or search by title/description."
    }
  ];
  
  const filteredFaqs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;
    
  return (
    <AppLayout>
      <div className="container mx-auto py-6 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2">Help & Documentation</h1>
        <p className="text-gray-500 mb-6">Get help with using JustFlow and learn about all features</p>
        
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2 max-w-md">
            <Input
              placeholder="Search documentation..."
              className="flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit">Search</Button>
          </div>
        </form>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-10">
          <TabsList className="mb-4">
            <TabsTrigger value="faqs" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>FAQs</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>User Guides</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>API Documentation</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="faqs">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to the most common questions about JustFlow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                  {filteredFaqs.length === 0 && (
                    <p className="text-gray-500 py-4">No results found for "{searchQuery}"</p>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Getting Started Guide</CardTitle>
                  <CardDescription>Learn the basics of JustFlow</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>Setting up your first project</li>
                    <li>Creating and managing tasks</li>
                    <li>Organizing your team</li>
                    <li>Understanding the dashboard</li>
                  </ul>
                  <Button variant="link" className="px-0 mt-2">Read Guide →</Button>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Advanced Features</CardTitle>
                  <CardDescription>Take your project management to the next level</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>Working with Epics and Roadmaps</li>
                    <li>Sprint planning and tracking</li>
                    <li>Custom workflows and automation</li>
                    <li>Reporting and analytics</li>
                  </ul>
                  <Button variant="link" className="px-0 mt-2">Read Guide →</Button>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Time Tracking</CardTitle>
                  <CardDescription>Track time spent on tasks and projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>Using the built-in timer</li>
                    <li>Manual time entries</li>
                    <li>Time reports and analytics</li>
                    <li>Budgeting and estimates</li>
                  </ul>
                  <Button variant="link" className="px-0 mt-2">Read Guide →</Button>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Team Collaboration</CardTitle>
                  <CardDescription>Work better together with your team</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>Task assignment and tracking</li>
                    <li>Comment and discussion features</li>
                    <li>File attachments and sharing</li>
                    <li>Team workload management</li>
                  </ul>
                  <Button variant="link" className="px-0 mt-2">Read Guide →</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>
                  Integrate JustFlow with your own tools and systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Authentication</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    JustFlow uses API keys for authentication. Generate your API key in the account settings.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-md text-sm font-mono mb-4">
                    <p>Authorization: Bearer YOUR_API_KEY</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Endpoints</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">GET /api/projects</h4>
                      <p className="text-sm text-gray-600">Get all projects the authenticated user has access to.</p>
                    </div>
                    <div>
                      <h4 className="font-medium">GET /api/projects/:id</h4>
                      <p className="text-sm text-gray-600">Get details for a specific project.</p>
                    </div>
                    <div>
                      <h4 className="font-medium">GET /api/projects/:id/tasks</h4>
                      <p className="text-sm text-gray-600">Get all tasks for a specific project.</p>
                    </div>
                    <div>
                      <h4 className="font-medium">POST /api/tasks</h4>
                      <p className="text-sm text-gray-600">Create a new task.</p>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4">View Full API Documentation</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Can't find what you're looking for? Reach out to our support team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSupportRequest} className="space-y-4 max-w-md">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                <Input id="subject" placeholder="What do you need help with?" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Describe your issue or question in detail..."
                ></textarea>
              </div>
              <Button type="submit">Submit Request</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Help;
