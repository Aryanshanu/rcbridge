
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  homeIcon?: boolean;
  className?: string;
  separator?: React.ReactNode;
}

export const BreadcrumbNavigation = ({ 
  items = [], 
  homeIcon = true,
  className,
  separator = <ChevronRight className="h-4 w-4 mx-1" aria-hidden="true" />
}: BreadcrumbsProps) => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  
  // Generate breadcrumb items if not explicitly provided
  const breadcrumbItems = items.length ? items : pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      path,
    };
  });

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex text-sm text-gray-500 overflow-x-auto", className)}
    >
      <ol className="flex items-center space-x-1 flex-nowrap min-w-0">
        <li>
          <Link 
            to="/" 
            className="flex items-center hover:text-primary transition-colors"
            aria-label="Home"
          >
            {homeIcon ? <Home className="h-4 w-4" /> : "Home"}
          </Link>
        </li>
        
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <li className="flex items-center">
              {separator}
            </li>
            <li className="min-w-0">
              {index === breadcrumbItems.length - 1 ? (
                <span 
                  className="font-medium text-gray-900 truncate block" 
                  aria-current="page"
                  title={item.label}
                >
                  {item.icon && item.icon}
                  {item.label}
                </span>
              ) : (
                <Link 
                  to={item.path} 
                  className="hover:text-primary transition-colors truncate block"
                  title={item.label}
                >
                  {item.icon && item.icon}
                  {item.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};
