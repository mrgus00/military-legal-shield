import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

export default function MobileSEOHead({
  title = "Military Legal Shield - Instant Legal Support for Service Members",
  description = "Get immediate access to military lawyers 24/7. Court-martial defense, DUI, legal questions, POA services. Veteran-owned platform serving all military branches worldwide.",
  keywords = "military lawyer, court martial defense, military legal services, DUI defense, military attorney, veteran legal support, JAG lawyer, UCMJ defense, military justice, legal assistance",
  ogTitle,
  ogDescription,
  ogImage = "/og-image.jpg",
  canonicalUrl,
  structuredData
}: SEOProps) {
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    updateMetaTag('description', description);
    
    // Update keywords
    updateMetaTag('keywords', keywords);
    
    // Mobile optimization meta tags
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
    updateMetaTag('theme-color', '#1e3a8a'); // Navy blue theme
    updateMetaTag('mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    updateMetaTag('apple-mobile-web-app-title', 'Military Legal Shield');
    
    // Open Graph tags for social sharing
    updateMetaProperty('og:title', ogTitle || title);
    updateMetaProperty('og:description', ogDescription || description);
    updateMetaProperty('og:image', ogImage);
    updateMetaProperty('og:type', 'website');
    updateMetaProperty('og:site_name', 'Military Legal Shield');
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', ogTitle || title);
    updateMetaTag('twitter:description', ogDescription || description);
    updateMetaTag('twitter:image', ogImage);
    
    // Canonical URL
    if (canonicalUrl) {
      updateLinkTag('canonical', canonicalUrl);
    }
    
    // Structured data for rich snippets
    if (structuredData) {
      updateStructuredData(structuredData);
    }
    
    // Default structured data for military legal services
    const defaultStructuredData = {
      "@context": "https://schema.org",
      "@type": "LegalService",
      "name": "Military Legal Shield",
      "description": "Professional legal services for military personnel and veterans",
      "url": "https://militarylegalshield.com",
      "telephone": "+1-800-555-0123",
      "email": "support@militarylegalshield.com",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      },
      "serviceType": [
        "Court-Martial Defense",
        "Military Legal Consultation",
        "DUI Defense",
        "Legal Document Preparation",
        "Military Justice Advisory"
      ],
      "areaServed": {
        "@type": "Country",
        "name": "United States"
      },
      "availableLanguage": ["English"],
      "priceRange": "$$",
      "openingHours": "Mo-Su 00:00-23:59",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Military Legal Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Emergency Legal Consultation",
              "description": "24/7 emergency legal consultation for military personnel"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": "Court-Martial Defense",
              "description": "Professional defense representation for court-martial proceedings"
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1247",
        "bestRating": "5",
        "worstRating": "1"
      }
    };
    
    if (!structuredData) {
      updateStructuredData(defaultStructuredData);
    }
    
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, canonicalUrl, structuredData]);

  return null; // This component only manages head elements
}

function updateMetaTag(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateLinkTag(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

function updateStructuredData(data: object) {
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }
  
  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

// Page-specific SEO configurations
export const SEO_CONFIGS = {
  home: {
    title: "Military Legal Shield - 24/7 Legal Support for Service Members",
    description: "Get immediate access to military lawyers 24/7. Court-martial defense, DUI, legal questions, POA services. Veteran-owned platform serving all military branches worldwide.",
    keywords: "military lawyer, court martial defense, military legal services, DUI defense, military attorney, veteran legal support, JAG lawyer, UCMJ defense, military justice",
  },
  emergency: {
    title: "Emergency Legal Consultation - Military Legal Shield",
    description: "Connect with military lawyers instantly for emergency legal situations. Available 24/7 for court-martial, DUI, false accusations and urgent legal matters.",
    keywords: "emergency military lawyer, urgent legal consultation, 24/7 military attorney, court martial emergency, military legal crisis",
  },
  attorneys: {
    title: "Find Military Attorneys - Vetted Defense Lawyers | Military Legal Shield", 
    description: "Search vetted military defense attorneys by location and specialty. Court-martial defense, DUI, administrative separations, and military justice experts.",
    keywords: "military defense attorney, court martial lawyer, military attorney directory, JAG lawyer, UCMJ defense attorney, military legal representation",
  },
  benefits: {
    title: "Military Benefits Calculator - VA Disability & Compensation | Military Legal Shield",
    description: "Calculate your VA disability compensation, military retirement pay, and state benefits. Real-time calculations for all military branches and dependent allowances.",
    keywords: "VA disability calculator, military benefits calculator, veteran compensation, military retirement calculator, VA benefits estimation",
  }
};