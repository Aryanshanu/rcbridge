
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
};

export const PersonalizedAssistanceForm = ({ onSuccess, onCancel }: PersonalizedAssistanceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    defaultValues: {
      propertyType: "residential",
    }
  });

  const propertyType = watch("propertyType");

  const onSubmit = async (data: FormData) => {
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
          status: 'pending'
        });
      
      if (error) {
        console.error("Error submitting assistance request:", error);
        throw error;
      }
      
      console.log("Assistance request submitted successfully");
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
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
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">Phone (optional)</label>
          <Input
            id="phone"
            {...register("phone")}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="budget" className="text-sm font-medium">Budget</label>
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
        <label htmlFor="requirement" className="text-sm font-medium">Your Requirements</label>
        <Textarea
          id="requirement"
          {...register("requirement", { required: "Requirements details are required" })}
          placeholder="Tell us about your property requirements in detail..."
          className={`min-h-[120px] ${errors.requirement ? "border-red-500" : ""}`}
        />
        {errors.requirement && <p className="text-sm text-red-500">{errors.requirement.message}</p>}
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
};
