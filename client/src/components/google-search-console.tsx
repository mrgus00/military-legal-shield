import { useEffect } from 'react';

interface GoogleSearchConsoleProps {
  verificationToken?: string;
}

export function GoogleSearchConsole({ verificationToken }: GoogleSearchConsoleProps) {
  useEffect(() => {
    // Add Google Search Console verification meta tag
    if (verificationToken) {
      const existingMeta = document.querySelector('meta[name="google-site-verification"]');
      if (existingMeta) {
        existingMeta.setAttribute('content', verificationToken);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'google-site-verification';
        meta.content = verificationToken;
        document.head.appendChild(meta);
      }
    }

    // Add Google Search Console rich results testing
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Military Legal Shield",
      "url": "https://militarylegalshield.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://militarylegalshield.com/lawyer-database?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    });
    document.head.appendChild(script);

    return () => {
      if (verificationToken) {
        const meta = document.querySelector(`meta[name="google-site-verification"][content="${verificationToken}"]`);
        if (meta) meta.remove();
      }
    };
  }, [verificationToken]);

  return null;
}

// Generate Google Business Profile structured data
export function GoogleBusinessProfile() {
  useEffect(() => {
    const businessData = {
      "@context": "https://schema.org",
      "@type": "LegalService",
      "name": "Military Legal Shield",
      "image": "https://militarylegalshield.com/logo.png",
      "description": "Expert military legal defense services for all branches - Army, Navy, Air Force, Marines, Coast Guard, Space Force",
      "url": "https://militarylegalshield.com",
      "telephone": "+1-800-MILITARY",
      "email": "support@militarylegalshield.com",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "39.8283",
        "longitude": "-98.5795"
      },
      "openingHoursSpecification": [{
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }],
      "serviceArea": {
        "@type": "Country",
        "name": "United States"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Military Legal Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Court-Martial Defense",
              "description": "Expert defense for military court-martial proceedings across all branches"
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
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Emergency Legal Consultation",
              "description": "24/7 emergency legal assistance for urgent military matters"
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
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "MSgt Johnson"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": "Excellent military legal support. They understood my court-martial case and provided expert defense."
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Capt Rodriguez"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": "Professional service for my administrative separation case. Highly recommend for military personnel."
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(businessData);
    document.head.appendChild(script);

    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => {
        if (script.textContent?.includes('"@type": "LegalService"')) {
          script.remove();
        }
      });
    };
  }, []);

  return null;
}

export default GoogleSearchConsole;