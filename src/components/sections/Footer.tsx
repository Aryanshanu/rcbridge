
import { Link } from "react-router-dom";

interface FooterLink {
  text: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const Footer = () => {
  const quickLinks: FooterSection = {
    title: "Quick Links",
    links: [
      { text: "About Us", href: "/" },
      { text: "Properties", href: "/properties" },
      { text: "Services", href: "/services" },
      { text: "Contact", href: "/contact" },
    ]
  };

  const resourceLinks: FooterSection = {
    title: "Resources",
    links: [
      { text: "Market Insights", href: "/" },
      { text: "Blog", href: "/blog" },
      { text: "FAQ", href: "/faq" },
      { text: "Terms of Service", href: "/login" },
    ]
  };

  const contactInfo = [
    "Hyderabad",
    "aryan@rcbridge.co",
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 py-8 sm:py-12 border-t border-gray-800 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">RCBridge</h3>
            <p className="text-sm">
              Connecting landowners, buyers, and startups in Hyderabad's property market since 2013.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">{quickLinks.title}</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.links.map((link, index) => (
                <li key={`quick-${index}`}>
                  <Link to={link.href} className="hover:text-white transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">{resourceLinks.title}</h4>
            <ul className="space-y-2 text-sm">
              {resourceLinks.links.map((link, index) => (
                <li key={`resource-${index}`}>
                  <Link to={link.href} className="hover:text-white transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              {contactInfo.map((info, index) => (
                <li key={`contact-${index}`}>{info}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          © 2013-2025 RCBridge. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
