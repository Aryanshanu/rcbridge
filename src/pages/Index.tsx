import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PropertyCard } from "@/components/PropertyCard";

const Index = () => {
  const featuredProperties = [
    {
      title: "Modern Apartment in Jubilee Hills",
      location: "Jubilee Hills, Hyderabad",
      price: "₹85L",
      bedrooms: 3,
      bathrooms: 2,
      area: "1800 sq.ft",
      image: "/placeholder.svg",
    },
    {
      title: "Commercial Space in HITEC City",
      location: "HITEC City, Hyderabad",
      price: "₹1.2Cr",
      bedrooms: 0,
      bathrooms: 2,
      area: "2500 sq.ft",
      image: "/placeholder.svg",
    },
    {
      title: "Villa in Banjara Hills",
      location: "Banjara Hills, Hyderabad",
      price: "₹2.5Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "3200 sq.ft",
      image: "/placeholder.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <PropertyCard key={index} {...property} />
            ))}
          </div>
        </div>

        <div className="bg-secondary rounded-lg p-8 mt-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">Join Our Startup Community</h2>
            <p className="text-gray-600 mb-6">
              Connect with fellow entrepreneurs, find mentors, and access resources to grow your business
            </p>
            <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium">
              Learn More
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;