import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Shield, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getUserRole } from "@/utils/admin/userUtils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface MobileMenuProps {
  isOpen: boolean;
  scrollToPropertyForm: () => void;
  handleContactClick: () => void;
}

export const MobileMenu = ({ isOpen, scrollToPropertyForm, handleContactClick }: MobileMenuProps) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Reset submenu state when main menu closes
  useEffect(() => {
    if (!isOpen) {
      setOpenSubmenu(null);
    }
  }, [isOpen]);

  // Fetch user role when menu opens and user is logged in
  useEffect(() => {
    if (user && isOpen) {
      getUserRole().then(role => setUserRole(role));
    }
  }, [user, isOpen]);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSigningOut) return;
    
    try {
      setIsSigningOut(true);
      toast.loading("Signing out...");
      await signOut();
    } catch (error) {
      console.error("Error during sign out:", error);
      setIsSigningOut(false);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
  const initials = getInitials(displayName);

  const resources = [
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact', action: handleContactClick },
  ];

  const menuVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.4, ease: "easeInOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      x: 0, 
      transition: { delay: i * 0.1, duration: 0.3 } 
    }),
  };
  
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50 overflow-hidden"
          >
            <motion.div 
              custom={0}
              variants={itemVariants}
              className="py-2"
            >
              <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">
                Home
              </Link>
            </motion.div>
            
            <motion.div 
              custom={1} 
              variants={itemVariants}
              className="py-2"
            >
              <Link to="/properties" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">
                Properties
              </Link>
            </motion.div>
            
            <motion.div 
              custom={2} 
              variants={itemVariants}
              className="py-2"
            >
              <Link to="/services" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">
                Services
              </Link>
            </motion.div>
            
            <motion.div 
              custom={3} 
              variants={itemVariants}
              className="py-2"
            >
              <Link to="/calculator" className="block px-3 py-2 rounded-md hover:bg-gray-100 font-medium">
                Calculator
              </Link>
            </motion.div>
            
            <motion.div 
              custom={4} 
              variants={itemVariants}
              className="py-2"
            >
              <div
                className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 font-medium cursor-pointer"
                onClick={() => toggleSubmenu('resources')}
              >
                <span>Resources</span>
                {openSubmenu === 'resources' ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </div>
              
              <AnimatePresence>
                {openSubmenu === 'resources' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pl-4 mt-1 overflow-hidden"
                  >
                    {resources.map((item, i) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        {item.action ? (
                          <button
                            onClick={item.action}
                            className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
                          >
                            {item.name}
                          </button>
                        ) : (
                          <Link
                            to={item.path}
                            className="block px-3 py-2 rounded-md hover:bg-gray-100"
                          >
                            {item.name}
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            <motion.div 
              custom={5} 
              variants={itemVariants}
              className="py-2"
            >
              <Button 
                onClick={scrollToPropertyForm} 
                className="w-full"
              >
                List Property
              </Button>
            </motion.div>

            {user && userRole && ['admin', 'developer', 'maintainer'].includes(userRole) && (
              <motion.div custom={6} variants={itemVariants} className="py-2">
                <Link to="/admin" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 font-medium">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Link>
              </motion.div>
            )}

            {user && (
              <motion.div custom={7} variants={itemVariants} className="py-2 border-t mt-2">
                <div className="flex items-center px-3 py-3 mb-2">
                  <Avatar className="h-8 w-8 bg-primary text-white mr-2">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{displayName}</span>
                </div>
                <Link to="/profile" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                  Profile
                </Link>
                <Link to="/my-properties" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                  My Properties
                </Link>
                <Link to="/saved-searches" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                  Saved Searches
                </Link>
                <button 
                  onClick={handleSignOut} 
                  disabled={isSigningOut}
                  className="flex w-full items-center px-3 py-2 rounded-md hover:bg-gray-100 text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isSigningOut ? "Signing out..." : "Sign Out"}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
