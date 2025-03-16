
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";
import { Card } from "@/components/ui/card";
import { Calculator as CalculatorIcon } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

const Calculator = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Investment Calculator | RC Bridge" description="Calculate your potential real estate investment returns" />
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
              <BreadcrumbPage>Investment Calculator</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">Investment Calculator</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Estimate returns and evaluate potential investments with our advanced calculator
          </p>
        </div>
        
        <section className="max-w-4xl mx-auto mb-16">
          <Card className="p-4 sm:p-6 bg-white border border-gray-200">
            <div className="flex items-center mb-6">
              <CalculatorIcon className="h-6 w-6 mr-3 text-[#1e40af]" />
              <h2 className="text-2xl font-bold">Investment Calculator</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Our investment calculator helps you evaluate the potential return on investment for properties.
              Calculate rental yield, price appreciation, and determine if a property meets the 12% annual return threshold.
            </p>
            <InvestmentCalculator />
          </Card>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Calculator;
