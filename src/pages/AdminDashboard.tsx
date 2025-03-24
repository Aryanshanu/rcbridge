
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Users, Settings, LayoutDashboard, FileText, LogOut } from "lucide-react";
import { UserManagement } from "@/components/admin/UserManagement";
import { AdminChatbot } from "@/components/admin/AdminChatbot";
import { getUserRole } from "@/utils/admin";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [userRole, setUserRole] = useState<"admin" | "developer" | "maintainer" | null>(null);
  const [userCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      setLoading(true);
      try {
        const role = await getUserRole();
        setUserRole(role);
        
        // If not admin or developer, redirect to home
        if (role !== "admin" && role !== "developer") {
          toast.error("You don't have permission to access the admin dashboard");
          navigate("/");
        }
        
        // Get user count
        if (role === "admin" || role === "developer") {
          const { count, error } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true });
            
          if (!error && count !== null) {
            setUserCount(count);
          }
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    
    checkUserRole();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Only render if user is admin or developer
  if (userRole !== "admin" && userRole !== "developer") {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-50 p-4 hidden md:block">
        <div className="flex items-center space-x-2 mb-8">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">RC</span>
          </div>
          <div>
            <h3 className="font-bold">RC Bridge</h3>
            <p className="text-xs text-gray-500">Admin Dashboard</p>
          </div>
        </div>
        
        <nav className="space-y-1">
          <Button 
            variant={activeTab === "overview" ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button 
            variant={activeTab === "users" ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("users")}
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </Button>
          <Button 
            variant={activeTab === "content" ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("content")}
            disabled={userRole !== "admin"}
          >
            <FileText className="h-4 w-4 mr-2" />
            Content
          </Button>
          <Button 
            variant={activeTab === "settings" ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("settings")}
            disabled={userRole !== "admin"}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          
          <Separator className="my-4" />
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
              {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-sm truncate">
                {user?.user_metadata?.full_name || user?.email || "User"}
              </p>
              <p className="text-xs text-primary truncate capitalize">
                {userRole} Role
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">Manage your site settings and content</p>
          </div>
          
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userCount}</div>
                    <p className="text-xs text-gray-500 mt-1">Across all roles</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Properties Listed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">32</div>
                    <p className="text-xs text-gray-500 mt-1">Active listings</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Pending Inquiries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">7</div>
                    <p className="text-xs text-gray-500 mt-1">Awaiting response</p>
                  </CardContent>
                </Card>
              </div>
              
              <Tabs defaultValue="activity">
                <TabsList>
                  <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                  <TabsTrigger value="stats">System Status</TabsTrigger>
                </TabsList>
                <TabsContent value="activity" className="p-4 bg-white border rounded-md mt-2">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start pb-2 border-b">
                      <div>
                        <p className="font-medium">New User Registration</p>
                        <p className="text-sm text-gray-500">Anil Kumar joined as developer</p>
                      </div>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex justify-between items-start pb-2 border-b">
                      <div>
                        <p className="font-medium">Property Listed</p>
                        <p className="text-sm text-gray-500">New residential property in Jubilee Hills</p>
                      </div>
                      <span className="text-xs text-gray-500">6 hours ago</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">System Update</p>
                        <p className="text-sm text-gray-500">Chatbot AI model upgraded to version 2.0</p>
                      </div>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="stats" className="p-4 bg-white border rounded-md mt-2">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <p>Database</p>
                      </div>
                      <span className="text-sm text-green-500">Operational</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <p>Authentication</p>
                      </div>
                      <span className="text-sm text-green-500">Operational</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <p>Storage</p>
                      </div>
                      <span className="text-sm text-green-500">Operational</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <p>Edge Functions</p>
                      </div>
                      <span className="text-sm text-green-500">Operational</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <AdminChatbot userRole={userRole} />
            </div>
          )}
          
          {activeTab === "users" && (
            <UserManagement />
          )}
          
          {activeTab === "content" && (
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Content Management</h2>
              <p className="text-gray-500">This feature is available only for admin users and is currently under development.</p>
            </div>
          )}
          
          {activeTab === "settings" && (
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">System Settings</h2>
              <p className="text-gray-500">This feature is available only for admin users and is currently under development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
