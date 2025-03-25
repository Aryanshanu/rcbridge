
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
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import { Shield, AlertCircle, Loader, RefreshCw } from "lucide-react";
import { getUserRole } from "@/utils/admin/authUtils";
import { Button } from "@/components/ui/button";

const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    // Simple, direct authentication check
    const checkAccess = async () => {
      console.log("Admin page - Checking access");
      setIsLoading(true);
      setIsError(false);
      
      try {
        // Check if user is logged in
        if (!user) {
          console.log("No user found, redirecting to login");
          toast.error("Authentication required");
          navigate("/login", { state: { returnTo: "/admin" } });
          return;
        }
        
        // Get user role
        const role = await getUserRole();
        console.log("Retrieved role:", role);
        
        // Check if role is valid
        if (!role) {
          console.log("No role found, redirecting to login");
          toast.error("Unable to verify access level");
          navigate("/login", { state: { returnTo: "/admin" } });
          return;
        }
        
        // Set role and check permissions
        setUserRole(role);
        
        // Check specific role permissions
        if (role !== "admin" && role !== "developer" && role !== "maintainer") {
          console.log("Insufficient permissions, redirecting to home");
          toast.error("You don't have permission to access the admin panel");
          navigate("/");
          return;
        }
      } catch (error: any) {
        console.error("Admin access check error:", error);
        setIsError(true);
        setErrorMessage(error.message || "Could not verify admin access");
        toast.error("Access verification failed");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAccess();
  }, [user, navigate]);

  // Handle retry
  const handleRetry = () => {
    setIsError(false);
    setIsLoading(true);
    // Re-trigger the useEffect
    const retryAccess = async () => {
      try {
        const role = await getUserRole();
        if (role) {
          setUserRole(role);
          setIsError(false);
        } else {
          throw new Error("Could not verify role");
        }
      } catch (error: any) {
        setIsError(true);
        setErrorMessage(error.message || "Access verification failed");
        toast.error("Verification failed");
      } finally {
        setIsLoading(false);
      }
    };
    
    retryAccess();
  };

  // Clean loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-sm max-w-md w-full">
            <Loader className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-primary font-medium text-lg mb-2">Verifying admin access...</p>
            <p className="text-gray-500 text-sm text-center">
              Please wait while we confirm your access permissions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-sm max-w-md w-full">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-red-500 font-medium text-lg mb-2">Error verifying access</p>
            <p className="text-gray-600 text-center mb-4">
              {errorMessage || "There was a problem connecting to the server. Please try again."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button 
                onClick={handleRetry}
                className="flex items-center justify-center gap-2 w-full"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </Button>
              <Button 
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </div>
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

  // Return null if no userRole - failsafe
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
