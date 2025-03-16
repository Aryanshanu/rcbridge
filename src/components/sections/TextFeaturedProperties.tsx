
import { Link } from "react-router-dom";

export const TextFeaturedProperties = () => {
  const properties = [
    {
      id: "1",
      title: "Luxury Villa in Hyderabad",
      location: "Jubilee Hills, Hyderabad",
      price: "₹4.5 Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "4500 sq. ft.",
      description: "Magnificent villa with modern architecture, swimming pool and garden area."
    },
    {
      id: "2",
      title: "Premium Apartment",
      location: "Banjara Hills, Hyderabad",
      price: "₹2.8 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "2100 sq. ft.",
      description: "High-end apartment with premium amenities and panoramic city views."
    },
    {
      id: "3",
      title: "Commercial Building",
      location: "Hi-Tech City, Hyderabad",
      price: "₹12 Cr",
      bedrooms: null,
      bathrooms: 8,
      area: "12000 sq. ft.",
      description: "Prime commercial building suitable for offices with ample parking space."
    }
  ];

  return (
    <div className="space-y-6">
      {properties.map((property) => (
        <Link 
          to={`/properties`} 
          key={property.id}
          className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 hover:text-primary transition-colors">{property.title}</h3>
              <p className="text-gray-600 mt-1">{property.location}</p>
            </div>
            <p className="text-primary font-bold text-lg mt-2 sm:mt-0">{property.price}</p>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-4">
            {property.bedrooms && (
              <div className="text-gray-600">
                <span className="font-medium">{property.bedrooms}</span> Bedrooms
              </div>
            )}
            <div className="text-gray-600">
              <span className="font-medium">{property.bathrooms}</span> Bathrooms
            </div>
            <div className="text-gray-600">
              <span className="font-medium">{property.area}</span>
            </div>
          </div>
          
          <p className="mt-4 text-gray-700">{property.description}</p>
          
          <div className="mt-4 flex justify-end">
            <span className="text-primary hover:underline">View details →</span>
          </div>
        </Link>
      ))}
    </div>
  );
};
