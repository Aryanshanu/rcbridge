
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeographicMapDisplay } from '@/components/GeographicMapDisplay';
import { PropertyCard } from '@/components/PropertyCard';
import { AbstractPropertyCard } from '@/components/AbstractPropertyCard';

export const RealEstateDataVisualizations = () => {
  const [selectedLocation, setSelectedLocation] = useState('Hyderabad');
  
  const locations = [
    'Hyderabad',
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Chennai'
  ];
  
  const sampleProperties = [
    {
      id: 'viz-1',
      title: 'Premium Villa in Jubilee Hills',
      location: 'Jubilee Hills, Hyderabad',
      price: '₹3.8Cr',
      bedrooms: 4,
      bathrooms: 4,
      area: '4200 sq.ft',
    },
    {
      id: 'viz-2',
      title: 'Modern Apartment in Financial District',
      location: 'Financial District, Hyderabad',
      price: '₹1.2Cr',
      bedrooms: 3,
      bathrooms: 2,
      area: '1800 sq.ft',
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-center">Real Estate Market Insights</h2>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {locations.map((location) => (
            <button
              key={location}
              onClick={() => setSelectedLocation(location)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedLocation === location
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="pricing" className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-6">
          <TabsTrigger value="pricing">Price Trends</TabsTrigger>
          <TabsTrigger value="density">Property Density</TabsTrigger>
          <TabsTrigger value="schools">School Districts</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pricing" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GeographicMapDisplay
                location={selectedLocation}
                mapType="pricing"
                title={`${selectedLocation} Property Price Trends`}
                description="Color gradient represents average price per square foot across neighborhoods"
              />
            </div>
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-semibold">Featured Properties</h3>
              <p className="text-gray-600">Explore highlighted properties in high-value areas of {selectedLocation}</p>
              <div className="space-y-4">
                {sampleProperties.map(property => (
                  <AbstractPropertyCard key={property.id} property={property} className="shadow-sm" />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="density" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GeographicMapDisplay
                location={selectedLocation}
                mapType="density"
                title={`${selectedLocation} Property Density Map`}
                description="Visualization of property concentration in urban regions"
              />
            </div>
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-semibold">Development Areas</h3>
              <p className="text-gray-600">Areas with highest new development activity in {selectedLocation}</p>
              <div className="space-y-4">
                {sampleProperties.map(property => (
                  <AbstractPropertyCard key={property.id} property={property} className="shadow-sm" />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="schools" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GeographicMapDisplay
                location={selectedLocation}
                mapType="schools"
                title={`${selectedLocation} School District Boundaries`}
                description="Top-rated school zones highlighted for family-friendly properties"
              />
            </div>
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-semibold">School Zone Properties</h3>
              <p className="text-gray-600">Premium homes in top school districts of {selectedLocation}</p>
              <div className="space-y-4">
                {sampleProperties.map(property => (
                  <AbstractPropertyCard key={property.id} property={property} className="shadow-sm" />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="amenities" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GeographicMapDisplay
                location={selectedLocation}
                mapType="amenities"
                title={`${selectedLocation} Neighborhood Amenities`}
                description="Parks, shopping, and transportation access visualization"
              />
            </div>
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-semibold">High Convenience Properties</h3>
              <p className="text-gray-600">Properties with excellent amenity access in {selectedLocation}</p>
              <div className="space-y-4">
                {sampleProperties.map(property => (
                  <AbstractPropertyCard key={property.id} property={property} className="shadow-sm" />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
