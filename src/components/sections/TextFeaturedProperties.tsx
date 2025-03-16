
import { useState } from "react";
import { TextPropertyCard } from "@/components/TextPropertyCard";
import { useNavigate } from "react-router-dom";

export const TextFeaturedProperties = () => {
  const navigate = useNavigate();
  
  // Featured properties data - limited to 6 properties for the homepage
  const featuredProperties = [
    {
      id: "1",
      title: "Luxury Villa in Jubilee Hills",
      location: "Road No. 10, Jubilee Hills, Hyderabad",
      price: "₹4.85 Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "4500 sq. ft."
    },
    {
      id: "2",
      title: "Premium Apartment",
      location: "Somajiguda, Banjara Hills, Hyderabad",
      price: "₹2.45 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "2100 sq. ft."
    },
    {
      id: "3",
      title: "Commercial Building",
      location: "HITEC City, Madhapur, Hyderabad",
      price: "₹16.8 Cr",
      bedrooms: 0,
      bathrooms: 8,
      area: "12000 sq. ft."
    },
    {
      id: "4",
      title: "Residential Plot",
      location: "Kokapet, Hyderabad",
      price: "₹1.75 Cr",
      bedrooms: null,
      bathrooms: null,
      area: "500 sq. yards"
    },
    {
      id: "5",
      title: "Luxury Penthouse",
      location: "Film Nagar, Hyderabad",
      price: "₹6.5 Cr",
      bedrooms: 4,
      bathrooms: 5,
      area: "4200 sq. ft."
    },
    {
      id: "6",
      title: "Independent House",
      location: "Manikonda, Hyderabad",
      price: "₹1.95 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "2200 sq. ft."
    }
  ];

  const handlePropertyClick = (propertyId: string) => {
    // Navigate to properties page
    navigate('/properties', { state: { selectedPropertyId: propertyId } });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredProperties.map((property) => (
        <div 
          key={property.id} 
          onClick={() => handlePropertyClick(property.id)}
          className="cursor-pointer"
        >
          <TextPropertyCard 
            property={property}
            className="h-full transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>
      ))}
    </div>
  );
};
