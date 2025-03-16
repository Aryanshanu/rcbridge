import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Define the form schema using zod
const assistanceFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  requirement: z.string().min(10, { message: "Please provide more details about your requirements." }),
  propertyType: z.string().min(1, { message: "Please select a property type." }),
  budget: z.string().min(1, { message: "Please provide your budget." }),
});

type AssistanceFormValues = z.infer<typeof assistanceFormSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAssistanceDialog, setShowAssistanceDialog] = useState(false);

  // Initialize react-hook-form with zod validation
  const assistanceForm = useForm<AssistanceFormValues>({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Store the contact form data in Supabase
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          { 
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message
          }
        ]);
        
      if (error) throw error;
      
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onAssistanceSubmit = async (data: AssistanceFormValues) => {
    try {
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
        
      if (error) throw error;
      
      toast({
        title: "Request Received!",
        description: "Our team will reach out to you shortly with personalized assistance.",
      });
      
      setShowAssistanceDialog(false);
      assistanceForm.reset();
      
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
    <div className="min-h-screen bg-gray-50">
      <SEO title="Contact Us | RC Bridge" description="Get in touch with our real estate experts" />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4 mr-1" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Contact Us</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Have questions or need assistance? Reach out to our team of real estate experts
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
          
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
                onClick={() => setShowAssistanceDialog(true)} 
                className="w-full"
              >
                Get Personalized Assistance
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Personalized Assistance Dialog */}
      <Dialog open={showAssistanceDialog} onOpenChange={setShowAssistanceDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Get Personalized Assistance</DialogTitle>
            <DialogDescription>
              Tell us about your requirements and our experts will provide personalized recommendations for you.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...assistanceForm}>
            <form onSubmit={assistanceForm.handleSubmit(onAssistanceSubmit)} className="space-y-4 pt-4">
              <FormField
                control={assistanceForm.control}
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
                control={assistanceForm.control}
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
                control={assistanceForm.control}
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
                control={assistanceForm.control}
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
                control={assistanceForm.control}
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
                control={assistanceForm.control}
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
                <Button type="button" variant="outline" onClick={() => setShowAssistanceDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Request
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Contact;
