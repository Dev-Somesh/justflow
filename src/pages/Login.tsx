
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Logo from '@/components/ui/Logo';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import AppFooter from '@/components/layouts/AppFooter';
import { Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login delay
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        // Store authentication status
        sessionStorage.setItem('loginSuccess', 'true');
        sessionStorage.setItem('username', username);
        
        toast({
          title: "Login successful",
          description: "Welcome to JustFlow!",
        });
        navigate('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid username or password. Try using 'admin' as both username and password for demo.",
        });
      }
      setLoading(false);
    }, 1000);
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

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
            <Link to="/api-docs" className="text-gray-600 hover:text-blue-600 transition-colors">API</Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-grow flex justify-center items-center p-4 bg-[url('/pattern-bg.svg')] bg-cover bg-center">
        <Card className="w-full max-w-md shadow-lg border-0 backdrop-blur-sm bg-white/90">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Enter your username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button 
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Demo: Use "admin" and "admin"
                </div>
                <Link to="/guides" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center w-full">
              <span className="text-sm text-muted-foreground">Don't have an account? </span>
              <Link to="/guides" className="text-sm text-blue-600 hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Footer */}
      <AppFooter />
    </div>
  );
};

export default Login;
