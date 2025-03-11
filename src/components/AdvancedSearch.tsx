
import { useState } from "react";
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
import { Search } from "lucide-react";

export const AdvancedSearch = () => {
  const [priceRange, setPriceRange] = useState([1000000, 10000000]); // ₹10L to ₹1Cr
  const [areaRange, setAreaRange] = useState([500, 5000]); // 500 sq.ft to 5000 sq.ft
  
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-in fade-in slide-in-from-top duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <Label className="text-gray-700 mb-2 block">Property Type</Label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="agricultural">Agricultural</SelectItem>
              <SelectItem value="undeveloped">Undeveloped Land</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-gray-700 mb-2 block">Location</Label>
          <Input placeholder="Enter location" />
        </div>

        <div>
          <Label className="text-gray-700 mb-2 block">Property Status</Label>
          <Select defaultValue="all">
            <SelectTrigger>
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
            defaultValue={[1000000, 10000000]} 
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
            defaultValue={[500, 5000]} 
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
          <Select defaultValue="any">
            <SelectTrigger>
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

          <Select defaultValue="any">
            <SelectTrigger>
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

          <Select defaultValue="any">
            <SelectTrigger>
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

          <Select defaultValue="any">
            <SelectTrigger>
              <SelectValue placeholder="Stories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Stories</SelectItem>
              <SelectItem value="1">1 Story</SelectItem>
              <SelectItem value="2">2 Stories</SelectItem>
              <SelectItem value="3">3+ Stories</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-6">
        <Label className="text-gray-700 mb-2 block">Amenities</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {amenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Checkbox id={amenity.id} />
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
        <Button className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search Properties
        </Button>
      </div>
    </div>
  );
};
