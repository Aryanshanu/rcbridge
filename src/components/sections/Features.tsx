
import { Building2, Users, Brain, Shield, Users2, ChartBar, Calculator, Home, Building, Map, Landmark, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";

export const Features = () => {
  const coreFeatures = [
    {
      icon: <Map className="h-8 w-8" />,
      title: "Personalized Property Matching",
      description: "Private, curated property recommendations based on your specific requirements, maintaining exclusivity and value.",
    },
    {
      icon: <Home className="h-8 w-8" />,
      title: "Rental Solutions",
      description: "Direct connections between serious tenants and quality landlords, eliminating brokers and ensuring fair rental rates.",
    },
    {
      icon: <Landmark className="h-8 w-8" />,
      title: "Startup Support",
      description: "Premium office spaces and networking opportunities tailored specifically for emerging businesses and entrepreneurs.",
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: "Development Projects",
      description: "Off-market opportunities for developers and investors seeking large-scale commercial and residential projects.",
    },
    {
      icon: <LineChart className="h-8 w-8" />,
      title: "Investment Opportunities",
      description: "Curated high-ROI properties with our 12%+ annual return criteria, combining rental yield and appreciation.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Value Preservation",
      description: "Maintain property value through controlled exposure and direct transactions without public listings.",
    },
  ];

  // Competitive comparison data
  const competitors = [
    { name: "RC Bridge", color: "bg-primary/80" },
    { name: "MagicBricks", color: "bg-red-500/80" },
    { name: "99acres", color: "bg-blue-500/80" },
    { name: "Housing.com", color: "bg-green-500/80" },
    { name: "NoBroker", color: "bg-yellow-500/80" },
  ];

  const competitiveMatrix = [
    { feature: "Exclusivity & Off-Market Deals", scores: [10, 2, 2, 2, 3] },
    { feature: "Personalized Property Matching", scores: [10, 4, 4, 4, 5] },
    { feature: "Broker-Free Transactions", scores: [9, 3, 3, 3, 10] },
    { feature: "Value Preservation", scores: [10, 3, 3, 3, 4] },
    { feature: "Startup & Business Support", scores: [9, 4, 4, 4, 4] },
    { feature: "Investment Opportunities (12%+ ROI)", scores: [10, 5, 5, 5, 6] },
  ];

  return (
    <section className="mb-16 sm:mb-24">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Core Services & Advantages</h2>
        <p className="mt-2 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
          A decade of excellence in providing exclusive, high-value real estate solutions through direct connections.
        </p>
      </div>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="features">Core Features</TabsTrigger>
          <TabsTrigger value="comparison">Competitive Analysis</TabsTrigger>
          <TabsTrigger value="calculator">Investment Calculator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="features" className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {coreFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-5 sm:p-6 rounded-lg shadow-md border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <h3 className="text-xl font-bold text-center mb-4">Our Impact & Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg text-center">
                <p className="text-primary font-bold text-xl">₹225 Crores+</p>
                <p className="text-gray-600 text-sm">Saved in Brokerage & Hidden Costs</p>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <p className="text-primary font-bold text-xl">₹750 Crores+</p>
                <p className="text-gray-600 text-sm">Total Real Estate Transactions</p>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <p className="text-primary font-bold text-xl">₹37.5 Crores+</p>
                <p className="text-gray-600 text-sm">Retained in Property Value</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="comparison">
          <div className="overflow-x-auto">
            <div className="bg-white p-4 rounded-lg shadow-md min-w-[768px]">
              <h3 className="text-xl font-bold mb-4 text-center">RC Bridge vs. Market Competitors</h3>
              <div className="mb-4">
                <div className="grid grid-cols-7 gap-2">
                  <div className="col-span-3 font-semibold text-gray-700">Feature</div>
                  {competitors.map((competitor, index) => (
                    <div key={index} className="col-span-4/5 font-semibold text-center text-sm">
                      {competitor.name}
                    </div>
                  ))}
                </div>
              </div>
              
              {competitiveMatrix.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-7 gap-2 mb-3 items-center">
                  <div className="col-span-3 text-gray-700">{row.feature}</div>
                  {row.scores.map((score, scoreIndex) => (
                    <div key={`${rowIndex}-${scoreIndex}`} className="col-span-4/5 text-center">
                      <div className="mx-auto w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm" 
                        style={{ backgroundColor: `var(--${competitors[scoreIndex].color.split('-')[1]})` }}>
                        {score}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              
              <div className="mt-4 text-sm text-gray-600">
                <p className="italic text-center">Ratings are out of 10, based on comprehensive market analysis and user feedback.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-primary/5 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Our Competitive Edge</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>RC Bridge excels in providing exclusive, off-market deals that preserve property value.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Traditional platforms rely on public listings, diluting property exclusivity and value.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Our focus on high-return investment opportunities consistently outperforms market competitors.</span>
              </li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="calculator">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Investment ROI Calculator</h3>
            <p className="text-gray-600 mb-6">
              Evaluate if a property meets our 12% annual return threshold by calculating combined rental yield and price appreciation.
            </p>
            
            <InvestmentCalculator />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-10 text-center">
        <Button 
          variant="default" 
          size="lg"
          onClick={() => document.getElementById('property-form')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Get Personalized Assistance
        </Button>
      </div>
    </section>
  );
};
