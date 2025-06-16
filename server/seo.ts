import { Request, Response } from 'express';

// Generate structured data for military legal services
export function generateStructuredData(pageType: string, data?: any) {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Military Legal Shield",
    "description": "Comprehensive legal support platform for military personnel across all branches",
    "url": "https://militarylegalshield.com",
    "logo": "https://militarylegalshield.com/logo.png",
    "image": "https://militarylegalshield.com/hero-image.jpg",
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
    "areaServed": [
      "Army", "Navy", "Air Force", "Marines", "Coast Guard", "Space Force"
    ],
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
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Military Benefits Assistance",
            "description": "Help with VA disability claims and military benefits"
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
    "founder": {
      "@type": "Person",
      "name": "Military Legal Shield Team"
    },
    "foundingDate": "2024",
    "slogan": "Your Legal Shield in Military Service"
  };

  switch (pageType) {
    case 'attorney-database':
      return {
        ...baseData,
        "@type": "ProfessionalService",
        "name": "Military Attorney Database - Military Legal Shield",
        "description": "Find experienced military defense attorneys nationwide specializing in court-martial, UCMJ, and military justice cases",
        "serviceType": "Legal Referral Service",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Military Attorney Services",
          "itemListElement": data?.attorneys?.map((attorney: any) => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "LegalService",
              "name": `${attorney.firstName} ${attorney.lastName} - Military Defense Attorney`,
              "description": attorney.specialties?.join(', ') || "Military legal defense",
              "provider": {
                "@type": "Attorney",
                "name": `${attorney.firstName} ${attorney.lastName}`,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": attorney.city,
                  "addressRegion": attorney.state
                }
              }
            }
          })) || []
        }
      };

    case 'legal-challenges':
      return {
        ...baseData,
        "@type": "EducationalOrganization",
        "name": "Military Legal Challenges - Interactive Training",
        "description": "Gamified legal preparedness challenges for military personnel covering UCMJ, court-martial defense, and military justice",
        "educationalCredentialAwarded": "Legal Preparedness Certificates",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Legal Training Challenges",
          "itemListElement": [
            {
              "@type": "Course",
              "name": "Court-Martial Defense Basics",
              "description": "Learn fundamental court-martial defense strategies"
            },
            {
              "@type": "Course", 
              "name": "UCMJ Violations Guide",
              "description": "Understanding common UCMJ violations and defenses"
            },
            {
              "@type": "Course",
              "name": "Security Clearance Protection",
              "description": "Protecting your security clearance from revocation"
            }
          ]
        }
      };

    default:
      return baseData;
  }
}

// Generate meta tags for SEO
export function generateMetaTags(page: string, data?: any) {
  const metaTags: Record<string, any> = {
    'home': {
      title: "Military Legal Shield - Expert Legal Support for All Military Branches",
      description: "Get immediate legal assistance for court-martial defense, UCMJ violations, security clearance issues, and military justice matters. Nationwide attorney network serving Army, Navy, Air Force, Marines, Coast Guard, and Space Force.",
      keywords: "military legal defense, court martial attorney, UCMJ lawyer, military justice, security clearance defense, military attorney, JAG defense, administrative separation",
      ogTitle: "Military Legal Shield - Your Legal Protection in Military Service",
      ogDescription: "Connect with experienced military defense attorneys nationwide. 24/7 emergency consultation available.",
      ogType: "website"
    },
    'urgent-match': {
      title: "Emergency Military Legal Defense - Court Martial Attorney Match",
      description: "Urgent court-martial defense needed? Get matched with experienced military defense attorneys within hours. Available 24/7 for emergency legal situations.",
      keywords: "emergency court martial defense, urgent military attorney, 24/7 legal help, military legal emergency",
      ogTitle: "Emergency Military Legal Defense - Immediate Attorney Match",
      ogDescription: "24/7 emergency court-martial defense. Get matched with expert military attorneys immediately.",
      ogType: "service"
    },
    'lawyer-database': {
      title: "Military Defense Attorneys Database - Find Experienced Military Lawyers",
      description: "Search our database of 31+ verified military defense attorneys nationwide. Specializing in court-martial, UCMJ, security clearance, and administrative separation cases.",
      keywords: "military defense attorney, court martial lawyer, UCMJ attorney, military justice lawyer, security clearance attorney",
      ogTitle: "Military Attorney Database - Expert Defense Lawyers Nationwide",
      ogDescription: "Find experienced military defense attorneys in your area. Verified specialists in court-martial and military justice.",
      ogType: "directory"
    },
    'legal-challenges': {
      title: "Military Legal Preparedness Challenges - Interactive UCMJ Training",
      description: "Test your military legal knowledge with gamified challenges covering court-martial defense, UCMJ violations, and military justice. Earn badges and improve legal preparedness.",
      keywords: "military legal training, UCMJ challenges, court martial education, military justice quiz, legal preparedness",
      ogTitle: "Military Legal Challenges - Gamified Legal Training",
      ogDescription: "Interactive legal preparedness challenges for military personnel. Test your UCMJ knowledge and earn achievements.",
      ogType: "application"
    }
  };

  return metaTags[page] || metaTags['home'];
}

