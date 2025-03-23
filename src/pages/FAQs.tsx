
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Logo from '@/components/ui/Logo';
import AppFooter from '@/components/layouts/AppFooter';

const FAQs = () => {
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
            <Link to="/faqs" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">FAQs</Link>
            <Link to="/guides" className="text-gray-600 hover:text-blue-600 transition-colors">Guides</Link>
            <Link to="/api-docs" className="text-gray-600 hover:text-blue-600 transition-colors">API</Link>
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Login</Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow container mx-auto py-12 px-4 bg-[url('/pattern-bg.svg')] bg-cover bg-center">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md backdrop-blur-sm bg-white/90">
          <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                What is JustFlow?
              </AccordionTrigger>
              <AccordionContent>
                JustFlow is a comprehensive project management tool designed to help teams track tasks, manage sprints, and deliver projects efficiently. It offers features like Kanban boards, sprint planning, team management, and reporting dashboards.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                How do I create a new project?
              </AccordionTrigger>
              <AccordionContent>
                To create a new project, navigate to the Dashboard and click on the "New Project" button. Fill in the project details like name, description, and team members, then click "Create". Your new project will then appear in your project list.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                How does sprint planning work in JustFlow?
              </AccordionTrigger>
              <AccordionContent>
                Sprint planning in JustFlow involves creating a new sprint with start and end dates, setting a sprint goal, and adding tasks. You can access sprint planning from the Epics page or Board page. From there, you can drag tasks into the sprint, assign story points, and track progress throughout the sprint duration.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                Can I integrate JustFlow with other tools?
              </AccordionTrigger>
              <AccordionContent>
                Yes, JustFlow offers various integrations with popular tools like Slack, GitHub, GitLab, and more. These integrations allow you to connect your workflow across different platforms. You can set up integrations from the Settings page after logging in.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                How do I add team members to my project?
              </AccordionTrigger>
              <AccordionContent>
                To add team members, navigate to the Team page from your project dashboard. Click on "Add Member", enter their email address, and assign a role (Admin, Manager, or Member). They will receive an invitation to join the project. Admins can assign multiple roles to team members if needed.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left">
                What's the difference between Epics and Tasks?
              </AccordionTrigger>
              <AccordionContent>
                Epics are large bodies of work that can be broken down into smaller tasks. Think of epics as features or significant components of your project that might take multiple sprints to complete. Tasks are smaller, more manageable units of work that can typically be completed in a single sprint or less.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger className="text-left">
                How do reports and analytics work?
              </AccordionTrigger>
              <AccordionContent>
                JustFlow provides various reports including sprint burndown charts, velocity tracking, and team workload views. These analytics help you understand your team's performance, identify bottlenecks, and make data-driven decisions. You can access these reports from the Dashboard.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8">
              <AccordionTrigger className="text-left">
                Is there a mobile app for JustFlow?
              </AccordionTrigger>
              <AccordionContent>
                Yes, JustFlow offers mobile apps for both iOS and Android, allowing you to manage your projects on the go. The mobile apps include most features from the web version, with an interface optimized for smaller screens.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Can't find the answer you're looking for?</p>
            <div className="flex justify-center gap-4">
              <Link to="/guides" className="text-blue-600 hover:underline">View User Guides</Link>
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

export default FAQs;
