
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the form schema using zod
const assistanceFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  requirement: z.string().min(10, { message: "Please provide more details about your requirements." }),
  propertyType: z.string().min(1, { message: "Please select a property type." }),
  budget: z.string().min(1, { message: "Please provide your budget." }),
});

export type AssistanceFormValues = z.infer<typeof assistanceFormSchema>;

interface PersonalizedAssistanceFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PersonalizedAssistanceForm = ({ 
  onSuccess, 
  onCancel 
}: PersonalizedAssistanceFormProps) => {
  const { toast } = useToast();

  // Initialize react-hook-form with zod validation
  const form = useForm<AssistanceFormValues>({
    resolver: zodResolver(assistanceFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      requirement: "",
      propertyType: "",
      budget: "",
    },
  });

  const onSubmit = async (data: AssistanceFormValues) => {
    try {
      console.log("Submitting assistance request:", data);
      
      // Store the personalized assistance request in Supabase
      const { error } = await supabase
        .from('assistance_requests')
        .insert([
          { 
            name: data.name,
            email: data.email,
            phone: data.phone || "",
            requirement: data.requirement,
            property_type: data.propertyType,
            budget: data.budget,
            status: 'pending'
          }
        ]);
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      toast({
        title: "Request Received!",
        description: "Our team will reach out to you shortly with personalized assistance.",
      });
      
      form.reset();
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error submitting assistance request:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="+91 98765 43210" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Type</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...field}
                >
                  <option value="">Select property type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="agricultural">Agricultural Land</option>
                  <option value="plot">Plot/Land</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Range</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...field}
                >
                  <option value="">Select budget range</option>
                  <option value="under-50l">Under ₹50 Lakhs</option>
                  <option value="50l-1cr">₹50 Lakhs - ₹1 Crore</option>
                  <option value="1cr-2cr">₹1 Crore - ₹2 Crore</option>
                  <option value="2cr-5cr">₹2 Crore - ₹5 Crore</option>
                  <option value="above-5cr">Above ₹5 Crore</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="requirement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Requirements</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us what you're looking for. Include details like location preferences, size requirements, amenities, etc."
                  rows={4}
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                The more details you provide, the better we can assist you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            Submit Request
          </Button>
        </div>
      </form>
    </Form>
  );
};
