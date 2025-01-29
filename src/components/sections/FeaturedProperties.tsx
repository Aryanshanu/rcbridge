import { PropertyCard } from "@/components/PropertyCard";

export const FeaturedProperties = () => {
  const featuredProperties = [
    {
      title: "Luxury Villa in Banjara Hills",
      location: "Banjara Hills, Hyderabad",
      price: "₹2.5Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "4500 sq.ft",
      image: "/placeholder.svg",
    },
    {
      title: "Modern Office Space in HITEC City",
      location: "HITEC City, Hyderabad",
      price: "₹1.8Cr",
      bedrooms: 0,
      bathrooms: 4,
      area: "3000 sq.ft",
      image: "/placeholder.svg",
    },
    {
      title: "Premium Apartment in Jubilee Hills",
      location: "Jubilee Hills, Hyderabad",
      price: "₹95L",
      bedrooms: 3,
      bathrooms: 3,
      area: "2200 sq.ft",
      image: "/placeholder.svg",
    },
  ];

  return (
    <section className="mb-12 sm:mb-16">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Properties</h2>
        <p className="mt-2 text-base sm:text-lg text-gray-600">
          Discover our hand-picked premium listings
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {featuredProperties.map((property, index) => (
          <PropertyCard key={index} {...property} />
        ))}
      </div>
      <div className="text-center mt-8">
        <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium">
          View All Properties
        </button>
      </div>
    </section>
  );
};