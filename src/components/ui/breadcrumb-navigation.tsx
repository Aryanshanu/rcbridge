
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export type BreadcrumbItem = {
  label: string;
  path: string;
  icon?: React.ReactNode;
};

export interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  homeLink?: string;
  className?: string;
}

export function BreadcrumbNavigation({
  items,
  homeLink = "/",
  className = "",
}: BreadcrumbNavigationProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  if (isHome) return null;

  return (
    <nav
      className={`flex text-sm sm:text-base font-medium py-2 sm:py-3 ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center space-x-1 sm:space-x-2 text-gray-500">
        <li className="flex items-center">
          <Link
            to={homeLink}
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={item.path} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1 text-gray-400" aria-hidden="true" />
            {index === items.length - 1 ? (
              <span className="text-gray-900 font-semibold flex items-center">
                {item.icon && (
                  <span className="mr-1">{item.icon}</span>
                )}
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="text-primary hover:text-primary/80 transition-colors flex items-center"
              >
                {item.icon && (
                  <span className="mr-1">{item.icon}</span>
                )}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
