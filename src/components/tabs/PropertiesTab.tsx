
import { useState, useEffect } from "react";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { TextPropertyCard } from "@/components/TextPropertyCard";
import { PropertiesTable } from "@/components/tables/PropertiesTable";
import { Filter, ChevronDown, ChevronUp, LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Toggle } from "@/components/ui/toggle";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: string;
  description: string;
  type?: string;
}

interface PropertiesTabProps {
  selectedPropertyId?: string;
  filters?: Record<string, any>;
  viewMode?: "grid" | "table";
  isDarkMode?: boolean;
}

export const PropertiesTab = ({ selectedPropertyId, filters = {}, viewMode: initialViewMode = "grid", isDarkMode = false }: PropertiesTabProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">(initialViewMode);
  
  // Form states for the inquiry dialog
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  
  const { toast } = useToast();
  
  // This is the source of truth for all properties
  const properties: Property[] = [
    {
      id: "1",
      title: "Luxury Villa in Jubilee Hills",
      location: "Road No. 10, Jubilee Hills, Hyderabad",
      price: "₹4.85 Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "4500 sq. ft.",
      description: "Magnificent villa with modern architecture, swimming pool and garden area. Close to Jubilee Hills Club and Filmnagar.",
      type: "luxury"
    },
    {
      id: "2",
      title: "Premium Apartment",
      location: "Somajiguda, Banjara Hills, Hyderabad",
      price: "₹2.45 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "2100 sq. ft.",
      description: "High-end apartment with premium amenities, 24/7 security and panoramic city views. Walking distance to GVK One Mall.",
      type: "residential"
    },
    {
      id: "3",
      title: "Commercial Building",
      location: "HITEC City, Madhapur, Hyderabad",
      price: "₹16.8 Cr",
      bedrooms: null,
      bathrooms: 8,
      area: "12000 sq. ft.",
      description: "Prime commercial building suitable for IT/ITES companies with ample parking space. Near Mindspace IT Park and metro station.",
      type: "commercial"
    },
    {
      id: "4",
      title: "Residential Plot",
      location: "Kokapet, Hyderabad",
      price: "₹1.75 Cr",
      bedrooms: null,
      bathrooms: null,
      area: "500 sq. yards",
      description: "HMDA approved residential plot in a gated community with excellent connectivity to ORR and Financial District.",
      type: "undeveloped"
    },
    {
      id: "5",
      title: "Luxury Penthouse",
      location: "Film Nagar, Hyderabad",
      price: "₹6.5 Cr",
      bedrooms: 4,
      bathrooms: 5,
      area: "4200 sq. ft.",
      description: "Exclusive penthouse with private terrace, 360° city views and premium interiors. Near Ramanaidu Studios and Khairatabad.",
      type: "luxury"
    },
    {
      id: "6",
      title: "Independent House",
      location: "Manikonda, Hyderabad",
      price: "₹1.95 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "2200 sq. ft.",
      description: "Well-designed independent house with spacious rooms, modern fixtures and small garden. Close to Gachibowli.",
      type: "residential"
    },
    {
      id: "7",
      title: "Office Space",
      location: "Begumpet, Hyderabad",
      price: "₹3.2 Cr",
      bedrooms: null,
      bathrooms: 4,
      area: "3000 sq. ft.",
      description: "Ready-to-move office space with modern interiors, conference rooms and dedicated parking. Near Begumpet Airport.",
      type: "commercial"
    },
    {
      id: "8",
      title: "Gated Community Villa",
      location: "Nallagandla, Hyderabad",
      price: "₹2.3 Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "3200 sq. ft.",
      description: "Beautiful villa in a prestigious gated community with club house, swimming pool and 24/7 security. Near BHEL and ISB.",
      type: "residential"
    },
    {
      id: "9",
      title: "Premium Flats",
      location: "Miyapur, Hyderabad",
      price: "₹85 L",
      bedrooms: 3,
      bathrooms: 2,
      area: "1750 sq. ft.",
      description: "Spacious flats with modern amenities in a well-connected location. Close to metro station and IT corridor.",
      type: "residential"
    },
    {
      id: "10",
      title: "Duplex Apartment",
      location: "Gachibowli, Hyderabad",
      price: "₹1.85 Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "2800 sq. ft.",
      description: "Elegant duplex apartment with premium fittings, modular kitchen and private terrace garden. Near major IT companies.",
      type: "residential"
    },
    {
      id: "11",
      title: "Commercial Plot",
      location: "Uppal, Hyderabad",
      price: "₹3.5 Cr",
      bedrooms: null,
      bathrooms: null,
      area: "1000 sq. yards",
      description: "Prime commercial plot with excellent frontage and all approvals in place. Near metro station and Uppal junction.",
      type: "commercial"
    },
    {
      id: "12",
      title: "Premium Villa",
      location: "Kompally, Hyderabad",
      price: "₹1.6 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "2400 sq. ft.",
      description: "Stylish villa with modern architecture in North Hyderabad. Includes garden, car parking and servant quarters.",
      type: "residential"
    },
    {
      id: "13",
      title: "Spacious 2BHK",
      location: "Kukatpally, Hyderabad",
      price: "₹62 L",
      bedrooms: 2,
      bathrooms: 2,
      area: "1250 sq. ft.",
      description: "Well-designed apartment with spacious rooms and modern amenities. Near KPHB Metro Station and JNTU.",
      type: "residential"
    },
    {
      id: "14",
      title: "Agricultural Land",
      location: "Shamirpet, Hyderabad",
      price: "₹35 L per acre",
      bedrooms: null,
      bathrooms: null,
      area: "5 acres",
      description: "Fertile agricultural land with water facility suitable for farming or investment purposes. 30 minutes from Secunderabad.",
      type: "agricultural"
    },
    {
      id: "15",
      title: "Designer Apartment",
      location: "Madhapur, Hyderabad",
      price: "₹1.2 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "1800 sq. ft.",
      description: "Premium apartment with designer interiors, high-end fixtures and amenities. Walking distance to Inorbit Mall and IT hub.",
      type: "residential"
    },
    {
      id: "16",
      title: "Retail Space",
      location: "Ameerpet, Hyderabad",
      price: "₹1.8 Cr",
      bedrooms: null,
      bathrooms: 2,
      area: "1200 sq. ft.",
      description: "Prime retail space in high footfall area suitable for brands and showrooms. Near metro station and main road.",
      type: "commercial"
    },
    {
      id: "17",
      title: "Budget Home",
      location: "Chandanagar, Hyderabad",
      price: "₹55 L",
      bedrooms: 2,
      bathrooms: 2,
      area: "1100 sq. ft.",
      description: "Affordable well-constructed apartment in a good location with basic amenities. Close to IT corridor and schools.",
      type: "residential"
    },
    {
      id: "18",
      title: "Heritage Bungalow",
      location: "Bolarum, Hyderabad",
      price: "₹3.2 Cr",
      bedrooms: 5,
      bathrooms: 5,
      area: "4800 sq. ft.",
      description: "Historic bungalow with colonial architecture on a large plot with mature garden. Near Parade Ground and Military area.",
      type: "luxury"
    },
    {
      id: "19",
      title: "Upcoming Township",
      location: "Srisailam Highway, Hyderabad",
      price: "₹45 L onwards",
      bedrooms: 3,
      bathrooms: 3,
      area: "1550 sq. ft. onwards",
      description: "Apartments in an upcoming township with extensive amenities including club house, sports facilities and shopping complex.",
      type: "residential"
    },
    {
      id: "20",
      title: "Warehouse",
      location: "Medchal, Hyderabad",
      price: "₹4.2 Cr",
      bedrooms: null,
      bathrooms: 2,
      area: "15000 sq. ft.",
      description: "Modern warehouse facility with loading bays, office space and security. Excellent connectivity to ORR and NH44.",
      type: "industrial"
    },
    {
      id: "21",
      title: "Posh Flat",
      location: "Attapur, Hyderabad",
      price: "₹78 L",
      bedrooms: 3,
      bathrooms: 2,
      area: "1650 sq. ft.",
      description: "Well-maintained apartment in a prestigious society with good amenities. Near P.V Narasimha Rao Expressway.",
      type: "residential"
    },
    {
      id: "22",
      title: "Farmhouse",
      location: "Shankarpally, Hyderabad",
      price: "₹2.8 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "1800 sq. ft. built-up on 1 acre",
      description: "Beautiful farmhouse with scenic surroundings, fruit orchard and swimming pool. Perfect for weekend getaways.",
      type: "agricultural"
    },
    {
      id: "23",
      title: "Hilltop Villa",
      location: "Gandipet, Hyderabad",
      price: "₹3.6 Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "3800 sq. ft.",
      description: "Spectacular villa on an elevated plot offering panoramic lake views and cool breeze. Includes home theater and gym.",
      type: "luxury"
    },
    {
      id: "24",
      title: "Co-working Space",
      location: "Financial District, Hyderabad",
      price: "₹2.9 Cr",
      bedrooms: null,
      bathrooms: 6,
      area: "4500 sq. ft.",
      description: "Ready-fitted co-working space with high-speed internet, conference facilities and pantry area. Excellent investment opportunity.",
      type: "commercial"
    },
    {
      id: "25",
      title: "Ultra Luxury Flat",
      location: "Shaikpet, Hyderabad",
      price: "₹3.1 Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "3200 sq. ft.",
      description: "Ultra-luxury apartment with Italian marble flooring, German kitchen and smart home features. In a premium high-rise building.",
      type: "luxury"
    },
    {
      id: "26",
      title: "Senior Living",
      location: "Pocharam, Hyderabad",
      price: "₹75 L",
      bedrooms: 2,
      bathrooms: 2,
      area: "1250 sq. ft.",
      description: "Specifically designed senior living apartment with medical facilities, emergency response system and community activities.",
      type: "residential"
    },
    {
      id: "27",
      title: "Smart Home",
      location: "Kondapur, Hyderabad",
      price: "₹1.5 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "2100 sq. ft.",
      description: "Tech-enabled smart home with automated lighting, security and climate control. Near Kothaguda Junction and IT companies.",
      type: "residential"
    },
    {
      id: "28",
      title: "Industrial Plot",
      location: "Patancheru, Hyderabad",
      price: "₹5.5 Cr",
      bedrooms: null,
      bathrooms: null,
      area: "2000 sq. yards",
      description: "Industrial land with all approvals for setting up manufacturing facility. Located in designated industrial zone with good connectivity.",
      type: "industrial"
    },
    {
      id: "29",
      title: "Eco-friendly Home",
      location: "Gopanpally, Hyderabad",
      price: "₹1.25 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "1950 sq. ft.",
      description: "Sustainable home with solar panels, rainwater harvesting and energy-efficient design. Reduced carbon footprint and lower bills.",
      type: "residential"
    },
    {
      id: "30",
      title: "Studio Apartment",
      location: "Bachupally, Hyderabad",
      price: "₹38 L",
      bedrooms: 1,
      bathrooms: 1,
      area: "650 sq. ft.",
      description: "Compact studio apartment ideal for singles or investment. In a community with shared amenities and good rental prospects.",
      type: "residential"
    },
    {
      id: "31",
      title: "Bungalow Plot",
      location: "Narsingi, Hyderabad",
      price: "₹2.2 Cr",
      bedrooms: null,
      bathrooms: null,
      area: "800 sq. yards",
      description: "Premium plot in a gated layout approved for bungalow construction. Close to Financial District and ORR.",
      type: "undeveloped"
    },
    {
      id: "32",
      title: "Hostel Building",
      location: "Sainikpuri, Hyderabad",
      price: "₹3.8 Cr",
      bedrooms: 25,
      bathrooms: 15,
      area: "8000 sq. ft.",
      description: "Purpose-built hostel building currently operating with good occupancy. Excellent investment with steady returns.",
      type: "commercial"
    },
    {
      id: "33",
      title: "Multi-story House",
      location: "Bowenpally, Hyderabad",
      price: "₹1.65 Cr",
      bedrooms: 6,
      bathrooms: 6,
      area: "3200 sq. ft.",
      description: "Spacious G+2 house suitable for joint family or rental income. Each floor has separate entrance and utilities.",
      type: "residential"
    },
    {
      id: "34",
      title: "River View Property",
      location: "Puppalaguda, Hyderabad",
      price: "₹2.1 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "2400 sq. ft.",
      description: "Beautiful apartment with unobstructed views of Musi River. Premium community with excellent amenities.",
      type: "residential"
    },
    {
      id: "35",
      title: "Hospital Building",
      location: "Secunderabad, Hyderabad",
      price: "₹8.5 Cr",
      bedrooms: null,
      bathrooms: 12,
      area: "10000 sq. ft.",
      description: "Fully operational hospital building with all medical infrastructure in place. Excellent location with high visibility.",
      type: "commercial"
    },
    {
      id: "36",
      title: "Row Houses",
      location: "Mallampet, Hyderabad",
      price: "₹1.4 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "1800 sq. ft.",
      description: "Elegant row houses with modern design and independent car parking. Part of a well-maintained gated community.",
      type: "residential"
    },
    {
      id: "37",
      title: "Restaurant Space",
      location: "Jubilee Hills CheckPost, Hyderabad",
      price: "₹4.2 Cr",
      bedrooms: null,
      bathrooms: 4,
      area: "3500 sq. ft.",
      description: "Ready-to-use restaurant space in high-profile location with all facilities and permissions. Previously housed a successful chain.",
      type: "commercial"
    },
    {
      id: "38",
      title: "Affordable Housing",
      location: "Nizampet, Hyderabad",
      price: "₹45 L",
      bedrooms: 2,
      bathrooms: 2,
      area: "1050 sq. ft.",
      description: "Budget-friendly apartment in a well-connected location with basic amenities. Ideal for first-time homebuyers.",
      type: "residential"
    },
    {
      id: "39",
      title: "Rooftop Restaurant",
      location: "Hitech City, Hyderabad",
      price: "₹3.8 Cr",
      bedrooms: null,
      bathrooms: 3,
      area: "3200 sq. ft.",
      description: "Operational rooftop restaurant with panoramic city views, modern interiors and all licenses. Popular among IT professionals.",
      type: "commercial"
    },
    {
      id: "40",
      title: "Lake View Apartment",
      location: "Khajaguda, Hyderabad",
      price: "₹1.35 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "1950 sq. ft.",
      description: "Premium apartment with beautiful lake views and cool breeze. Located in a serene environment yet close to IT hub.",
      type: "residential"
    },
    {
      id: "41",
      title: "School Building",
      location: "Yapral, Hyderabad",
      price: "₹6.5 Cr",
      bedrooms: null,
      bathrooms: 15,
      area: "20000 sq. ft.",
      description: "Functioning school building with classrooms, labs, playground and all facilities. Established institution with good reputation.",
      type: "commercial"
    },
    {
      id: "42",
      title: "Petrol Pump Land",
      location: "NH65, Hyderabad Outskirts",
      price: "₹4.8 Cr",
      bedrooms: null,
      bathrooms: null,
      area: "1500 sq. yards",
      description: "Highway-facing plot suitable for petrol pump with all necessary NOCs and approvals. High traffic location.",
      type: "commercial"
    },
    {
      id: "43",
      title: "Loft Apartment",
      location: "Kokapet, Hyderabad",
      price: "₹1.25 Cr",
      bedrooms: 2,
      bathrooms: 2,
      area: "1650 sq. ft.",
      description: "Modern loft-style apartment with double-height living space and mezzanine floor. Contemporary design with premium fittings.",
      type: "residential"
    },
    {
      id: "44",
      title: "Golf View Villa",
      location: "Gachibowli, Hyderabad",
      price: "₹5.8 Cr",
      bedrooms: 4,
      bathrooms: 5,
      area: "5000 sq. ft.",
      description: "Luxurious villa overlooking the golf course with premium interiors, home theater and swimming pool. In an exclusive community.",
      type: "luxury"
    },
    {
      id: "45",
      title: "Cold Storage Facility",
      location: "Shamshabad, Hyderabad",
      price: "₹4.2 Cr",
      bedrooms: null,
      bathrooms: 2,
      area: "12000 sq. ft.",
      description: "Operational cold storage facility with modern refrigeration equipment. Near airport and highway for easy logistics.",
      type: "industrial"
    },
    {
      id: "46",
      title: "Premium Duplex",
      location: "Rajendra Nagar, Hyderabad",
      price: "₹1.1 Cr",
      bedrooms: 4,
      bathrooms: 4,
      area: "2200 sq. ft.",
      description: "Spacious duplex with modern interiors, double-height living space and private terrace. In a secure gated community.",
      type: "residential"
    },
    {
      id: "47",
      title: "Tech Park Office",
      location: "Nanakramguda, Hyderabad",
      price: "₹5.2 Cr",
      bedrooms: null,
      bathrooms: 6,
      area: "5500 sq. ft.",
      description: "Corporate office space in a premium tech park with IT infrastructure, power backup and professional facilities. Near major MNCs.",
      type: "commercial"
    },
    {
      id: "48",
      title: "Forest View Apartment",
      location: "Lingampally, Hyderabad",
      price: "₹95 L",
      bedrooms: 3,
      bathrooms: 3,
      area: "1800 sq. ft.",
      description: "Serene apartment overlooking forest reserve with pollution-free environment. Ideal for nature lovers and families.",
      type: "residential"
    },
    {
      id: "49",
      title: "Highway-facing Plot",
      location: "Adibatla, Hyderabad",
      price: "₹1.9 Cr",
      bedrooms: null,
      bathrooms: null,
      area: "600 sq. yards",
      description: "Commercial plot with high visibility on main highway. Suitable for showroom, restaurant or retail establishment.",
      type: "commercial"
    },
    {
      id: "50",
      title: "Luxury Service Apartment",
      location: "Tolichowki, Hyderabad",
      price: "₹1.45 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: "2100 sq. ft.",
      description: "Fully furnished service apartment with hotel-like amenities including housekeeping, dining and concierge services.",
      type: "luxury"
    }
  ];

  useEffect(() => {
    if (selectedPropertyId) {
      const foundProperty = properties.find(p => p.id === selectedPropertyId);
      if (foundProperty) {
        handleWantToKnowMore(foundProperty);
        toast({
          title: "Property Selected",
          description: `You selected: ${foundProperty.title}`,
          duration: 3000,
        });
      }
    }

    // Apply filters passed from parent component
    if (filters && Object.keys(filters).length > 0) {
      applyFilters(filters);
    } else {
      setFilteredProperties(properties);
    }
  }, [selectedPropertyId, filters]);

  // Set initial view mode from props
  useEffect(() => {
    if (initialViewMode) {
      setViewMode(initialViewMode);
    }
  }, [initialViewMode]);

  const handleInquirySubmit = () => {
    toast({
      title: "Inquiry Submitted",
      description: `Thank you ${name}! We'll contact you about "${selectedProperty?.title}" soon.`,
      duration: 5000,
    });
    
    console.log("Property inquiry:", {
      property: selectedProperty,
      name,
      email,
      phone,
      message
    });
    
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setSelectedProperty(null);
  };
  
  const handleWantToKnowMore = (property: Property) => {
    setSelectedProperty(property);
    setMessage(`I'm interested in the ${property.title} in ${property.location}.`);
  };

  const applyFilters = (filters: Record<string, any>) => {
    setActiveFilters(filters);
    
    let results = [...properties];
    
    if (filters.propertyType && filters.propertyType !== 'all') {
      results = results.filter(property => property.type === filters.propertyType);
    }
    
    if (filters.location && filters.location.trim() !== '') {
      const locationQuery = filters.location.toLowerCase();
      results = results.filter(property => 
        property.location.toLowerCase().includes(locationQuery) ||
        property.title.toLowerCase().includes(locationQuery)
      );
    }

    // Apply search query filter
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const searchQuery = filters.searchQuery.toLowerCase();
      results = results.filter(property => 
        property.location.toLowerCase().includes(searchQuery) ||
        property.title.toLowerCase().includes(searchQuery) ||
        property.description.toLowerCase().includes(searchQuery) ||
        (property.type && property.type.toLowerCase().includes(searchQuery))
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

    // Type filter from quick filters
    if (filters.type && filters.type.trim() !== '') {
      const typeFilter = filters.type.toLowerCase();
      results = results.filter(property => 
        property.type && property.type.toLowerCase() === typeFilter
      );
    }
    
    setFilteredProperties(results);
  };

  const displayProperties = Object.keys(activeFilters).length > 0 ? filteredProperties : properties;

  return (
    <div className={`space-y-6 ${isDarkMode ? 'text-gray-200' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Toggle 
            pressed={viewMode === "grid"}
            onPressedChange={() => setViewMode("grid")}
            aria-label="Grid view"
            className={isDarkMode ? "bg-gray-800 data-[state=on]:bg-blue-900 hover:bg-gray-700" : ""}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            Grid
          </Toggle>
          <Toggle 
            pressed={viewMode === "table"}
            onPressedChange={() => setViewMode("table")}
            aria-label="Table view"
            className={isDarkMode ? "bg-gray-800 data-[state=on]:bg-blue-900 hover:bg-gray-700" : ""}
          >
            <LayoutList className="h-4 w-4 mr-1" />
            Table
          </Toggle>
        </div>
        <Button 
          variant="outline" 
          className={`flex items-center gap-2 ${isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : ''}`}
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
        <div className={`p-8 rounded-lg shadow-md text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>No properties found</h3>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Try adjusting your filters to see more results.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProperties.map((property) => (
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
              onWantToKnowMore={() => handleWantToKnowMore(property)}
              className={`h-full hover:shadow-lg transition-shadow duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}
            />
          ))}
        </div>
      ) : (
        <PropertiesTable 
          properties={displayProperties} 
          onPropertySelect={handleWantToKnowMore} 
        />
      )}
      
      <Dialog open={selectedProperty !== null} onOpenChange={(open) => !open && setSelectedProperty(null)}>
        <DialogContent className={`sm:max-w-[500px] ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : ''}`}>
          <DialogHeader>
            <DialogTitle className="text-xl">
              Request Information
            </DialogTitle>
            <DialogDescription className={isDarkMode ? 'text-gray-400' : ''}>
              Fill out this form to get more information about <span className="font-semibold">{selectedProperty?.title}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Your Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter your name"
                className={`mt-1 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-500' : ''}`}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email"
                className={`mt-1 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-500' : ''}`}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Phone Number</Label>
              <Input 
                id="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Enter your phone number"
                className={`mt-1 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-500' : ''}`}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="message" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Message</Label>
              <Textarea 
                id="message" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="What would you like to know about this property?"
                className={`mt-1 h-24 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-500' : ''}`}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSelectedProperty(null)}
              className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleInquirySubmit} 
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
