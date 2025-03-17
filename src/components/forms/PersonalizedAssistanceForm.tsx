
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, LockIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PersonalizedAssistanceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

type FormData = {
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  budget: string;
  requirement: string;
  preferredContact: string;
  timeframe: string;
};

export const PersonalizedAssistanceForm = ({ onSuccess, onCancel }: PersonalizedAssistanceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      propertyType: "residential",
      preferredContact: "email",
      timeframe: "1-3 months",
    }
  });

  // Pre-fill user data when logged in
  useEffect(() => {
    if (user && user.email) {
      setValue("email", user.email);
      
      // Get additional user profile data if available
      const fetchUserProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (data && !error) {
          if (data.full_name) setValue("name", data.full_name);
          if (data.phone) setValue("phone", data.phone);
        }
      };
      
      fetchUserProfile();
    }
  }, [user, setValue]);

  const propertyType = watch("propertyType");
  const preferredContact = watch("preferredContact");
  const timeframe = watch("timeframe");

  const handleAuthRequired = () => {
    setShowAuthDialog(true);
  };

  const redirectToAuth = () => {
    window.location.href = "/login";
  };

  const onSubmit = async (data: FormData) => {
    // Check if user is authenticated
    if (!user) {
      handleAuthRequired();
      return;
    }
    
    console.log("Submitting assistance form with data:", data);
    setIsSubmitting(true);
    
    try {
      // Save to assistance_requests table
      const { error } = await supabase
        .from('assistance_requests')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          property_type: data.propertyType,
          budget: data.budget,
          requirement: data.requirement,
          user_id: user.id,
          preferred_contact: data.preferredContact,
          timeframe: data.timeframe,
          status: 'pending'
        });
      
      if (error) {
        console.error("Error submitting assistance request:", error);
        throw error;
      }
      
      console.log("Assistance request submitted successfully");
      
      // Clear form
      reset();
      
      // Show success message
      toast({
        title: "Request Submitted Successfully",
        description: "Our property experts will contact you soon based on your requirements.",
        variant: "default",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit your assistance request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Authentication Required Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LockIcon className="h-5 w-5" /> Authentication Required
            </DialogTitle>
            <DialogDescription>
              You need to sign in or create an account to submit a personalized assistance request.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 flex flex-col gap-4">
            <p className="text-sm text-gray-600">
              Creating an account helps us track your requirements and provide personalized property recommendations.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAuthDialog(false)}>
                Cancel
              </Button>
              <Button onClick={redirectToAuth}>
                Sign In / Sign Up
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
        {!user && (
          <Alert variant="warning" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              You'll need to sign in before submitting this form. All your form data will be preserved.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <Separator />
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              disabled={!!user}
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            {user && <p className="text-xs text-gray-500 mt-1">Email from your account</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="e.g., +91 98765 43210"
            />
            <p className="text-xs text-gray-500">Optional, but recommended for quicker responses</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="preferredContact" className="text-sm font-medium">Preferred Contact Method</label>
            <Select
              value={preferredContact}
              onValueChange={(value) => setValue("preferredContact", value)}
            >
              <SelectTrigger id="preferredContact">
                <SelectValue placeholder="Select contact method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2 pt-2">
          <h3 className="text-lg font-semibold">Property Requirements</h3>
          <Separator />
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="propertyType" className="text-sm font-medium">Property Type</label>
            <Select
              value={propertyType}
              onValueChange={(value) => setValue("propertyType", value)}
            >
              <SelectTrigger id="propertyType">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="agricultural">Agricultural</SelectItem>
                <SelectItem value="undeveloped">Undeveloped Land</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="budget" className="text-sm font-medium">Budget Range</label>
            <Input
              id="budget"
              {...register("budget", { required: "Budget is required" })}
              placeholder="e.g., ₹50-60 lakhs"
              className={errors.budget ? "border-red-500" : ""}
            />
            {errors.budget && <p className="text-sm text-red-500">{errors.budget.message}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="timeframe" className="text-sm font-medium">Purchase/Rent Timeframe</label>
          <Select
            value={timeframe}
            onValueChange={(value) => setValue("timeframe", value)}
          >
            <SelectTrigger id="timeframe">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediately">Immediately</SelectItem>
              <SelectItem value="1-3 months">1-3 months</SelectItem>
              <SelectItem value="3-6 months">3-6 months</SelectItem>
              <SelectItem value="6-12 months">6-12 months</SelectItem>
              <SelectItem value="just exploring">Just exploring options</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="requirement" className="text-sm font-medium">Detailed Requirements</label>
          <Textarea
            id="requirement"
            {...register("requirement", { required: "Requirements details are required" })}
            placeholder="Please describe your property requirements in detail (location preferences, size, amenities, etc.)..."
            className={`min-h-[120px] ${errors.requirement ? "border-red-500" : ""}`}
          />
          {errors.requirement && <p className="text-sm text-red-500">{errors.requirement.message}</p>}
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="relative"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
            {!user && (
              <Badge variant="warning" className="absolute -top-2 -right-2 text-xs">
                Login Required
              </Badge>
            )}
          </Button>
        </div>
      </form>
    </>
  );
};
