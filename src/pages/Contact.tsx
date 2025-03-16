
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactInformation } from "@/components/contact/ContactInformation";
import { PersonalizedAssistanceForm } from "@/components/forms/PersonalizedAssistanceForm";

const Contact = () => {
  const [showAssistanceDialog, setShowAssistanceDialog] = useState(false);

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
            <ContactForm />
          </div>
          
          <ContactInformation onRequestAssistance={() => setShowAssistanceDialog(true)} />
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
          
          <PersonalizedAssistanceForm 
            onSuccess={() => setShowAssistanceDialog(false)}
            onCancel={() => setShowAssistanceDialog(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Contact;
