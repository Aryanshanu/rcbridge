import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserRole } from "@/utils/admin/userUtils";
import { UserRole } from "@/types/user";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { AdminChatbot } from "@/components/admin/AdminChatbot";
import { AdminProperties } from "@/components/admin/AdminProperties";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MessageSquare, Home as HomeIcon, Users, Shield } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      const role = await getUserRole();
      if (!role || (role !== "admin" && role !== "developer" && role !== "maintainer")) {
        navigate("/");
        return;
      }

      setUserRole(role);
      setIsLoading(false);
    };

    checkAuth();
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Admin Dashboard - RC Bridge" 
        description="Administrative dashboard for RC Bridge real estate platform"
      />
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8 mt-20">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {user?.user_metadata?.full_name || user?.email} 
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                <Shield className="w-3 h-3 mr-1" />
                {userRole}
              </span>
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                <HomeIcon className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat Conversations
              </TabsTrigger>
              <TabsTrigger value="properties">
                <HomeIcon className="w-4 h-4 mr-2" />
                Properties
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Conversations
                    </CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">100% Observability</div>
                    <p className="text-xs text-muted-foreground">
                      All chat conversations saved
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Properties Listed
                    </CardTitle>
                    <HomeIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Full Access</div>
                    <p className="text-xs text-muted-foreground">
                      Manage all properties
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      User Management
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Admin Control</div>
                    <p className="text-xs text-muted-foreground">
                      Create roles & manage access
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Security
                    </CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Protected</div>
                    <p className="text-xs text-muted-foreground">
                      Role-based access control
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    • View all chat conversations in the "Chat Conversations" tab
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • Manage properties and listings
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • Monitor user activity and assistance requests
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • Export conversation transcripts for analysis
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat">
              <Card>
                <CardHeader>
                  <CardTitle>Chat Conversations</CardTitle>
                  <CardDescription>
                    View and manage all chatbot conversations with users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminChatbot userRole={userRole} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties">
              <Card>
                <CardHeader>
                  <CardTitle>Property Management</CardTitle>
                  <CardDescription>
                    Manage all property listings on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminProperties userRole={userRole} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage users, roles, and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">User management interface coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <Footer />
      </div>
    </>
  );
}
