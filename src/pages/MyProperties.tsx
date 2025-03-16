
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home, Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const MyProperties = () => {
  const [filter, setFilter] = useState("all");
  
  // Mock data for properties
  const properties = [
    {
      id: "prop1",
      title: "Luxury Villa in Banjara Hills",
      status: "active",
      type: "sale",
      price: "₹2.5Cr",
      location: "Banjara Hills, Hyderabad",
      createdAt: "2023-05-15",
      views: 128,
      inquiries: 12
    },
    {
      id: "prop2",
      title: "Modern Office Space in HITEC City",
      status: "pending",
      type: "sale",
      price: "₹1.8Cr",
      location: "HITEC City, Hyderabad",
      createdAt: "2023-06-20",
      views: 84,
      inquiries: 7
    },
    {
      id: "prop3",
      title: "Premium Apartment in Jubilee Hills",
      status: "active",
      type: "rent",
      price: "₹95K/month",
      location: "Jubilee Hills, Hyderabad",
      createdAt: "2023-07-05",
      views: 156,
      inquiries: 19
    }
  ];
  
  const filteredProperties = filter === "all" 
    ? properties 
    : properties.filter(property => property.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="My Properties | RC Bridge" description="Manage your property listings" />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4 mr-1" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>My Properties</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
            <p className="text-gray-600">
              Manage and track all your property listings
            </p>
          </div>
          <Button className="mt-4 sm:mt-0 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New Property
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Tabs defaultValue="all" onValueChange={setFilter}>
            <div className="px-4 sm:px-6 pt-4 border-b border-gray-200">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100">
                <TabsTrigger value="all">All ({properties.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({properties.filter(p => p.status === 'active').length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({properties.filter(p => p.status === 'pending').length})</TabsTrigger>
                <TabsTrigger value="inactive">Inactive ({properties.filter(p => p.status === 'inactive').length})</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value={filter} className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-6 py-3">Property</th>
                      <th className="px-6 py-3">Date Added</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Stats</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProperties.length > 0 ? (
                      filteredProperties.map((property) => (
                        <tr key={property.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-medium">{property.title}</p>
                            <p className="text-sm text-gray-500">{property.location}</p>
                            <p className="text-sm font-medium text-gray-900">{property.price} • {property.type === 'sale' ? 'For Sale' : 'For Rent'}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(property.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              property.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : property.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <p><span className="font-medium">{property.views}</span> Views</p>
                            <p><span className="font-medium">{property.inquiries}</span> Inquiries</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button className="text-gray-400 hover:text-gray-600" title="View">
                                <Eye className="h-5 w-5" />
                              </button>
                              <button className="text-blue-400 hover:text-blue-600" title="Edit">
                                <Edit className="h-5 w-5" />
                              </button>
                              <button className="text-red-400 hover:text-red-600" title="Delete">
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          No properties found. <Link to="/add-property" className="text-primary hover:underline">Add a new property</Link>.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyProperties;
