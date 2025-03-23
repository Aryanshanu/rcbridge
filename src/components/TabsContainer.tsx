
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Building, Sparkles, Calculator } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsContainerProps {
  children?: React.ReactNode;
  tabs?: Tab[];
  defaultTab?: string;
}

export const TabsContainer = ({ children, tabs, defaultTab }: TabsContainerProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine the active tab based on the current URL path or the defaultTab prop
  const getTabFromPath = () => {
    if (tabs && defaultTab) return defaultTab;
    
    const path = location.pathname;
    if (path === "/services") return "services";
    if (path === "/calculator") return "calculator";
    return "properties";
  };
  
  const [activeTab, setActiveTab] = useState(getTabFromPath());
  
  // Update active tab when the URL changes
  useEffect(() => {
    if (!tabs) {
      setActiveTab(getTabFromPath());
    }
  }, [location.pathname, tabs]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // If we're using custom tabs, don't navigate
    if (tabs) return;
    
    // Use React Router's navigate with replace option to prevent history stacking
    if (value === "properties" && location.pathname !== "/properties") {
      navigate("/properties", { replace: true });
      console.log("Navigating to: /properties");
    } else if (value === "services" && location.pathname !== "/services") {
      navigate("/services", { replace: true });
      console.log("Navigating to: /services");
    } else if (value === "calculator" && location.pathname !== "/calculator") {
      navigate("/calculator", { replace: true });
      console.log("Navigating to: /calculator");
    }
  };

  // Render the custom tabs if provided
  if (tabs) {
    return (
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              disabled={tab.disabled}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    );
  }

  // Render the default tabs with children
  return (
    <div className="full-width bg-gray-50">
      <div className="content-container py-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-3xl grid-cols-3 bg-white rounded-full p-1 shadow-md border border-gray-100">
              <TabsTrigger 
                value="properties"
                className="flex items-center justify-center gap-2 py-3 rounded-full transition-all data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Building className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Properties</span>
              </TabsTrigger>
              <TabsTrigger 
                value="services"
                className="flex items-center justify-center gap-2 py-3 rounded-full transition-all data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Our Services</span>
              </TabsTrigger>
              <TabsTrigger 
                value="calculator"
                className="flex items-center justify-center gap-2 py-3 rounded-full transition-all data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Calculator</span>
              </TabsTrigger>
            </TabsList>
          </div>
          {children}
        </Tabs>
      </div>
    </div>
  );
};
