
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What services does RC Bridge provide?",
      answer: "RC Bridge offers a comprehensive range of real estate services including property listings, investment analysis, property management, and development partnerships."
    },
    {
      question: "How do I list my property on RC Bridge?",
      answer: "You can list your property by registering an account, navigating to the 'My Properties' section, and clicking on 'Add New Property'. Follow the form instructions to provide all necessary details."
    },
    {
      question: "What investment opportunities are available?",
      answer: "We offer various investment opportunities including residential properties, commercial spaces, agricultural land, and development partnerships. Use our Investment Calculator to evaluate potential returns."
    },
    {
      question: "How does the Investment Calculator work?",
      answer: "Our Investment Calculator uses property price, rental income, appreciation rate, and other factors to estimate potential ROI. It helps you make informed investment decisions by projecting returns over different timeframes."
    },
    {
      question: "Can I search for specific property features?",
      answer: "Yes, our Advanced Search feature allows you to filter properties by type, location, price range, size, bedrooms, bathrooms, and various amenities to find exactly what you're looking for."
    },
    {
      question: "How do I contact property owners or sellers?",
      answer: "Once registered, you can directly contact property owners through our messaging system. Simply click the 'Contact Seller' button on any property listing to initiate communication."
    },
    {
      question: "What are development partnerships?",
      answer: "Development partnerships allow landowners and investors to collaborate on property development projects. Partners share resources, risks, and returns based on predefined agreements."
    },
    {
      question: "How secure is my information on RC Bridge?",
      answer: "We implement industry-standard security measures to protect your data. All transactions and personal information are encrypted and handled according to strict privacy protocols."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="FAQ | RC Bridge" description="Frequently asked questions about our real estate services" />
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
              <BreadcrumbPage>FAQ</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our services and platform
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
