
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UserPlus, Users, Settings, Shield, User } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import UserAvatar from '@/components/ui/UserAvatar';
import { useToast } from '@/components/ui/use-toast';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { users } = useProject();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'Developer',
    isActive: true,
  });

  const editingUser = editUserId ? users.find(user => user.id === editUserId) : null;

  const handleSaveUser = () => {
    // In a real application, this would save to the backend
    toast({
      title: editUserId ? "User updated" : "User created",
      description: `Successfully ${editUserId ? 'updated' : 'created'} user ${newUserData.name}`,
    });
    
    setEditUserId(null);
    setNewUserData({
      name: '',
      email: '',
      role: 'Developer',
      isActive: true,
    });
  };

  const handleDeleteUser = (userId: string) => {
    // In a real application, this would delete from the backend
    toast({
      title: "User deleted",
      description: "User has been successfully deleted",
      variant: "destructive",
    });
  };

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditUserId(userId);
      setNewUserData({
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: true, // Assuming all users are active for this demo
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-plane-purple" />
            Admin Panel
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Roles</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Manage Users</h3>
                <Button 
                  onClick={() => {
                    setEditUserId(null);
                    setNewUserData({
                      name: '',
                      email: '',
                      role: 'Developer',
                      isActive: true,
                    });
                  }}
                  className="gap-1"
                >
                  <UserPlus className="h-4 w-4" />
                  Add User
                </Button>
              </div>
              
              {editUserId !== null || newUserData.name ? (
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-4">
                    {editUserId ? 'Edit User' : 'New User'}
                  </h4>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newUserData.name}
                        onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUserData.email}
                        onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Select 
                        value={newUserData.role}
                        onValueChange={(value) => setNewUserData({...newUserData, role: value})}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Product Manager">Product Manager</SelectItem>
                          <SelectItem value="Developer">Developer</SelectItem>
                          <SelectItem value="UI Designer">UI Designer</SelectItem>
                          <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="active" 
                        checked={newUserData.isActive}
                        onCheckedChange={(checked) => setNewUserData({...newUserData, isActive: checked})}
                      />
                      <Label htmlFor="active">Active account</Label>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setEditUserId(null);
                          setNewUserData({
                            name: '',
                            email: '',
                            role: 'Developer',
                            isActive: true,
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveUser}>
                        {editUserId ? 'Update User' : 'Create User'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <UserAvatar src={user.avatar} name={user.name} size="sm" />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{user.role}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toast({
                                title: "User deactivated",
                                description: `${user.name} has been deactivated`,
                              })}
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              <span>Deactivate</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="roles">
            <div>
              <h3 className="text-lg font-medium mb-4">Manage Roles</h3>
              <div className="space-y-2">
                <div className="p-3 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Administrator</p>
                      <p className="text-sm text-gray-500">Full access to all features</p>
                    </div>
                    <Badge>System Role</Badge>
                  </div>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Product Manager</p>
                      <p className="text-sm text-gray-500">Can manage projects and assign tasks</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {
                      toast({
                        title: "Feature in development",
                        description: "Role editing will be available soon",
                      });
                    }}>
                      Edit Permissions
                    </Button>
                  </div>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Developer</p>
                      <p className="text-sm text-gray-500">Can view and update assigned tasks</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {
                      toast({
                        title: "Feature in development",
                        description: "Role editing will be available soon",
                      });
                    }}>
                      Edit Permissions
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div>
              <h3 className="text-lg font-medium mb-4">System Settings</h3>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="system-name">System Name</Label>
                  <Input id="system-name" defaultValue="Quantum PMS" />
                </div>
                
                <div className="grid gap-2">
                  <Label>Default User Role</Label>
                  <Select defaultValue="Developer">
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Product Manager">Product Manager</SelectItem>
                      <SelectItem value="Developer">Developer</SelectItem>
                      <SelectItem value="UI Designer">UI Designer</SelectItem>
                      <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>System Preferences</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="email-notifications" />
                      <Label htmlFor="email-notifications">Enable email notifications</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="two-factor" />
                      <Label htmlFor="two-factor">Require two-factor authentication</Label>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    toast({
                      title: "Settings saved",
                      description: "Your system settings have been updated",
                    });
                  }}
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Trash, Pencil, MoreHorizontal, Ban } from 'lucide-react';

export default AdminPanel;
