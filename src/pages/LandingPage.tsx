
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import AppFooter from '@/components/layouts/AppFooter';
import {
  CheckCircle2,
  Clock,
  Layout,
  Kanban,
  Users,
  BarChart4,
  CalendarIcon,
  CreditCard,
} from 'lucide-react';
import PaymentModal from '@/components/payment/PaymentModal';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isAnnualPlan, setIsAnnualPlan] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background pattern overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'url("/pattern-bg.svg")',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Logo size="md" />
            <span className="font-mono font-semibold text-xl text-blue-600 ml-2">JustFlow</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
            <Button onClick={() => navigate('/login')}>Sign In</Button>
          </div>
          <Button className="md:hidden" onClick={() => navigate('/login')}>Sign In</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 relative z-0">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0 pr-0 lg:pr-16">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Modern Project Management
                <span className="text-blue-600"> Simplified</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Track tasks, manage sprints, and deliver projects efficiently with JustFlow - the all-in-one solution for teams that want to get things done.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="lg" onClick={() => navigate('/login')}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                  Live Demo
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="/lovable-uploads/6af70d45-cd16-4c1e-8bb3-bbc3931587a1.png" 
                alt="JustFlow Dashboard" 
                className="rounded-lg shadow-xl border border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = "/justflow-dashboard.png";
                  if (e.currentTarget.src.includes("justflow-dashboard.png")) {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://placehold.co/800x450/e6f7ff/0099ff?text=JustFlow+Dashboard";
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage projects from start to finish
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Kanban className="w-8 h-8 text-blue-600" />}
              title="Kanban Board"
              description="Visualize your workflow and move tasks through stages with our intuitive Kanban board."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="w-8 h-8 text-blue-600" />}
              title="Task Management"
              description="Create, assign, and track tasks with ease. Add comments, attachments, and due dates."
            />
            <FeatureCard 
              icon={<Clock className="w-8 h-8 text-blue-600" />}
              title="Time Tracking"
              description="Keep track of time spent on tasks and generate comprehensive reports."
            />
            <FeatureCard 
              icon={<CalendarIcon className="w-8 h-8 text-blue-600" />}
              title="Sprint Planning"
              description="Plan and manage sprints with our intuitive calendar and planning tools."
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-blue-600" />}
              title="Team Collaboration"
              description="Work together seamlessly with real-time updates and notifications."
            />
            <FeatureCard 
              icon={<BarChart4 className="w-8 h-8 text-blue-600" />}
              title="Analytics & Reports"
              description="Gain insights into your team's performance with detailed analytics and reports."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Teams of all sizes use JustFlow to improve their productivity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="JustFlow has transformed how our team works. We've increased our velocity by 40% since we started using it."
              author="Sarah Johnson"
              title="Project Manager, TechCorp"
              color="blue"
            />
            <TestimonialCard 
              quote="The best project management tool we've used. Simple enough for everyone to understand, yet powerful enough for complex projects."
              author="Michael Chen"
              title="CTO, StartupX"
              color="purple"
            />
            <TestimonialCard 
              quote="We've been able to reduce our meeting time by 30% because JustFlow gives us clear visibility into what everyone is working on."
              author="Emily Rodriguez"
              title="Team Lead, DesignHub"
              color="green"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No hidden fees, no surprises. Choose the plan that's right for your team.
            </p>
            <div className="mt-8 inline-flex items-center p-1 bg-gray-100 rounded-full">
              <button
                className={`px-4 py-2 rounded-full transition-all ${!isAnnualPlan ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setIsAnnualPlan(false)}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-full transition-all ${isAnnualPlan ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setIsAnnualPlan(true)}
              >
                Annual (Save 25%)
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 justify-center">
            <PricingCard 
              title="Starter"
              price="Free"
              description="Perfect for individuals and small teams"
              features={[
                "Up to 5 team members",
                "Unlimited projects",
                "Basic task management",
                "Kanban board",
                "Community support"
              ]}
              buttonText="Get Started"
              buttonVariant="outline"
              onButtonClick={() => navigate('/login')}
            />
            <PricingCard 
              title="Professional"
              price={isAnnualPlan ? "$5.99" : "$7.99"}
              period={`per user/month${isAnnualPlan ? ', billed annually' : ''}`}
              description="Everything you need for a growing team"
              features={[
                "Unlimited team members",
                "Unlimited projects",
                "Advanced task management",
                "Sprint planning",
                "Time tracking",
                "Priority support"
              ]}
              buttonText="Start Free Trial"
              buttonVariant="default"
              isHighlighted={true}
              onButtonClick={() => setIsPaymentModalOpen(true)}
            />
            <PricingCard 
              title="Enterprise"
              price="Custom"
              description="Advanced features for large organizations"
              features={[
                "Everything in Professional",
                "Custom integrations",
                "Advanced security",
                "Dedicated support",
                "Custom reporting",
                "SLA guarantee"
              ]}
              buttonText="Contact Sales"
              buttonVariant="outline"
              onButtonClick={() => navigate('/login')}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using JustFlow to deliver projects on time and within budget.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => navigate('/login')}
          >
            Try JustFlow Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <AppFooter />

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)}
        plan={{
          name: "Professional",
          price: isAnnualPlan ? "$5.99" : "$7.99",
          billing: isAnnualPlan ? "annually" : "monthly"
        }}
      />
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ quote, author, title, color = "blue" }: { quote: string, author: string, title: string, color?: "blue" | "purple" | "green" }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 shadow-blue-100",
    purple: "bg-purple-50 border-purple-200 shadow-purple-100",
    green: "bg-green-50 border-green-200 shadow-green-100"
  };

  const iconColors = {
    blue: "text-blue-500",
    purple: "text-purple-500",
    green: "text-green-500"
  };

  return (
    <div className={`p-6 rounded-lg shadow-md border ${colorClasses[color]}`}>
      <div className={`mb-4 ${iconColors[color]}`}>
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5 3.871 3.871 0 01-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5 3.871 3.871 0 01-2.748-1.179z"/>
        </svg>
      </div>
      <p className="text-gray-600 mb-6">{quote}</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-gray-500 text-sm">{title}</p>
      </div>
    </div>
  );
};

// Pricing Card Component
const PricingCard = ({ 
  title, 
  price, 
  period, 
  description, 
  features, 
  buttonText, 
  buttonVariant = "default",
  isHighlighted = false,
  onButtonClick
}: { 
  title: string, 
  price: string, 
  period?: string, 
  description: string, 
  features: string[], 
  buttonText: string, 
  buttonVariant?: "default" | "outline", 
  isHighlighted?: boolean,
  onButtonClick?: () => void
}) => {
  return (
    <div className={`bg-white rounded-lg border ${isHighlighted ? 'border-blue-500 ring-4 ring-blue-50' : 'border-gray-200'} p-8 flex flex-col`}>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">{price}</span>
        {period && <span className="text-gray-500 ml-2">{period}</span>}
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="mb-8 space-y-3 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        variant={buttonVariant} 
        className={isHighlighted ? "w-full bg-blue-600 hover:bg-blue-700" : "w-full"}
        onClick={onButtonClick}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default LandingPage;
