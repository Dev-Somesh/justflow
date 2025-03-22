
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, FileText, MessageCircleQuestion, Mail } from 'lucide-react';
import AppLayout from '@/components/layouts/AppLayout';

const Help = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Book className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight">Help & Documentation</h1>
        </div>
        
        <p className="text-gray-600 text-lg">
          Welcome to the JustFlow help center. Find answers to common questions and learn how to use the platform.
        </p>
        
        <Tabs defaultValue="faqs" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="faqs">
              <MessageCircleQuestion className="h-4 w-4 mr-2" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="guides">
              <FileText className="h-4 w-4 mr-2" />
              User Guides
            </TabsTrigger>
            <TabsTrigger value="contact">
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="faqs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to the most common questions about JustFlow.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is JustFlow?</AccordionTrigger>
                    <AccordionContent>
                      JustFlow is a project management tool designed to help teams track tasks, manage workflows, and collaborate effectively. It offers kanban boards, sprint planning, team management, and reporting features.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I create a new task?</AccordionTrigger>
                    <AccordionContent>
                      You can create a new task by navigating to the Board view and clicking the "Add Task" button. Fill in the required information in the modal that appears, such as title, description, assignee, and priority, then click "Create".
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Can I customize the workflow stages?</AccordionTrigger>
                    <AccordionContent>
                      Yes, JustFlow allows you to customize workflow stages to match your team's process. Navigate to Settings, select "Workflow Settings", and you can add, remove, or rename stages according to your needs.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger>How do I assign a task to a team member?</AccordionTrigger>
                    <AccordionContent>
                      When creating or editing a task, you'll see an "Assignee" dropdown where you can select the team member responsible for the task. You can also reassign tasks by editing them from the board view.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger>How does the priority system work?</AccordionTrigger>
                    <AccordionContent>
                      JustFlow uses a simple priority system: Low, Medium, and High. Tasks with higher priority are visually highlighted on the board and can be filtered for quick access. Set priorities when creating tasks or update them later as needed.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-6">
                    <AccordionTrigger>How do I track time spent on tasks?</AccordionTrigger>
                    <AccordionContent>
                      JustFlow includes built-in time tracking. Open a task and use the time tracking panel to start/stop the timer as you work. The system automatically calculates total time spent, which is useful for reporting and estimation.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="guides" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Guides</CardTitle>
                <CardDescription>
                  Step-by-step guides to help you use JustFlow effectively.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <h3 className="font-medium text-lg">Getting Started with JustFlow</h3>
                    <p className="text-sm text-gray-500 mt-1">Learn the basics of JustFlow and how to set up your first project.</p>
                  </div>
                  
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <h3 className="font-medium text-lg">Creating and Managing Tasks</h3>
                    <p className="text-sm text-gray-500 mt-1">A comprehensive guide to task creation, editing, and organization.</p>
                  </div>
                  
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <h3 className="font-medium text-lg">Team Collaboration Features</h3>
                    <p className="text-sm text-gray-500 mt-1">How to use JustFlow's collaboration tools effectively with your team.</p>
                  </div>
                  
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <h3 className="font-medium text-lg">Reports and Analytics</h3>
                    <p className="text-sm text-gray-500 mt-1">Understanding JustFlow's reporting tools and how to extract insights.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Need more help? Get in touch with our support team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-gray-500">
                        Email us at <a href="mailto:ITdeveloper06@gmail.com" className="text-blue-600 hover:underline">ITdeveloper06@gmail.com</a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600">
                      Our support team typically responds within 24 hours during business days. For urgent issues, please include "URGENT" in your subject line.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Help;
