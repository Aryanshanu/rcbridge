import { Building2, Users, Brain, Shield, Users2, ChartBar, Calculator, Home, Building, Map, Landmark, LineChart, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const competitors = [
    { name: "RC Bridge", color: "bg-primary/80" },
    { name: "MagicBricks", color: "bg-red-500/80" },
    { name: "99acres", color: "bg-blue-500/80" },
    { name: "Housing.com", color: "bg-green-500/80" },
    { name: "CommonFloor", color: "bg-yellow-500/80" },
    { name: "NoBroker", color: "bg-purple-500/80" },
  ];

  const competitiveMatrix = [
    { 
      feature: "Public Listings", 
      scores: [0, 10, 10, 10, 10, 10],
      icons: [false, true, true, true, true, true]
    },
    { 
      feature: "Exclusivity & Off-Market Deals", 
      scores: [10, 2, 2, 2, 2, 3],
      icons: [true, false, false, false, false, false]
    },
    { 
      feature: "Personalized Property Matching", 
      scores: [10, 4, 4, 4, 4, 5],
      icons: [true, false, false, false, false, false]
    },
    { 
      feature: "Broker-Free Transactions", 
      scores: [9, 3, 3, 3, 3, 10],
      icons: [true, false, false, false, false, true]
    },
    { 
      feature: "Value Preservation", 
      scores: [10, 3, 3, 3, 3, 4],
      icons: [true, false, false, false, false, false]
    },
    { 
      feature: "Rental Solutions", 
      scores: [9, 8, 8, 8, 8, 9],
      icons: [true, true, true, true, true, true]
    },
    { 
      feature: "Advertising", 
      scores: [7, 10, 10, 10, 10, 7],
      icons: [true, true, true, true, true, true]
    },
    { 
      feature: "Startup & Business Support", 
      scores: [9, 4, 4, 4, 4, 4],
      icons: [true, false, false, false, false, false]
    },
    { 
      feature: "Development & Commercial Deals", 
      scores: [9, 7, 7, 7, 7, 5],
      icons: [true, true, true, true, true, false]
    },
    { 
      feature: "Investment Opportunities (12%+ ROI)", 
      scores: [10, 5, 5, 5, 5, 6],
      icons: [true, false, false, false, false, false]
    },
    { 
      feature: "User Experience & Trust", 
      scores: [9, 7, 7, 8, 7, 8],
      icons: [true, true, true, true, true, true]
    }
  ];

  const detailedFeatures = [
    {
      id: "property-matching",
      title: "🏡 Personalized Property Matching",
      subtitle: "How It Works?",
      description: [
        "No Public Listings → We do not list properties on our platform to prevent value dilution.",
        "Buyers submit detailed preferences (location, budget, property type, size, amenities).",
        "Our system matches them with undisclosed, off-market properties that fit their criteria.",
        "After verifying buyer interest, we share property details privately (images, documents, etc.).",
        "Buyer and seller connect directly after mutual agreement → No middlemen."
      ],
      benefits: [
        "Preserves real estate value by avoiding overexposure.",
        "Ensures serious inquiries only – No unnecessary bargaining or market speculation.",
        "Provides exclusive, high-quality property options instead of overwhelming choices."
      ],
      icon: <Map className="h-10 w-10 text-primary" />
    },
    {
      id: "rental",
      title: "🏠 Rental Solutions",
      subtitle: "How It Works?",
      description: [
        "Curated rental options for residential & commercial spaces.",
        "No public rental database – Only quality listings are privately recommended.",
        "Direct negotiations between landlords & tenants → No brokerage fees.",
        "Tenant screening & verification to ensure reliability."
      ],
      benefits: [
        "Eliminates fake or duplicate listings found on traditional platforms.",
        "Saves time – Tenants get options tailored to their needs, reducing search effort.",
        "Fair pricing – Landlords offer reasonable prices without excessive agent commissions."
      ],
      icon: <Home className="h-10 w-10 text-primary" />
    },
    {
      id: "startup",
      title: "🚀 Startup & Business Support",
      subtitle: "How It Works?",
      description: [
        "Specialized commercial spaces for startups, co-working hubs, and new businesses.",
        "Flexible leasing options tailored for entrepreneurs and growing companies.",
        "Networking & Investor Connect – Real estate investors looking for commercial opportunities."
      ],
      benefits: [
        "Affordable & flexible leasing for startups with limited budgets.",
        "Better workspace options – High-quality offices, co-working spaces, and business hubs.",
        "Access to investors & mentors – Supports business growth beyond just real estate."
      ],
      icon: <Landmark className="h-10 w-10 text-primary" />
    },
    {
      id: "development",
      title: "🏗️ Development & Commercial Projects",
      subtitle: "How It Works?",
      description: [
        "Private land deals for real estate developers & builders.",
        "Exclusive large-scale projects – Hotels, malls, office buildings, etc.",
        "Undisclosed property acquisitions for future development."
      ],
      benefits: [
        "Access to hidden investment gems that are not publicly listed.",
        "Direct developer-owner deals for efficient project execution.",
        "Long-term strategic investments for businesses expanding their real estate footprint."
      ],
      icon: <Building className="h-10 w-10 text-primary" />
    },
    {
      id: "investment",
      title: "💰 Investment Opportunities",
      subtitle: "How It Works?",
      description: [
        "Curated high-return real estate investments (12%+ annual ROI).",
        "Risk-based property recommendations tailored to investor profiles.",
        "Market intelligence & predictive analysis for smarter investments."
      ],
      benefits: [
        "Guaranteed high ROI – Carefully vetted properties for stable profits.",
        "Data-driven insights – Helps investors make informed decisions.",
        "Exclusive opportunities – Off-market investment deals with strong growth potential."
      ],
      icon: <LineChart className="h-10 w-10 text-primary" />
    }
  ];

  return (
    <section className="mb-16 sm:mb-24">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50">Our Core Services & Advantages</h2>
        <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          A decade of excellence in providing exclusive, high-value real estate solutions through direct connections.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-4">
        <a href="#core-features" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">Core Features</a>
        <a href="#detailed-breakdown" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">Detailed Breakdown</a>
        <a href="#competitive-analysis" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">Competitive Analysis</a>
      </div>
      
      <div id="core-features" className="mb-16">
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-bold">Core Features</h3>
          <div className="w-20 h-1 bg-primary mx-auto mt-2 mb-6"></div>
        </div>
        
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
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-100 dark:border-gray-700 mt-8">
          <h3 className="text-xl font-bold text-center mb-4">Our Impact & Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-primary font-bold text-xl">₹20 Crores+</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Saved in Brokerage & Hidden Costs</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-primary font-bold text-xl">₹200 Crores+</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Real Estate Transactions</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="text-primary font-bold text-xl">₹4.5 Crores+</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Retained in Property Value</p>
            </div>
          </div>
        </div>
      </div>
      
      <div id="detailed-breakdown" className="mb-16">
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-bold">Detailed Breakdown</h3>
          <div className="w-20 h-1 bg-primary mx-auto mt-2 mb-6"></div>
        </div>
        
        <div className="space-y-8">
          {detailedFeatures.map((feature, index) => (
            <div key={index} id={feature.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="hidden sm:block">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">{feature.title}</h3>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold text-primary">{feature.subtitle}</h4>
                    <ul className="mt-2 space-y-2">
                      {feature.description.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-primary mr-2 mt-1">➤</span>
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold text-green-600">✅ Benefits</h4>
                    <ul className="mt-2 space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-green-600 mr-2 mt-1">✓</span>
                          <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div id="competitive-analysis" className="mb-16">
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-bold">Competitive Analysis</h3>
          <div className="w-20 h-1 bg-primary mx-auto mt-2 mb-6"></div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="bg-white p-4 rounded-lg shadow-md min-w-[768px]">
            <h3 className="text-xl font-bold mb-4 text-center">RC Bridge vs. Market Competitors</h3>
            
            <div className="mb-4">
              <div className="grid grid-cols-7 gap-2">
                <div className="col-span-1 font-semibold text-gray-700 dark:text-gray-300 pl-2">Feature</div>
                {competitors.map((competitor, index) => (
                  <div key={index} className="col-span-1 font-semibold text-center text-sm">
                    {competitor.name}
                  </div>
                ))}
              </div>
            </div>
            
            {competitiveMatrix.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-7 gap-2 mb-3 items-center hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="col-span-1 text-gray-700 dark:text-gray-300 pl-2 font-medium">{row.feature}</div>
                {row.scores.map((score, scoreIndex) => (
                  <div key={`${rowIndex}-${scoreIndex}`} className="col-span-1 flex flex-col items-center justify-center">
                    {row.icons[scoreIndex] ? (
                      <Check className="text-green-500 w-5 h-5 mb-1" />
                    ) : (
                      <X className="text-red-500 w-5 h-5 mb-1" />
                    )}
                    <div className="mx-auto w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm" 
                      style={{ backgroundColor: `var(--${competitors[scoreIndex].color.split('-')[1]})` }}>
                      {score}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            
            <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Key Takeaways:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>RC Bridge scores highest in Exclusivity, Personalized Matching, Value Preservation, and Investment Opportunities.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Traditional platforms focus on public listings, which expose properties to mass audiences but reduce exclusivity and value.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>NoBroker is closest to RC Bridge in broker-free transactions, but it still follows a public listing model.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>RC Bridge outperforms others in startup and business support, development opportunities, and high ROI investments.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
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
