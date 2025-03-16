
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Award, Calculator } from "lucide-react";

interface TabsContainerProps {
  children: React.ReactNode;
  defaultValue?: string;
}

export const TabsContainer = ({ children, defaultValue = "properties" }: TabsContainerProps) => {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <div className="flex justify-center mb-8">
        <TabsList className="grid grid-cols-3 max-w-3xl w-full">
          <TabsTrigger 
            value="properties" 
            className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-[#1e40af] data-[state=active]:text-white"
          >
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Properties</span>
            <span className="sm:hidden">Properties</span>
          </TabsTrigger>
          <TabsTrigger 
            value="services" 
            className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-[#1e40af] data-[state=active]:text-white"
          >
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Our Services</span>
            <span className="sm:hidden">Services</span>
          </TabsTrigger>
          <TabsTrigger 
            value="calculator" 
            className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-[#1e40af] data-[state=active]:text-white"
          >
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Investment Calculator</span>
            <span className="sm:hidden">Calculator</span>
          </TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
};
