import { useState } from "react";
import { TextPropertyCard } from "@/components/TextPropertyCard";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: string;
  description: string;
}

export const TextFeaturedProperties = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  
  const properties: Property[] = [
    {
      id: "1",
      title: "Luxury Villa in Jubilee Hills",
      location: "Road No. 10, Jubilee Hills, Hyderabad",
      price: "₹4.85 Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "4500 sq. ft.",
      description: "Magnificent villa with modern architecture, swimming pool and garden area. Close to Jubilee Hills Club and Filmnagar."
    },
    {
      id: "2",
      title: "Premium Apartment",
      location: "Somajiguda, Banjara Hills, Hyderabad",
      price: "₹2.45 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "2100 sq. ft.",
      description: "High-end apartment with premium amenities, 24/7 security and panoramic city views. Walking distance to GVK One Mall."
    },
    {
      id: "3",
      title: "Commercial Building",
      location: "HITEC City, Madhapur, Hyderabad",
      price: "₹16.8 Cr",
      bedrooms: null,
      bathrooms: 8,
      area: "12000 sq. ft.",
      description: "Prime commercial building suitable for IT/ITES companies with ample parking space. Near Mindspace IT Park and metro station."
    },
    {
      id: "4",
      title: "Residential Plot",
      location: "Kokapet, Hyderabad",
      price: "₹1.75 Cr",
      bedrooms: null,
      bathrooms: null,
      area: "500 sq. yards",
      description: "HMDA approved residential plot in a gated community with excellent connectivity to ORR and Financial District."
    },
    {
      id: "5",
      title: "Luxury Penthouse",
      location: "Film Nagar, Hyderabad",
      price: "₹6.5 Cr",
      bedrooms: 4,
      bathrooms: 5,
      area: "4200 sq. ft.",
      description: "Exclusive penthouse with private terrace, 360° city views and premium interiors. Near Ramanaidu Studios and Khairatabad."
    },
    {
      id: "6",
      title: "Independent House",
      location: "Manikonda, Hyderabad",
      price: "₹1.95 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "2200 sq. ft.",
      description: "Well-designed independent house with spacious rooms, modern fixtures and small garden. Close to Gachibowli."
    },
    {
      id: "7",
      title: "Office Space",
      location: "Begumpet, Hyderabad",
      price: "₹3.2 Cr",
      bedrooms: null,
      bathrooms: 4,
      area: "3000 sq. ft.",
      description: "Ready-to-move office space with modern interiors, conference rooms and dedicated parking. Near Begumpet Airport."
    },
    {
      id: "8",
      title: "Gated Community Villa",
      location: "Nallagandla, Hyderabad",
      price: "₹2.3 Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "3200 sq. ft.",
      description: "Beautiful villa in a prestigious gated community with club house, swimming pool and 24/7 security. Near BHEL and ISB."
    },
    {
      id: "9",
      title: "Premium Flats",
      location: "Miyapur, Hyderabad",
      price: "₹85 L",
      bedrooms: 3,
      bathrooms: 2,
      area: "1750 sq. ft.",
      description: "Spacious flats with modern amenities in a well-connected location. Close to metro station and IT corridor."
    },
    {
      id: "10",
      title: "Duplex Apartment",
      location: "Gachibowli, Hyderabad",
      price: "₹1.85 Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "2800 sq. ft.",
      description: "Elegant duplex apartment with premium fittings, modular kitchen and private terrace garden. Near major IT companies."
    },
    {
      id: "11",
      title: "Commercial Plot",
      location: "Uppal, Hyderabad",
      price: "₹3.5 Cr",
      bedrooms: null,
      bathrooms: null,
      area: "1000 sq. yards",
      description: "Prime commercial plot with excellent frontage and all approvals in place. Near metro station and Uppal junction."
    },
    {
      id: "12",
      title: "Premium Villa",
      location: "Kompally, Hyderabad",
      price: "₹1.6 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "2400 sq. ft.",
      description: "Stylish villa with modern architecture in North Hyderabad. Includes garden, car parking and servant quarters."
    },
    {
      id: "13",
      title: "Spacious 2BHK",
      location: "Kukatpally, Hyderabad",
      price: "₹62 L",
      bedrooms: 2,
      bathrooms: 2,
      area: "1250 sq. ft.",
      description: "Well-designed apartment with spacious rooms and modern amenities. Near KPHB Metro Station and JNTU."
    },
    {
      id: "14",
      title: "Agricultural Land",
      location: "Shamirpet, Hyderabad",
      price: "₹35 L per acre",
      bedrooms: null,
      bathrooms: null,
      area: "5 acres",
      description: "Fertile agricultural land with water facility suitable for farming or investment purposes. 30 minutes from Secunderabad."
    },
    {
      id: "15",
      title: "Designer Apartment",
      location: "Madhapur, Hyderabad",
      price: "₹1.2 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "1800 sq. ft.",
      description: "Premium apartment with designer interiors, high-end fixtures and amenities. Walking distance to Inorbit Mall and IT hub."
    },
    {
      id: "16",
      title: "Retail Space",
      location: "Ameerpet, Hyderabad",
      price: "₹1.8 Cr",
      bedrooms: null,
      bathrooms: 2,
      area: "1200 sq. ft.",
      description: "Prime retail space in high footfall area suitable for brands and showrooms. Near metro station and main road."
    },
    {
      id: "17",
      title: "Budget Home",
      location: "Chandanagar, Hyderabad",
      price: "₹55 L",
      bedrooms: 2,
      bathrooms: 2,
      area: "1100 sq. ft.",
      description: "Affordable well-constructed apartment in a good location with basic amenities. Close to IT corridor and schools."
    },
    {
      id: "18",
      title: "Heritage Bungalow",
      location: "Bolarum, Hyderabad",
      price: "₹3.2 Cr",
      bedrooms: 5,
      bathrooms: 5,
      area: "4800 sq. ft.",
      description: "Historic bungalow with colonial architecture on a large plot with mature garden. Near Parade Ground and Military area."
    },
    {
      id: "19",
      title: "Upcoming Township",
      location: "Srisailam Highway, Hyderabad",
      price: "₹45 L onwards",
      bedrooms: 3,
      bathrooms: 3,
      area: "1550 sq. ft. onwards",
      description: "Apartments in an upcoming township with extensive amenities including club house, sports facilities and shopping complex."
    },
    {
      id: "20",
      title: "Warehouse",
      location: "Medchal, Hyderabad",
      price: "₹4.2 Cr",
      bedrooms: null,
      bathrooms: 2,
      area: "15000 sq. ft.",
      description: "Modern warehouse facility with loading bays, office space and security. Excellent connectivity to ORR and NH44."
    },
    {
      id: "21",
      title: "Posh Flat",
      location: "Attapur, Hyderabad",
      price: "₹78 L",
      bedrooms: 3,
      bathrooms: 2,
      area: "1650 sq. ft.",
      description: "Well-maintained apartment in a prestigious society with good amenities. Near P.V Narasimha Rao Expressway."
    },
    {
      id: "22",
      title: "Farmhouse",
      location: "Shankarpally, Hyderabad",
      price: "₹2.8 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "1800 sq. ft. built-up on 1 acre",
      description: "Beautiful farmhouse with scenic surroundings, fruit orchard and swimming pool. Perfect for weekend getaways."
    },
    {
      id: "23",
      title: "Hilltop Villa",
      location: "Gandipet, Hyderabad",
      price: "₹3.6 Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "3800 sq. ft.",
      description: "Spectacular villa on an elevated plot offering panoramic lake views and cool breeze. Includes home theater and gym."
    },
    {
      id: "24",
      title: "Co-working Space",
      location: "Financial District, Hyderabad",
      price: "₹2.9 Cr",
      bedrooms: null,
      bathrooms: 6,
      area: "4500 sq. ft.",
      description: "Ready-fitted co-working space with high-speed internet, conference facilities and pantry area. Excellent investment opportunity."
    },
    {
      id: "25",
      title: "Ultra Luxury Flat",
      location: "Shaikpet, Hyderabad",
      price: "₹3.1 Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "3200 sq. ft.",
      description: "Ultra-luxury apartment with Italian marble flooring, German kitchen and smart home features. In a premium high-rise building."
    },
    {
      id: "26",
      title: "Senior Living",
      location: "Pocharam, Hyderabad",
      price: "₹75 L",
      bedrooms: 2,
      bathrooms: 2,
      area: "1250 sq. ft.",
      description: "Specifically designed senior living apartment with medical facilities, emergency response system and community activities."
    },
    {
      id: "27",
      title: "Smart Home",
      location: "Kondapur, Hyderabad",
      price: "₹1.5 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "2100 sq. ft.",
      description: "Tech-enabled smart home with automated lighting, security and climate control. Near Kothaguda Junction and IT companies."
    },
    {
      id: "28",
      title: "Industrial Plot",
      location: "Patancheru, Hyderabad",
      price: "₹5.5 Cr",
      bedrooms: null,
      bathrooms: null,
      area: "2000 sq. yards",
      description: "Industrial land with all approvals for setting up manufacturing facility. Located in designated industrial zone with good connectivity."
    },
    {
      id: "29",
      title: "Eco-friendly Home",
      location: "Gopanpally, Hyderabad",
      price: "₹1.25 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "1950 sq. ft.",
      description: "Sustainable home with solar panels, rainwater harvesting and energy-efficient design. Reduced carbon footprint and lower bills."
    },
    {
      id: "30",
      title: "Studio Apartment",
      location: "Bachupally, Hyderabad",
      price: "₹38 L",
      bedrooms: 1,
      bathrooms: 1,
      area: "650 sq. ft.",
      description: "Compact studio apartment ideal for singles or investment. In a community with shared amenities and good rental prospects."
    },
    {
      id: "31",
      title: "Bungalow Plot",
      location: "Narsingi, Hyderabad",
      price: "₹2.2 Cr",
      bedrooms: null,
      bathrooms: null,
      area: "800 sq. yards",
      description: "Premium plot in a gated layout approved for bungalow construction. Close to Financial District and ORR."
    },
    {
      id: "32",
      title: "Hostel Building",
      location: "Sainikpuri, Hyderabad",
      price: "₹3.8 Cr",
      bedrooms: 25,
      bathrooms: 15,
      area: "8000 sq. ft.",
      description: "Purpose-built hostel building currently operating with good occupancy. Excellent investment with steady returns."
    },
    {
      id: "33",
      title: "Multi-story House",
      location: "Bowenpally, Hyderabad",
      price: "₹1.65 Cr",
      bedrooms: 6,
      bathrooms: 6,
      area: "3200 sq. ft.",
      description: "Spacious G+2 house suitable for joint family or rental income. Each floor has separate entrance and utilities."
    },
    {
      id: "34",
      title: "River View Property",
      location: "Puppalaguda, Hyderabad",
      price: "₹2.1 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "2400 sq. ft.",
      description: "Beautiful apartment with unobstructed views of Musi River. Premium community with excellent amenities."
    },
    {
      id: "35",
      title: "Hospital Building",
      location: "Secunderabad, Hyderabad",
      price: "₹8.5 Cr",
      bedrooms: null,
      bathrooms: 12,
      area: "10000 sq. ft.",
      description: "Fully operational hospital building with all medical infrastructure in place. Excellent location with high visibility."
    },
    {
      id: "36",
      title: "Row Houses",
      location: "Mallampet, Hyderabad",
      price: "₹1.4 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "1800 sq. ft.",
      description: "Elegant row houses with modern design and independent car parking. Part of a well-maintained gated community."
    },
    {
      id: "37",
      title: "Restaurant Space",
      location: "Jubilee Hills CheckPost, Hyderabad",
      price: "₹4.2 Cr",
      bedrooms: null,
      bathrooms: 4,
      area: "3500 sq. ft.",
      description: "Ready-to-use restaurant space in high-profile location with all facilities and permissions. Previously housed a successful chain."
    },
    {
      id: "38",
      title: "Affordable Housing",
      location: "Nizampet, Hyderabad",
      price: "₹45 L",
      bedrooms: 2,
      bathrooms: 2,
      area: "1050 sq. ft.",
      description: "Budget-friendly apartment in a well-connected location with basic amenities. Ideal for first-time homebuyers."
    },
    {
      id: "39",
      title: "Rooftop Restaurant",
      location: "Hitech City, Hyderabad",
      price: "₹3.8 Cr",
      bedrooms: null,
      bathrooms: 3,
      area: "3200 sq. ft.",
      description: "Operational rooftop restaurant with panoramic city views, modern interiors and all licenses. Popular among IT professionals."
    },
    {
      id: "40",
      title: "Lake View Apartment",
      location: "Khajaguda, Hyderabad",
      price: "₹1.35 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "1950 sq. ft.",
      description: "Premium apartment with beautiful lake views and cool breeze. Located in a serene environment yet close to IT hub."
    },
    {
      id: "41",
      title: "School Building",
      location: "Yapral, Hyderabad",
      price: "₹6.5 Cr",
      bedrooms: null,
      bathrooms: 15,
      area: "20000 sq. ft.",
      description: "Functioning school building with classrooms, labs, playground and all facilities. Established institution with good reputation."
    },
    {
      id: "42",
      title: "Petrol Pump Land",
      location: "NH65, Hyderabad Outskirts",
      price: "₹4.8 Cr",
      bedrooms: null,
      bathrooms: null,
      area: "1500 sq. yards",
      description: "Highway-facing plot suitable for petrol pump with all necessary NOCs and approvals. High traffic location."
    },
    {
      id: "43",
 title: "Loft Apartment",
      location: "Kokapet, Hyderabad",
      price: "₹1.25 Cr",
      bedrooms: 2,
      bathrooms: 2,
      area: "1650 sq. ft.",
      description: "Modern loft-style apartment with double-height living space and mezzanine floor. Contemporary design with premium fittings."
    },
    {
      id: "44",
      title: "Golf View Villa",
      location: "Gachibowli, Hyderabad",
      price: "₹5.8 Cr",
      bedrooms: 4,
      bathrooms: 5,
      area: "5000 sq. ft.",
      description: "Luxurious villa overlooking the golf course with premium interiors, home theater and swimming pool. In an exclusive community."
    },
    {
      id: "45",
      title: "Cold Storage Facility",
      location: "Shamshabad, Hyderabad",
      price: "₹4.2 Cr",
      bedrooms: null,
      bathrooms: 2,
      area: "12000 sq. ft.",
      description: "Operational cold storage facility with modern refrigeration equipment. Near airport and highway for easy logistics."
    },
    {
      id: "46",
      title: "Premium Duplex",
      location: "Rajendra Nagar, Hyderabad",
      price: "₹1.1 Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "2200 sq. ft.",
      description: "Spacious duplex with modern interiors, double-height living space and private terrace. In a secure gated community."
    },
    {
      id: "47",
      title: "Tech Park Office",
      location: "Nanakramguda, Hyderabad",
      price: "₹5.2 Cr",
      bedrooms: null,
      bathrooms: 6,
      area: "5500 sq. ft.",
      description: "Corporate office space in a premium tech park with IT infrastructure, power backup and professional facilities. Near major MNCs."
    },
    {
      id: "48",
      title: "Forest View Apartment",
      location: "Lingampally, Hyderabad",
      price: "₹95 L",
      bedrooms: 3,
      bathrooms: 3,
      area: "1800 sq. ft.",
      description: "Serene apartment overlooking forest reserve with pollution-free environment. Ideal for nature lovers and families."
    },
    {
      id: "49",
      title: "Highway-facing Plot",
      location: "Adibatla, Hyderabad",
      price: "₹1.9 Cr",
      bedrooms: null,
      bathrooms: null,
      area: "600 sq. yards",
      description: "Commercial plot with high visibility on main highway. Suitable for showroom, restaurant or retail establishment."
    },
    {
      id: "50",
      title: "Luxury Service Apartment",
      location: "Tolichowki, Hyderabad",
      price: "₹1.45 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "2100 sq. ft.",
      description: "Fully furnished service apartment with hotel-like amenities including housekeeping, dining and concierge services."
    }
  ];

  const applyFilters = (filters: Record<string, any>) => {
    setActiveFilters(filters);
    
    let results = [...properties];
    
    if (filters.propertyType && filters.propertyType !== 'all') {
      results = results.filter(property => {
        if (filters.propertyType === 'residential') {
          return property.bedrooms && property.bedrooms > 0 && property.bedrooms <= 3;
        }
        if (filters.propertyType === 'commercial') {
          return property.bedrooms === null || property.bedrooms === 0;
        }
        if (filters.propertyType === 'luxury') {
          return property.bedrooms && property.bedrooms > 3;
        }
        return true;
      });
    }
    
    if (filters.location && filters.location.trim() !== '') {
      const locationQuery = filters.location.toLowerCase();
      results = results.filter(property => 
        property.location.toLowerCase().includes(locationQuery) ||
        property.title.toLowerCase().includes(locationQuery)
      );
    }
    
    if (filters.priceRange && filters.priceRange.length === 2) {
      results = results.filter(property => {
        let numericPrice = 0;
        const priceStr = property.price.replace('₹', '');
        
        if (priceStr.includes('Cr')) {
          numericPrice = parseFloat(priceStr.replace(' Cr', '')) * 10000000;
        } else if (priceStr.includes('L')) {
          numericPrice = parseFloat(priceStr.replace(' L', '')) * 100000;
        } else {
          numericPrice = parseFloat(priceStr);
        }
        
        return numericPrice >= filters.priceRange[0] && numericPrice <= filters.priceRange[1];
      });
    }
    
    if (filters.bedrooms && filters.bedrooms !== 'any') {
      const bedroomCount = parseInt(filters.bedrooms);
      results = results.filter(property => 
        property.bedrooms && property.bedrooms >= bedroomCount
      );
    }
    
    if (filters.bathrooms && filters.bathrooms !== 'any') {
      const bathroomCount = parseInt(filters.bathrooms);
      results = results.filter(property => 
        property.bathrooms && property.bathrooms >= bathroomCount
      );
    }
    
    setFilteredProperties(results);
  };

  const displayProperties = Object.keys(activeFilters).length > 0 ? filteredProperties : properties;

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {showFilters && (
        <div className="mb-6">
          <AdvancedSearch onFilterChange={applyFilters} />
        </div>
      )}
      
      {displayProperties.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No properties found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        displayProperties.map((property) => (
          <TextPropertyCard 
            key={property.id}
            property={{
              id: property.id,
              title: property.title,
              location: property.location,
              price: property.price,
              bedrooms: property.bedrooms || undefined,
              bathrooms: property.bathrooms || undefined,
              area: property.area
            }}
            className="hover:bg-gray-50 transition-colors duration-300"
          />
        ))
      )}
    </div>
  );
};

