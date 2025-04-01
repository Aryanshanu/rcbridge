
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "property";
  propertyData?: {
    name: string;
    price: string;
    priceCurrency: string;
    location: string;
    bedrooms?: number;
    bathrooms?: number;
    floorSize?: string;
  };
  noindex?: boolean;
}

export const SEO = ({
  title = "RC Bridge - Revolutionizing Real Estate & Community Building in India",
  description = "Connect directly with property owners and find your perfect space in Hyderabad. Join our vibrant community of startups and real estate enthusiasts.",
  keywords = "real estate India, Hyderabad property, Gen Z Ambassadors, startup workspace, direct property transactions, community building",
  image = "/og-image.png",
  url,
  type = "website",
  propertyData,
  noindex = false,
}: SEOProps) => {
  const location = useLocation();
  const currentUrl = url || `${window.location.origin}${location.pathname}`;
  const pageTitle = title.includes("RC Bridge") ? title : `${title} | RC Bridge`;
  const absoluteImageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;

  // Generate structured data based on page type
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "RC Bridge",
      "url": window.location.origin,
      "logo": `${window.location.origin}/lovable-uploads/5fd561ff-5bbd-449c-94a3-d39d0a8b4f03.png`,
      "description": description,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Hyderabad",
        "addressRegion": "Telangana",
        "addressCountry": "IN"
      },
      "sameAs": [
        "https://twitter.com/rcbridge",
        "https://www.facebook.com/rcbridge",
        "https://www.instagram.com/rcbridge"
      ]
    };

    if (type === "property" && propertyData) {
      return {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": propertyData.name,
        "description": description,
        "image": absoluteImageUrl,
        "url": currentUrl,
        "offers": {
          "@type": "Offer",
          "price": propertyData.price,
          "priceCurrency": propertyData.priceCurrency,
        },
        "location": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": propertyData.location,
            "addressRegion": "Telangana",
            "addressCountry": "IN"
          }
        },
        "numberOfRooms": propertyData.bedrooms,
        "numberOfBathroomsTotal": propertyData.bathrooms,
        "floorSize": {
          "@type": "QuantitativeValue",
          "value": propertyData.floorSize?.replace(/[^0-9]/g, ''),
          "unitCode": "SQF"
        }
      };
    } else if (type === "article") {
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "image": absoluteImageUrl,
        "author": {
          "@type": "Organization",
          "name": "RC Bridge"
        },
        "publisher": {
          "@type": "Organization",
          "name": "RC Bridge",
          "logo": {
            "@type": "ImageObject",
            "url": `${window.location.origin}/lovable-uploads/5fd561ff-5bbd-449c-94a3-d39d0a8b4f03.png`
          }
        },
        "url": currentUrl,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": currentUrl
        },
        "datePublished": new Date().toISOString(),
        "dateModified": new Date().toISOString(),
        "description": description
      };
    }

    return baseData;
  };

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Indexing directive */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow, max-image-preview:large" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type === "property" ? "realestate.listing" : type === "article" ? "article" : "website"} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:site_name" content="RC Bridge" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={absoluteImageUrl} />
      <meta property="twitter:creator" content="@rcbridge" />

      {/* Additional SEO tags */}
      <meta name="author" content="RC Bridge" />
      <meta name="geo.region" content="IN-TG" />
      <meta name="geo.placename" content="Hyderabad" />
      
      {/* Mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#1E3A8A" />
      
      {/* Structured data for rich results */}
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>
    </Helmet>
  );
};
