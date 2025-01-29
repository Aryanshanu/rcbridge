export const Statistics = () => {
  const stats = [
    { label: "Properties Listed", value: "5,000+" },
    { label: "Active Users", value: "10,000+" },
    { label: "Startups Supported", value: "500+" },
    { label: "Successful Deals", value: "2,000+" },
  ];

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">{stat.value}</div>
              <div className="text-sm sm:text-base text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};