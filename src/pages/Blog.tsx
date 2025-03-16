
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Hyderabad Real Estate Market: Q3 2023 Insights",
      date: "October 10, 2023",
      excerpt: "The Hyderabad real estate market continues to show robust growth with property prices in Jubilee Hills and Banjara Hills appreciating by 15% year-over-year, outperforming national averages.",
      category: "Market Analysis"
    },
    {
      id: 2,
      title: "Investment Hotspots: Financial District and Kokapet Leading the Pack",
      date: "September 22, 2023",
      excerpt: "With the expansion of the Financial District and improved ORR connectivity, Kokapet and Narsingi continue to offer excellent returns for property investors with 18% annual appreciation.",
      category: "Investment"
    },
    {
      id: 3,
      title: "RERA Implementation in Telangana: Key Updates for 2023",
      date: "September 5, 2023",
      excerpt: "Recent amendments to Telangana's RERA implementation bring important changes for property buyers and sellers. Learn how these affect your transactions and ensure compliance.",
      category: "Regulations"
    },
    {
      id: 4,
      title: "Smart Homes in Hyderabad: The New Standard in Luxury Housing",
      date: "August 28, 2023",
      excerpt: "The luxury housing segment in Hyderabad has embraced smart home technology, with developments in Jubilee Hills and Gachibowli offering fully integrated home automation systems.",
      category: "Luxury Real Estate"
    },
    {
      id: 5,
      title: "Hyderabad's IT Corridor: Driving Commercial Real Estate Revival",
      date: "August 12, 2023",
      excerpt: "Commercial properties along the IT corridor from Gachibowli to Financial District have seen occupancy rates rise to 92%, with rental yields averaging 6-7% annually.",
      category: "Commercial"
    },
    {
      id: 6,
      title: "Metro Line 2 Extension: Impact on Property Values in West Hyderabad",
      date: "July 30, 2023",
      excerpt: "Areas connected by Hyderabad's Metro Line 2 extension have seen property values increase by up to 22%. We analyze which neighborhoods in Kukatpally and Miyapur will benefit next.",
      category: "Infrastructure"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Blog | RC Bridge" description="Latest real estate news and insights from Hyderabad and India" />
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
              <BreadcrumbPage>Blog</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">Hyderabad Real Estate Insights</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest trends, market analysis, and investment opportunities in Hyderabad and across India
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                  {post.category}
                </span>
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-500 text-sm mb-4">Posted on {post.date}</p>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <Link to={`/blog/${post.id}`} className="text-primary font-medium hover:underline">
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Trending Topics in Indian Real Estate</h2>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-primary/10 hover:text-primary cursor-pointer">
              #HyderabadRealEstate
            </span>
            <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-primary/10 hover:text-primary cursor-pointer">
              #FinancialDistrict
            </span>
            <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-primary/10 hover:text-primary cursor-pointer">
              #TelanaganaRERA
            </span>
            <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-primary/10 hover:text-primary cursor-pointer">
              #GachibowliProperties
            </span>
            <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-primary/10 hover:text-primary cursor-pointer">
              #SmartHomes
            </span>
            <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-primary/10 hover:text-primary cursor-pointer">
              #HyderabadMetro
            </span>
            <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-primary/10 hover:text-primary cursor-pointer">
              #KokapetLand
            </span>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
