
import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/Logo';
import { useNavigate } from 'react-router-dom';

const AppFooter = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Logo size="sm" />
              <div className="font-semibold text-xl text-blue-600 font-mono ml-2">JustFlow</div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              A modern project management tool designed to help teams track tasks, manage sprints, and deliver projects efficiently.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="mailto:ITdeveloper06@gmail.com" target="_blank" rel="noopener noreferrer">
                  <Mail size={20} />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com/Dev-Somesh" target="_blank" rel="noopener noreferrer">
                  <Github size={20} />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://www.linkedin.com/in/ersomeshbhardwaj/" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={20} />
                </a>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/')} className="text-gray-600 hover:text-blue-600 transition-colors">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/board')} className="text-gray-600 hover:text-blue-600 transition-colors">
                  Board
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/calendar')} className="text-gray-600 hover:text-blue-600 transition-colors">
                  Calendar
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/team')} className="text-gray-600 hover:text-blue-600 transition-colors">
                  Team
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/settings')} className="text-gray-600 hover:text-blue-600 transition-colors">
                  Settings
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/help')} className="text-gray-600 hover:text-blue-600 transition-colors">
                  Help Center
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/help?tab=guides')} className="text-gray-600 hover:text-blue-600 transition-colors">
                  User Guides
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/help?tab=faqs')} className="text-gray-600 hover:text-blue-600 transition-colors">
                  FAQs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/help?tab=api')} className="text-gray-600 hover:text-blue-600 transition-colors">
                  API Documentation
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {currentYear} JustFlow. Developed by <a href="https://www.linkedin.com/in/ersomeshbhardwaj/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Er. Somesh Bhardwaj</a>
          </p>
          <p className="text-gray-500 text-xs mt-2">
            <a href="mailto:ITdeveloper06@gmail.com" className="hover:underline">ITdeveloper06@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
