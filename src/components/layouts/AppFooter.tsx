
import React from 'react';
import { GitHub, Linkedin, Mail } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const AppFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Logo size="sm" />
            <span className="ml-2 text-blue-600 font-mono font-semibold">JustFlow</span>
          </div>
          
          <div className="text-center md:text-right text-sm text-gray-600">
            <p className="font-medium">Developed by Er. Somesh Bhardwaj</p>
            
            <div className="flex items-center justify-center md:justify-end mt-2 space-x-4">
              <a 
                href="mailto:ITdeveloper06@gmail.com" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a 
                href="https://github.com/Dev-Somesh" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHub className="h-4 w-4" />
              </a>
              <a 
                href="https://www.linkedin.com/in/ersomeshbhardwaj/" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
