
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
      title: "Hyderabad Real Estate Market: Q2 2025 Insights",
      date: "June 15, 2025",
      excerpt: "The Hyderabad real estate market continues to show robust growth with property prices in key areas like Jubilee Hills and Banjara Hills appreciating by 18% year-over-year.",
      category: "Market Analysis"
    },
    {
      id: 2,
      title: "Investment Hotspots: Why HITEC City Remains a Top Choice",
      date: "May 28, 2025",
      excerpt: "With the expansion of IT corridors and improved infrastructure, HITEC City and Financial District continue to offer excellent returns for property investors.",
      category: "Investment"
    },
    {
      id: 3,
      title: "Changes in Telangana's Real Estate Regulations: What You Need to Know",
      date: "May 10, 2025",
      excerpt: "Recent amendments to Telangana's real estate regulations bring important changes for property buyers and sellers. Learn how these affect your transactions.",
      category: "Regulations"
    },
    {
      id: 4,
      title: "Luxury Housing Trends in Hyderabad: What's Driving the Market",
      date: "April 22, 2025",
      excerpt: "The luxury housing segment in Hyderabad has seen significant innovation with smart homes, sustainable architecture, and premium amenities becoming standard.",
      category: "Luxury Real Estate"
    },
    {
      id: 5,
      title: "Commercial Real Estate in Hyderabad: Post-Pandemic Recovery",
      date: "April 5, 2025",
      excerpt: "Commercial properties in Hyderabad have bounced back strongly from pandemic lows, with office spaces and retail sectors showing renewed demand.",
      category: "Commercial"
    },
    {
      id: 6,
      title: "The Impact of Metro Expansion on Hyderabad's Property Values",
      date: "March 18, 2025",
      excerpt: "Areas connected by Hyderabad's expanding metro network have seen property values increase by up to 25%. We analyze which neighborhoods will benefit next.",
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
              #PropertyInvestment
            </span>
            <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-primary/10 hover:text-primary cursor-pointer">
              #RERAAct
            </span>
            <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-primary/10 hover:text-primary cursor-pointer">
              #HITECCity
            </span>
            <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-primary/10 hover:text-primary cursor-pointer">
              #LuxuryHomes
            </span>
            <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-primary/10 hover:text-primary cursor-pointer">
              #AffordableHousing
            </span>
            <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-primary/10 hover:text-primary cursor-pointer">
              #SmartCity
            </span>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
