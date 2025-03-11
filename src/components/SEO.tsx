
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEO = ({
  title = "RC Bridge - Revolutionizing Real Estate & Community Building in India",
  description = "Connect directly with property owners and find your perfect space in Hyderabad. Join our vibrant community of startups and real estate enthusiasts.",
  keywords = "real estate India, Hyderabad property, Gen Z Ambassadors, startup workspace, direct property transactions, community building",
  image = "/og-image.png",
  url = window.location.href,
}: SEOProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO tags */}
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />
      
      {/* Mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#1E3A8A" />
      
      {/* Structured data for rich results */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "RC Bridge",
          "url": url,
          "logo": image,
          "description": description,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Hyderabad",
            "addressRegion": "Telangana",
            "addressCountry": "IN"
          }
        })}
      </script>
    </Helmet>
  );
};
