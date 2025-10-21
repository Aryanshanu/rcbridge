
import { HeartHandshake, Target, Users, Trophy } from "lucide-react";

export const CoreValues = () => {
  const values = [
    {
      icon: HeartHandshake,
      title: "Integrity",
      description: "Upholding the highest ethical standards in every transaction and relationship, ensuring trust and transparency."
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Constantly evolving our approach to meet changing market needs and leveraging technology for better outcomes."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building relationships that extend beyond transactions, fostering a vibrant ecosystem of property stakeholders."
    },
    {
      icon: Trophy,
      title: "Excellence",
      description: "Committed to delivering exceptional service and results that exceed expectations in every aspect."
    }
  ];

  return (
    <section className="full-width bg-white dark:bg-gray-950 py-16">
      <div className="content-container">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50">Our Core Values</h2>
          <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-400">
            The principles that drive our commitment to excellence in real estate
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all border dark:border-gray-700">
              <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4 mx-auto">
                <value.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center dark:text-gray-50">{value.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
