
import { Users, Clock, Shield } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Users,
      step: 1,
      title: "Share Your Requirements",
      description: "Tell us what you're looking for, whether buying, selling, or renting property."
    },
    {
      icon: Clock,
      step: 2,
      title: "Personalized Matching",
      description: "We match you with exclusive off-market properties or serious buyers based on your criteria."
    },
    {
      icon: Shield,
      step: 3,
      title: "Direct Connections",
      description: "Connect directly with property owners or buyers, eliminating middlemen and unnecessary fees."
    }
  ];

  return (
    <section className="full-width bg-gray-50 dark:bg-gray-900 py-16">
      <div className="content-container">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50">How RC Bridge Works</h2>
          <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Our unique approach to revolutionizing real estate transactions
          </p>
        </div>
        
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-24 bottom-24 w-0.5 bg-primary/30 -translate-x-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step) => (
              <div key={step.step} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-3 mx-auto">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
