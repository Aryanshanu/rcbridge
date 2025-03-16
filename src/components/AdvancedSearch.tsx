
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";

interface AdvancedSearchProps {
  onFilterChange?: (filters: Record<string, any>) => void;
}

export const AdvancedSearch = ({ onFilterChange }: AdvancedSearchProps) => {
  const [priceRange, setPriceRange] = useState([1000000, 10000000]); // ₹10L to ₹1Cr
  const [areaRange, setAreaRange] = useState([500, 5000]); // 500 sq.ft to 5000 sq.ft
  const [propertyType, setPropertyType] = useState("all");
  const [location, setLocation] = useState("");
  const [propertyStatus, setPropertyStatus] = useState("all");
  const [bedrooms, setBedrooms] = useState("any");
  const [bathrooms, setBathrooms] = useState("any");
  const [propertyAge, setPropertyAge] = useState("any");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  const formatPrice = (price: number): string => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const amenities = [
    { id: "pool", label: "Swimming Pool" },
    { id: "gym", label: "Gym" },
    { id: "security", label: "24/7 Security" },
    { id: "parking", label: "Parking" },
    { id: "garden", label: "Garden" },
    { id: "playground", label: "Playground" },
    { id: "school", label: "Near School" },
    { id: "hospital", label: "Near Hospital" },
  ];
  
  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenityId]);
    } else {
      setSelectedAmenities(selectedAmenities.filter(id => id !== amenityId));
    }
  };
  
  const handleSearch = () => {
    if (onFilterChange) {
      onFilterChange({
        propertyType,
        location,
        propertyStatus,
        priceRange,
        areaRange,
        bedrooms,
        bathrooms,
        propertyAge,
        amenities: selectedAmenities
      });
    }
  };
  
  const clearFilters = () => {
    setPriceRange([1000000, 10000000]);
    setAreaRange([500, 5000]);
    setPropertyType("all");
    setLocation("");
    setPropertyStatus("all");
    setBedrooms("any");
    setBathrooms("any");
    setPropertyAge("any");
    setSelectedAmenities([]);
    
    if (onFilterChange) {
      onFilterChange({});
    }
  };
  
  // Apply filters when form values change
  useEffect(() => {
    // Using a debounce to avoid too many filter operations
    const handler = setTimeout(() => {
      handleSearch();
    }, 500);
    
    return () => {
      clearTimeout(handler);
    };
  }, [propertyType, location, propertyStatus, priceRange, areaRange, bedrooms, bathrooms, propertyAge, selectedAmenities]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-in fade-in slide-in-from-top duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-purple-700">Find Your Dream Property</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilters}
          className="text-gray-500 hover:text-gray-700 flex items-center"
        >
          <X className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <Label className="text-gray-700 mb-2 block">Property Type</Label>
          <Select 
            value={propertyType} 
            onValueChange={setPropertyType}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="agricultural">Agricultural</SelectItem>
              <SelectItem value="undeveloped">Undeveloped Land</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-gray-700 mb-2 block">Location</Label>
          <Input 
            placeholder="Enter location" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-gray-50 border-gray-200"
          />
        </div>

        <div>
          <Label className="text-gray-700 mb-2 block">Property Status</Label>
          <Select 
            value={propertyStatus}
            onValueChange={setPropertyStatus}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
              <SelectItem value="development">Development</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label className="text-gray-700 mb-2 block">
            Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          </Label>
          <Slider 
            value={priceRange} 
            min={100000} 
            max={50000000} 
            step={100000}
            onValueChange={setPriceRange}
            className="mt-4"
          />
        </div>

        <div>
          <Label className="text-gray-700 mb-2 block">
            Area Range: {areaRange[0]} - {areaRange[1]} sq.ft
          </Label>
          <Slider 
            value={areaRange}
            min={100} 
            max={10000} 
            step={50}
            onValueChange={setAreaRange}
            className="mt-4"
          />
        </div>
      </div>

      <div className="mb-6">
        <Label className="text-gray-700 mb-2 block">Bedrooms & Bathrooms</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Select 
            value={bedrooms}
            onValueChange={setBedrooms}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Bedrooms</SelectItem>
              <SelectItem value="1">1+ Bedrooms</SelectItem>
              <SelectItem value="2">2+ Bedrooms</SelectItem>
              <SelectItem value="3">3+ Bedrooms</SelectItem>
              <SelectItem value="4">4+ Bedrooms</SelectItem>
              <SelectItem value="5">5+ Bedrooms</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={bathrooms}
            onValueChange={setBathrooms}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Bathrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Bathrooms</SelectItem>
              <SelectItem value="1">1+ Bathrooms</SelectItem>
              <SelectItem value="2">2+ Bathrooms</SelectItem>
              <SelectItem value="3">3+ Bathrooms</SelectItem>
              <SelectItem value="4">4+ Bathrooms</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={propertyAge}
            onValueChange={setPropertyAge}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Age</SelectItem>
              <SelectItem value="new">New Construction</SelectItem>
              <SelectItem value="5">Less than 5 years</SelectItem>
              <SelectItem value="10">Less than 10 years</SelectItem>
              <SelectItem value="20">Less than 20 years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-6">
        <Label className="text-gray-700 mb-2 block">Popular Amenities</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {amenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Checkbox 
                id={amenity.id} 
                checked={selectedAmenities.includes(amenity.id)}
                onCheckedChange={(checked) => 
                  handleAmenityChange(amenity.id, checked as boolean)
                }
                className="border-gray-300 text-purple-600"
              />
              <label
                htmlFor={amenity.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {amenity.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4" />
          Search Properties
        </Button>
      </div>
    </div>
  );
};
