
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/ui/Logo';
import AppFooter from '@/components/layouts/AppFooter';
import { Github, Linkedin, Mail, Calendar, Users, Server, Database, Layout, Globe, Shield, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const About = () => {
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
            <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">About</Link>
            <Link to="/faqs" className="text-gray-600 hover:text-blue-600 transition-colors">FAQs</Link>
            <Link to="/guides" className="text-gray-600 hover:text-blue-600 transition-colors">Guides</Link>
            <Link to="/api-docs" className="text-gray-600 hover:text-blue-600 transition-colors">API</Link>
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Login</Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow bg-[url('/pattern-bg.svg')] bg-cover bg-center">
        {/* Hero section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About JustFlow</h1>
              <p className="text-xl text-gray-700 mb-8">
                Streamlining project management for teams of all sizes with a powerful, intuitive platform.
              </p>
              <div className="flex justify-center space-x-4">
                <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                  Get Started
                </Link>
                <Link to="/guides" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition-colors">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission section */}
        <section className="py-16 bg-white/90">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700">
                At JustFlow, we believe that managing projects should be intuitive, flexible, and efficient. Our mission is to provide teams with a project management tool that adapts to their workflow—not the other way around.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 inline-flex mb-4">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Simplify Workflow</h3>
                <p className="text-gray-600">
                  We eliminate unnecessary complexity so teams can focus on what matters most: delivering great work.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 inline-flex mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Empower Teams</h3>
                <p className="text-gray-600">
                  We build tools that help teams collaborate effectively, communicate clearly, and accomplish more together.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 inline-flex mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Foster Transparency</h3>
                <p className="text-gray-600">
                  We promote visibility across projects and teams, ensuring everyone stays aligned and informed.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-16 bg-blue-50/80">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <Layout className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Flexible Boards</h3>
                  </div>
                  <p className="text-gray-600">
                    Kanban-style boards that adapt to your workflow, making it easy to visualize progress and manage tasks.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Sprint Planning</h3>
                  </div>
                  <p className="text-gray-600">
                    Streamlined sprint planning and tracking with burndown charts and velocity metrics for agile teams.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-100 p-3 rounded-lg mr-4">
                      <Users className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Team Management</h3>
                  </div>
                  <p className="text-gray-600">
                    Assign roles, track workload, and optimize resource allocation to keep your team working efficiently.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-red-100 p-3 rounded-lg mr-4">
                      <Server className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-lg">API Integration</h3>
                  </div>
                  <p className="text-gray-600">
                    Robust API for integrating JustFlow with your existing tools and automating workflows.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg mr-4">
                      <Database className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Data Security</h3>
                  </div>
                  <p className="text-gray-600">
                    Enterprise-grade security to keep your project data safe and compliant with industry standards.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <Globe className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Global Access</h3>
                  </div>
                  <p className="text-gray-600">
                    Cloud-based platform accessible from anywhere, with mobile apps for on-the-go productivity.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Team section */}
        <section className="py-16 bg-white/90">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Meet the Developer</h2>
            
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
              <Avatar className="h-32 w-32 mx-auto mb-6">
                <AvatarImage src="https://media.licdn.com/dms/image/D4D03AQE12EfVLgVe0w/profile-displayphoto-shrink_800_800/0/1693232566694?e=1717632000&v=beta&t=DzDTCnSg2gW1ljnLxoLXBR6_aRMi27UKY8OqtQcPEOw" />
                <AvatarFallback>SB</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-1">Er. Somesh Bhardwaj</h3>
              <p className="text-blue-600 mb-4">Founder & Lead Developer</p>
              <p className="text-gray-600 mb-6">
                An experienced Full Stack Developer and Software Engineer passionate about creating intuitive, 
                efficient digital solutions for businesses and teams.
              </p>
              <div className="flex justify-center space-x-4">
                <a 
                  href="mailto:ITdeveloper06@gmail.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Mail className="h-5 w-5 text-gray-700" />
                </a>
                <a 
                  href="https://github.com/Dev-Somesh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Github className="h-5 w-5 text-gray-700" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/ersomeshbhardwaj/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Linkedin className="h-5 w-5 text-gray-700" />
                </a>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Have questions about JustFlow? Want to learn more about how it can help your team?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="mailto:ITdeveloper06@gmail.com"
                className="bg-white text-blue-600 px-6 py-3 rounded-md hover:bg-gray-100 transition-colors font-medium"
              >
                Contact Us
              </a>
              <Link 
                to="/login"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md hover:bg-white/10 transition-colors font-medium"
              >
                Try JustFlow
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <AppFooter />
    </div>
  );
};

export default About;
