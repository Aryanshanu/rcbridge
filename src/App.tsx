
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import Services from "./pages/Services";
import Calculator from "./pages/Calculator";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Suspense, lazy, useEffect, useState } from "react";
import { WelcomeAnimation } from "./components/auth/WelcomeAnimation";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "./components/ui/button";

// Lazy-loaded pages for better performance
const Blog = lazy(() => import("./pages/Blog"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const Profile = lazy(() => import("./pages/Profile"));
const MyProperties = lazy(() => import("./pages/MyProperties"));
const SavedSearches = lazy(() => import("./pages/SavedSearches"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

// Loading component
const PageLoading = () => (
  <div className="w-full h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center">
      <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
      <p className="text-primary font-medium">Loading...</p>
    </div>
  </div>
);

// Error Boundary to catch route errors
const ErrorFallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Report 404 error
    console.error(`Page not found: ${location.pathname}`);
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          We couldn't find the page "{location.pathname}". The page might have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/')} 
            className="flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Return to Home
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

// App Router component to handle redirect paths from sessionStorage
const AppRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if there's a redirect path in sessionStorage
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath && location.pathname === '/') {
      console.log("Found redirectPath in sessionStorage:", redirectPath);
      
      // Clear the redirect path before navigating to prevent loops
      sessionStorage.removeItem('redirectPath');
      
      // Small timeout to ensure the app is fully loaded
      setTimeout(() => {
        // Use replace: true to replace the current history entry
        navigate(redirectPath, { replace: true });
        console.log("Navigated to:", redirectPath);
      }, 50);
    }
  }, [location.pathname, navigate]);
  
  return null;
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const WelcomeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { showWelcome, setShowWelcome } = useAuth();
  
  return (
    <>
      {showWelcome && <WelcomeAnimation onComplete={() => setShowWelcome(false)} />}
      {children}
    </>
  )
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  // Add scroll behavior and initialize app
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Mark app as ready after a short delay to ensure components are loaded
    const timer = setTimeout(() => {
      setIsAppReady(true);
      console.log("App ready for navigation");
    }, 200);
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
      clearTimeout(timer);
    };
  }, []);
  
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                {/* Router to handle redirects */}
                <AppRouter />
                <WelcomeWrapper>
                  <Suspense fallback={<PageLoading />}>
                    {isAppReady ? (
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Index />} />
                        <Route path="/properties" element={<Properties />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/calculator" element={<Calculator />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {/* Protected Routes */}
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/my-properties" element={<ProtectedRoute><MyProperties /></ProtectedRoute>} />
                        <Route path="/saved-searches" element={<ProtectedRoute><SavedSearches /></ProtectedRoute>} />
                        
                        {/* Catch-all route */}
                        <Route path="*" element={<ErrorFallback />} />
                      </Routes>
                    ) : (
                      <PageLoading />
                    )}
                  </Suspense>
                </WelcomeWrapper>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </div>
  );
};

export default App;
