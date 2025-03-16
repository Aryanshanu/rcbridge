
import { Button } from "@/components/ui/button";
import { Mail, MapPin } from "lucide-react";

interface ContactInformationProps {
  onRequestAssistance: () => void;
}

export const ContactInformation = ({ onRequestAssistance }: ContactInformationProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
      <div className="space-y-6">
        <div className="flex items-start">
          <MapPin className="h-6 w-6 text-primary mr-4 mt-1" />
          <div>
            <h3 className="font-semibold text-lg">Address</h3>
            <p className="text-gray-600">Hyderabad</p>
          </div>
        </div>
        <div className="flex items-start">
          <Mail className="h-6 w-6 text-primary mr-4 mt-1" />
          <div>
            <h3 className="font-semibold text-lg">Email</h3>
            <p className="text-gray-600">aryan@rcbridge.co</p>
          </div>
        </div>
      </div>
      
      {/* Get Personalized Assistance Button */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Need Personalized Guidance?</h3>
        <p className="text-gray-600 mb-4">
          Fill out our detailed form and get personalized property recommendations tailored to your specific needs.
        </p>
        <Button 
          onClick={onRequestAssistance} 
          className="w-full"
          type="button"
        >
          Get Personalized Assistance
        </Button>
      </div>
    </div>
  );
};
