
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  scrollToPropertyForm: () => void;
  handleContactClick: () => void;
}

export const MobileMenu = ({ isOpen, scrollToPropertyForm, handleContactClick }: MobileMenuProps) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  
  // Close submenu when main menu closes
  useEffect(() => {
    if (!isOpen) {
      setOpenSubmenu(null);
    }
  }, [isOpen]);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={menuVariants}
          className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50 overflow-hidden"
        >
          <div className="p-4 space-y-2 divide-y divide-gray-100">
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
              <button
                onClick={scrollToPropertyForm}
                className="block w-full text-left px-3 py-2 rounded-md bg-primary text-white hover:bg-primary/90 font-medium"
              >
                List Property
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
