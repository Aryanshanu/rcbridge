
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TabsContainer } from "@/components/TabsContainer";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";
import { AdminProperties } from "@/components/admin/AdminProperties";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminScraper } from "@/components/admin/AdminScraper";
import { AdminChatbot } from "@/components/admin/AdminChatbot";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import { Shield, AlertCircle, Loader } from "lucide-react";
import { getUserRole } from "@/utils/admin";

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Check auth status and role only once when component mounts or user changes
    const checkAccess = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        
        if (!user) {
          console.log("No user found, redirecting to login");
          toast({
            title: "Authentication Required",
            description: "Please sign in to access the admin panel.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }
        
        // Get user role from profiles table
        const role = await getUserRole();
        
        if (!role) {
          console.log("No role found, redirecting to login");
          toast({
            title: "Access Error",
            description: "Could not verify your access level. Please sign in again.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }
        
        // Set user role in state
        setUserRole(role);
        
        // Check if user has admin permissions
        if (role !== "admin" && role !== "developer" && role !== "maintainer") {
          console.log("Insufficient permissions, redirecting to home");
          toast({
            title: "Access Denied",
            description: "You do not have permission to access the admin panel.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        setIsError(true);
        toast({
          title: "Error",
          description: "Could not verify admin access. Please try again.",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAccess();
  }, [user, navigate, toast]);

  // Show a clean loading state while checking access
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-sm">
          <Loader className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-primary font-medium text-lg">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-sm">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-500 font-medium text-lg">Error verifying access</p>
          <button 
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Only define tabs if we have a user role
  const tabs = userRole ? [
    {
      id: "properties",
      label: "Properties",
      content: <AdminProperties userRole={userRole} />,
      disabled: false,
    },
    {
      id: "users",
      label: "Users",
      content: <AdminUsers userRole={userRole} />,
      disabled: userRole !== "admin",
    },
    {
      id: "scraper",
      label: "Data Scraper",
      content: <AdminScraper userRole={userRole} />,
      disabled: userRole === "maintainer",
    },
    {
      id: "chatbot",
      label: "Chatbot",
      content: <AdminChatbot userRole={userRole} />,
      disabled: false,
    },
  ] : [];

  // Render full admin UI only if we have a role
  if (!userRole) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Admin Panel | RC Bridge" description="Admin panel for managing RC Bridge properties and users" />
      <Navbar />
      
      <main className="container py-8 px-4 mx-auto max-w-7xl">
        <div className="flex items-center mb-8 space-x-3">
          <Shield size={32} className="text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600">
              {userRole && `Logged in as ${userRole}`}
            </p>
          </div>
        </div>
        
        {userRole === "maintainer" && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="text-amber-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Limited access</h3>
              <p className="text-amber-700 text-sm">As a Maintainer, you have limited access to the admin panel. You can manage properties and respond to chat messages.</p>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <TabsContainer tabs={tabs} defaultTab="properties" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
