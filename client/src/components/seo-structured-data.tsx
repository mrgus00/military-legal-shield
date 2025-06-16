import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface StructuredDataProps {
  data: object;
}

export function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
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

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.querySelector('script[type="application/ld+json"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data]);

  return null;
}

// Pre-built structured data for common pages
export const structuredDataTemplates = {
  legalService: {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Military Legal Shield",
    "description": "Comprehensive legal support platform for military personnel across all branches",
    "url": "https://militarylegalshield.com",
    "logo": "https://militarylegalshield.com/logo.png",
    "telephone": "+1-800-MILITARY",
    "email": "support@militarylegalshield.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "serviceArea": {
      "@type": "Country", 
      "name": "United States"
    },
    "areaServed": ["Army", "Navy", "Air Force", "Marines", "Coast Guard", "Space Force"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Military Legal Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Court-Martial Defense",
            "description": "Expert defense for military court-martial proceedings"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Administrative Separation Defense",
            "description": "Legal representation for administrative separation boards"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Security Clearance Defense",
            "description": "Defense for security clearance revocation proceedings"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "bestRating": "5",
      "worstRating": "1", 
      "ratingCount": "127"
    }
  },

  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Military Legal Shield",
    "url": "https://militarylegalshield.com",
    "logo": "https://militarylegalshield.com/logo.png",
    "description": "Expert legal support for military personnel across all branches",
    "foundingDate": "2024",
    "sameAs": [
      "https://www.facebook.com/militarylegalshield",
      "https://www.twitter.com/militarylegal",
      "https://www.linkedin.com/company/military-legal-shield"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-MILITARY",
      "contactType": "customer service",
      "areaServed": "US",
      "availableLanguage": ["English", "Spanish"]
    }
  },

  webSite: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Military Legal Shield", 
    "url": "https://militarylegalshield.com",
    "description": "Expert legal support for military personnel across all branches",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://militarylegalshield.com/lawyer-database?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Military Legal Shield"
    }
  },

  breadcrumbList: (path: string) => {
    const pathSegments = path.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Home', url: '/' }];
    
    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const name = segment.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      breadcrumbs.push({ name, url: currentPath });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": `https://militarylegalshield.com${crumb.url}`
      }))
    };
  },

  faqPage: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a court-martial?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A court-martial is a military court that tries members of the armed forces for violations of military law under the Uniform Code of Military Justice (UCMJ). There are three types: summary, special, and general court-martial."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need a lawyer for a court-martial?",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "Yes, you have the right to legal representation in a court-martial. You can choose military defense counsel (free) or hire civilian counsel (at your expense)."
        }
      },
      {
        "@type": "Question",
        "name": "What are common UCMJ violations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Common UCMJ violations include Article 86 (Absence without leave), Article 92 (Failure to obey order), Article 134 (General article), Article 120 (Sexual assault), and Article 121 (Larceny)."
        }
      }
    ]
  }
};

export default StructuredData;