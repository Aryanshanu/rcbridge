
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Building, Sparkles, Calculator } from "lucide-react";

interface TabsContainerProps {
  children: React.ReactNode;
}

export const TabsContainer = ({ children }: TabsContainerProps) => {
  const [activeTab, setActiveTab] = useState("properties");

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-3xl grid-cols-3 bg-gray-100">
            <TabsTrigger 
              value="properties"
              className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-[#1e40af] data-[state=active]:text-white"
            >
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Properties</span>
            </TabsTrigger>
            <TabsTrigger 
              value="services"
              className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-[#1e40af] data-[state=active]:text-white"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Our Services</span>
            </TabsTrigger>
            <TabsTrigger 
              value="calculator"
              className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-[#1e40af] data-[state=active]:text-white"
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Calculator</span>
            </TabsTrigger>
          </TabsList>
        </div>
        {children}
      </Tabs>
    </div>
  );
};
