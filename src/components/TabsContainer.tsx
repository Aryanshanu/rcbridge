
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Building, Sparkles, Calculator } from "lucide-react";

interface TabsContainerProps {
  children: React.ReactNode;
}

export const TabsContainer = ({ children }: TabsContainerProps) => {
  const [activeTab, setActiveTab] = useState("properties");

  return (
    <div className="full-width bg-gray-50">
      <div className="content-container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
