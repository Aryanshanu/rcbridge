
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { 
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";

interface ContactInformationProps {
  onRequestAssistance: () => void;
}

export const ContactInformation = ({ onRequestAssistance }: ContactInformationProps) => {
  const isMobile = useIsMobile();
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);
  
  // For mobile screens: use a drawer (bottom sheet)
  // For desktop screens: trigger the parent's dialog
  const handleAssistanceRequest = () => {
    if (isMobile) {
      setOpenMobileDrawer(true);
    } else {
      onRequestAssistance();
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full">
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
      
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-start">
          <MapPin className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-lg">Address</h3>
            <p className="text-gray-600">Hyderabad</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Mail className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-lg">Email</h3>
            <p className="text-gray-600">aryan@rcbridge.co</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Phone className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-lg">Phone</h3>
            <p className="text-gray-600">Contact via email for phone details</p>
          </div>
        </div>
      </div>
      
      {/* Get Personalized Assistance Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Need Personalized Guidance?</h3>
        <p className="text-gray-600 mb-4">
          Fill out our detailed form and get personalized property recommendations tailored to your specific needs.
        </p>
        
        {isMobile ? (
          // Mobile: Show bottom drawer
          <Drawer open={openMobileDrawer} onOpenChange={setOpenMobileDrawer}>
            <DrawerTrigger asChild>
              <Button 
                onClick={() => console.log("Mobile assistance button clicked")} 
                className="w-full"
                type="button"
              >
                Get Personalized Assistance
              </Button>
            </DrawerTrigger>
            <DrawerContent className="px-4 pb-6 pt-2">
              <DrawerHeader>
                <DrawerTitle>Get Personalized Assistance</DrawerTitle>
                <DrawerDescription>
                  Tell us about your requirements and our experts will contact you with personalized recommendations.
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4">
                <Button 
                  onClick={() => {
                    setOpenMobileDrawer(false);
                    onRequestAssistance();
                  }}
                  className="w-full"
                >
                  Open Request Form
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          // Desktop: Trigger parent's dialog directly
          <Button 
            onClick={() => {
              console.log("Desktop assistance button clicked");
              onRequestAssistance();
            }} 
            className="w-full md:w-auto md:px-8"
            type="button"
          >
            Get Personalized Assistance
          </Button>
        )}
      </div>
    </div>
  );
};
