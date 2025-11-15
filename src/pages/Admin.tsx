import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminChatbot } from "@/components/admin/AdminChatbot";
import { AdminProperties } from "@/components/admin/AdminProperties";
import { PropertyImport } from "@/components/admin/PropertyImport";
import { ContactMessagesTab } from "@/components/admin/ContactMessagesTab";
import { AssistanceRequestsTab } from "@/components/admin/AssistanceRequestsTab";
import { AnalyticsTab } from "@/components/admin/AnalyticsTab";
import { CustomerActivityTab } from "@/components/admin/CustomerActivityTab";
import { AlertsTab } from "@/components/admin/AlertsTab";
import { PropertyViewsTab } from "@/components/admin/PropertyViewsTab";
import { SearchQueriesTab } from "@/components/admin/SearchQueriesTab";
import { InvestmentCalculationsTab } from "@/components/admin/InvestmentCalculationsTab";
import { LoginHistoryTab } from "@/components/admin/LoginHistoryTab";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminUser } from "@/utils/admin/userUtils";
import { useToast } from "@/hooks/use-toast";
import { AdminLiveFeed } from "@/components/admin/AdminLiveFeed";
import { supabase } from "@/integrations/supabase/client";
import { AnalyticsWidget } from "@/components/admin/AnalyticsWidget";

export default function Admin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    
    const checkAdminAccess = async () => {
      // Wait for auth to settle
      if (authLoading) return;
      
      // If no user after auth settled, redirect to login
      if (!user) {
        if (!cancelled) {
          toast({
            title: "Authentication Required",
            description: "Please log in to access the admin dashboard",
            variant: "destructive",
          });
          navigate('/login');
        }
        return;
      }

      // Retry admin check up to 3 times with backoff
      for (let attempt = 0; attempt < 3 && !cancelled; attempt++) {
        try {
          const adminStatus = await isAdminUser();
          
          if (cancelled) return;
          
          if (adminStatus) {
            setIsAdmin(true);
            setIsLoading(false);
            return;
          }
          
          // Only wait if we're going to retry
          if (attempt < 2) {
            await new Promise(resolve => setTimeout(resolve, 300 * (attempt + 1)));
          }
        } catch (error) {
          console.error(`Admin check attempt ${attempt + 1} failed:`, error);
          if (attempt < 2 && !cancelled) {
            await new Promise(resolve => setTimeout(resolve, 300 * (attempt + 1)));
          }
        }
      }
      
      // After all retries failed, redirect
      if (!cancelled) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin dashboard",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    checkAdminAccess();
    
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, navigate, toast]);

  // Log admin access to admin_login_history table
  useEffect(() => {
    if (!isAdmin || !user) return;

    const logAdminAccess = async () => {
      try {
        const { error } = await supabase.from('admin_login_history').insert({
          user_id: user.id,
          user_email: user.email,
          action: 'login',
          login_method: 'email',
          ip_address: null,
          user_agent: navigator.userAgent
        });

        if (error) {
          console.error('❌ Failed to log admin access:', error);
        } else {
          console.log('✅ Admin access logged to admin_login_history');
        }
      } catch (error) {
        console.error('❌ Error logging admin access:', error);
      }
    };

    logAdminAccess();
  }, [isAdmin, user]);

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
      {/* Mount AdminLiveFeed for real-time notifications */}
      <AdminLiveFeed />
      
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
            <TabsList className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-2">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="views">Views</TabsTrigger>
              <TabsTrigger value="searches">Searches</TabsTrigger>
              <TabsTrigger value="calculations">ROI Calcs</TabsTrigger>
              <TabsTrigger value="logins">Logins</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="contact">Contacts</TabsTrigger>
              <TabsTrigger value="assistance">Assistance</TabsTrigger>
              <TabsTrigger value="import">Import</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <div className="space-y-6">
                <AnalyticsWidget />
                <AnalyticsTab />
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <CustomerActivityTab />
            </TabsContent>

            <TabsContent value="chat">
              <AdminChatbot userRole="admin" />
            </TabsContent>

            <TabsContent value="import">
              <PropertyImport />
            </TabsContent>

            <TabsContent value="properties">
              <AdminProperties userRole="admin" />
            </TabsContent>

            <TabsContent value="views">
              <PropertyViewsTab />
            </TabsContent>

            <TabsContent value="searches">
              <SearchQueriesTab />
            </TabsContent>

            <TabsContent value="calculations">
              <InvestmentCalculationsTab />
            </TabsContent>

            <TabsContent value="logins">
              <LoginHistoryTab />
            </TabsContent>

            <TabsContent value="alerts">
              <AlertsTab />
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