// Handle search engine verification files
export function handleSearchEngineVerification(req: Request, res: Response) {
  const { filename } = req.params;
  
  // Google Search Console verification
  if (filename === 'google-site-verification.html' || filename.startsWith('google')) {
    res.send(`<html><head><meta name="google-site-verification" content="VERIFICATION_TOKEN_HERE" /></head><body>Google verification for MilitaryLegalShield.com</body></html>`);
    return;
  }

  // Bing Webmaster Tools verification
  if (filename === 'BingSiteAuth.xml' || filename.startsWith('bing')) {
    res.type('xml').send(`<?xml version="1.0"?>
<users>
  <user>BING_VERIFICATION_TOKEN_HERE</user>
</users>`);
    return;
  }

  // Yahoo verification
  if (filename.startsWith('yahoo') || filename === 'yahoo_site_verification.html') {
    res.send(`<html><head><meta name="y_key" content="YAHOO_VERIFICATION_TOKEN_HERE" /></head><body>Yahoo verification for MilitaryLegalShield.com</body></html>`);
    return;
  }

  // Yandex verification
  if (filename.startsWith('yandex')) {
    res.send(`<html><head><meta name="yandex-verification" content="YANDEX_VERIFICATION_TOKEN_HERE" /></head><body>Yandex verification for MilitaryLegalShield.com</body></html>`);
    return;
  }

  res.status(404).send('Verification file not found');
}

// Generate breadcrumb structured data
export function generateBreadcrumbs(path: string) {
  const pathSegments = path.split('/').filter(Boolean);
  const breadcrumbs = [
    { name: 'Home', url: '/' }
  ];

  let currentPath = '';
  pathSegments.forEach((segment, index) => {
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
}

// Generate FAQ structured data for common military legal questions
export function generateFAQStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a court-martial?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A court-martial is a military court that tries members of the armed forces for violations of military law under the Uniform Code of Military Justice (UCMJ). There are three types: summary, special, and general court-martial, each with different levels of authority and potential punishments."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need a lawyer for a court-martial?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you have the right to legal representation in a court-martial. You can choose military defense counsel (free) or hire civilian counsel (at your expense). Many service members choose experienced civilian military defense attorneys for serious charges."
        }
      },
      {
        "@type": "Question",
        "name": "What are common UCMJ violations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Common UCMJ violations include Article 86 (Absence without leave), Article 92 (Failure to obey order), Article 134 (General article), Article 120 (Sexual assault), Article 121 (Larceny and wrongful appropriation), and Article 15 (Administrative punishment)."
        }
      },
      {
        "@type": "Question",
        "name": "Can I lose my security clearance?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, security clearances can be suspended or revoked for various reasons including financial problems, criminal conduct, alcohol/drug issues, personal conduct concerns, or foreign influence. You have the right to respond and request a hearing before final determination."
        }
      },
      {
        "@type": "Question",
        "name": "What is administrative separation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Administrative separation is the process of removing a service member from active duty for non-punitive reasons. This can be voluntary or involuntary and may affect your discharge characterization and eligibility for benefits."
        }
      }
    ]
  };
}