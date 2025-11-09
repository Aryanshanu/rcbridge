
import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { DesktopMenu } from "./navbar/DesktopMenu";
import { MobileMenu } from "./navbar/MobileMenu";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminLiveFeed } from "./admin/AdminLiveFeed";
import { supabase } from "@/integrations/supabase/client";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      setIsAdmin(!!data && !error);
    };

    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating to a new page or screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const scrollToPropertyForm = () => {
    const formElement = document.querySelector('#property-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    } else {
      // If not on home page, navigate to home first then scroll
      navigate('/?scrollTo=property-form');
      setIsOpen(false);
    }
  };

  const handleContactClick = () => {
    // Use React Router navigation instead of directly changing window.location
    navigate('/contact');
    setIsOpen(false);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({
        pathname: '/properties',
        search: `?q=${encodeURIComponent(searchQuery)}`
      });
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Mount AdminLiveFeed for admins only */}
      {isAdmin && <AdminLiveFeed />}
      
      <nav className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 ease-in-out",
        isScrolled 
          ? "bg-white/98 backdrop-blur-md shadow-[0_4px_20px_-2px_rgba(30,58,138,0.1)] border-b border-primary/5" 
          : "bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]"
      )}>
        <div className="content-container flex justify-between items-center h-16 md:h-20 gap-4">
        <div className="flex items-center flex-shrink-0">
          <Link to="/" className="flex items-center group">
            <img
              className="h-10 w-auto md:h-12 transition-transform duration-300 group-hover:scale-105"
              src="/lovable-uploads/5fd561ff-5bbd-449c-94a3-d39d0a8b4f03.png"
              alt="RC Bridge"
            />
            <span className="ml-2 text-primary font-heading text-lg md:text-xl lg:text-2xl font-bold leading-tight whitespace-nowrap transition-all duration-300 group-hover:text-primary/80">RC Bridge</span>
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <DesktopMenu 
            scrollToPropertyForm={scrollToPropertyForm} 
            handleContactClick={handleContactClick} 
          />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={toggleSearch}
            className="p-2 rounded-md text-gray-400 hover:text-primary hover:bg-primary/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transform hover:scale-110"
            aria-label="Toggle search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-primary/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transform hover:scale-110"
            aria-expanded={isOpen}
          >
            <span className="sr-only">{isOpen ? 'Close main menu' : 'Open main menu'}</span>
            {isOpen ? (
              <X className="block h-6 w-6 transition-transform duration-300 rotate-0 hover:rotate-90" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6 transition-transform duration-300" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Search overlay */}
      {showSearch && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg p-4 md:px-6 z-50 border-b border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="relative max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search for properties, locations, or amenities..."
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                onClick={toggleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
              <button type="submit" className="sr-only">Search</button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      <MobileMenu 
        isOpen={isOpen} 
        scrollToPropertyForm={scrollToPropertyForm} 
        handleContactClick={handleContactClick} 
      />
    </nav>
    </>
  );
};
