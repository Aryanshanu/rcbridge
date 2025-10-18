import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminChatbot } from "@/components/admin/AdminChatbot";
import { AdminProperties } from "@/components/admin/AdminProperties";
import { ContactMessagesTab } from "@/components/admin/ContactMessagesTab";
import { AssistanceRequestsTab } from "@/components/admin/AssistanceRequestsTab";
import { AnalyticsTab } from "@/components/admin/AnalyticsTab";
import { CustomerActivityTab } from "@/components/admin/CustomerActivityTab";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminUser } from "@/utils/admin/userUtils";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access the admin dashboard",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const hasAdminAccess = await isAdminUser();
      if (!hasAdminAccess) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin dashboard",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
      setIsLoading(false);
    };

    checkAdminAccess();
  }, [user, navigate, toast]);

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <SEO 
        title="Master Admin Dashboard - RC Bridge"
        description="Master admin control panel for managing RC Bridge platform"
        noindex
      />
      
      <Navbar />

      <main className="min-h-screen py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email}</p>
          </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="analytics" className="space-y-4">
            <TabsList>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="activity">Customer Activity</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="contact">Contacts</TabsTrigger>
              <TabsTrigger value="assistance">Assistance</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <AnalyticsTab />
            </TabsContent>

            <TabsContent value="activity">
              <CustomerActivityTab />
            </TabsContent>

            <TabsContent value="chat">
              <AdminChatbot userRole="admin" />
            </TabsContent>

            <TabsContent value="properties">
              <AdminProperties userRole="admin" />
            </TabsContent>

            <TabsContent value="contact">
              <ContactMessagesTab />
            </TabsContent>

            <TabsContent value="assistance">
              <AssistanceRequestsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </>
  );
}
