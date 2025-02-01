import { useState, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  coordinates: [number, number]; // [latitude, longitude]
}

export const PropertyMap = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Example properties - replace with actual data from your Supabase database
  const properties: Property[] = [
    {
      id: "1",
      title: "Luxury Villa in Banjara Hills",
      location: "Banjara Hills, Hyderabad",
      price: 2500000,
      coordinates: [17.4156, 78.4347], // Banjara Hills coordinates
    },
    {
      id: "2",
      title: "Modern Office Space in HITEC City",
      location: "HITEC City, Hyderabad",
      price: 1800000,
      coordinates: [17.4435, 78.3772], // HITEC City coordinates
    },
  ];

  const mapClassName = isExpanded
    ? "fixed inset-4 z-50"
    : "h-[400px] w-full rounded-lg shadow-lg";

  // Use dynamic import for react-leaflet components
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={`relative ${mapClassName} bg-gray-100 flex items-center justify-center`}>
        <div className="animate-pulse">Loading map...</div>
      </div>
    );
  }

  // Dynamically import react-leaflet components
  const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');

  return (
    <div className={`relative ${mapClassName} transition-all duration-300`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-4 right-4 z-[400] bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
        aria-label={isExpanded ? "Minimize map" : "Maximize map"}
      >
        {isExpanded ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
      </button>
      
      <MapContainer
        center={[17.3850, 78.4867] as [number, number]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {properties.map((property) => (
          <Marker 
            key={property.id} 
            position={property.coordinates}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{property.title}</h3>
                <p className="text-sm text-gray-600">{property.location}</p>
                <p className="text-sm font-medium">₹{property.price.toLocaleString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};