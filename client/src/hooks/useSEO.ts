import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

export function useSEO(config: SEOConfig) {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof document === 'undefined') {
      return; // Skip on server-side rendering
    }

    // Update document title
    document.title = config.title;

    // Update or create meta tags
    updateMetaTag('description', config.description);
    
    if (config.keywords) {
      updateMetaTag('keywords', config.keywords);
    }

    // Open Graph tags
    updateMetaTag('og:title', config.ogTitle || config.title, 'property');
    updateMetaTag('og:description', config.ogDescription || config.description, 'property');
    updateMetaTag('og:type', config.ogType || 'website', 'property');
    updateMetaTag('og:url', `https://militarylegalshield.com${location}`, 'property');
    
    if (config.ogImage) {
      updateMetaTag('og:image', config.ogImage, 'property');
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', config.ogTitle || config.title, 'name');
    updateMetaTag('twitter:description', config.ogDescription || config.description, 'name');

    // Canonical URL
    updateCanonicalLink(config.canonicalUrl || `https://militarylegalshield.com${location}`);

    // Structured data
    if (config.structuredData) {
      updateStructuredData(config.structuredData);
    }

    // Update robots meta tag
    updateMetaTag('robots', 'index, follow');

    // Google Search Console verification
    updateMetaTag('google-site-verification', 'Q85aT0P23qZ2zCKZHOIHSzE6ve727hMw5mBqlsect6k');

  }, [config, location]);
}

function updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  if (typeof document === 'undefined') return;
  
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.content = content;
}

function updateCanonicalLink(url: string) {
  if (typeof document === 'undefined') return;
  
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  
  element.href = url;
}

function updateStructuredData(data: object) {
  if (typeof document === 'undefined') return;
  
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

// Predefined SEO configs for different pages
export const seoConfigs = {
  home: {
    title: "Military Legal Shield - Expert Legal Support for All Military Branches",
    description: "Get immediate legal assistance for court-martial defense, UCMJ violations, security clearance issues, and military justice matters. Nationwide attorney network serving Army, Navy, Air Force, Marines, Coast Guard, and Space Force.",
    keywords: "military legal defense, court martial attorney, UCMJ lawyer, military justice, security clearance defense, military attorney, JAG defense, administrative separation",
    ogTitle: "Military Legal Shield - Your Legal Protection in Military Service",
    ogDescription: "Connect with experienced military defense attorneys nationwide. 24/7 emergency consultation available.",
    ogType: "website",
    ogImage: "https://militarylegalshield.com/og-image.jpg"
  },
  
  urgentMatch: {
    title: "Emergency Military Legal Defense - Court Martial Attorney Match",
    description: "Urgent court-martial defense needed? Get matched with experienced military defense attorneys within hours. Available 24/7 for emergency legal situations.",
    keywords: "emergency court martial defense, urgent military attorney, 24/7 legal help, military legal emergency",
    ogTitle: "Emergency Military Legal Defense - Immediate Attorney Match",
    ogDescription: "24/7 emergency court-martial defense. Get matched with expert military attorneys immediately.",
    ogType: "service"
  },

  lawyerDatabase: {
    title: "Military Defense Attorneys Database - Find Experienced Military Lawyers",
    description: "Search our database of 31+ verified military defense attorneys nationwide. Specializing in court-martial, UCMJ, security clearance, and administrative separation cases.",
    keywords: "military defense attorney, court martial lawyer, UCMJ attorney, military justice lawyer, security clearance attorney",
    ogTitle: "Military Attorney Database - Expert Defense Lawyers Nationwide",
    ogDescription: "Find experienced military defense attorneys in your area. Verified specialists in court-martial and military justice.",
    ogType: "directory"
  },

  legalChallenges: {
    title: "Military Legal Preparedness Challenges - Interactive UCMJ Training",
    description: "Test your military legal knowledge with gamified challenges covering court-martial defense, UCMJ violations, and military justice. Earn badges and improve legal preparedness.",
    keywords: "military legal training, UCMJ challenges, court martial education, military justice quiz, legal preparedness",
    ogTitle: "Military Legal Challenges - Gamified Legal Training",
    ogDescription: "Interactive legal preparedness challenges for military personnel. Test your UCMJ knowledge and earn achievements.",
    ogType: "application"
  },

  emergencyConsultation: {
    title: "24/7 Military Legal Emergency Consultation - DUI/DWI Defense",
    description: "Emergency military legal consultation available 24/7. Immediate assistance for DUI/DWI, court-martial, and urgent military justice matters.",
    keywords: "military legal emergency, 24/7 consultation, DUI defense military, urgent military attorney",
    ogTitle: "Emergency Military Legal Consultation - Available 24/7",
    ogDescription: "Get immediate legal help for military emergencies. Expert attorneys available around the clock.",
    ogType: "service"
  },

  documentGenerator: {
    title: "Military Legal Document Generator - POA & Family Documents",
    description: "Generate military-specific legal documents including Power of Attorney, family care plans, and deployment paperwork. AI-powered document creation for military families.",
    keywords: "military power of attorney, deployment documents, family care plan, military legal forms",
    ogTitle: "Military Legal Document Generator - Instant Document Creation",
    ogDescription: "Create military-specific legal documents instantly. POA, family care plans, and deployment paperwork.",
    ogType: "application"
  },

  militaryJustice: {
    title: "UCMJ Support & Military Justice Resources - Court Martial Defense",
    description: "Comprehensive UCMJ support and military justice resources. Expert guidance on court-martial defense, administrative actions, and military law violations.",
    keywords: "UCMJ support, military justice, court martial defense, military law violations, administrative separation",
    ogTitle: "UCMJ Support & Military Justice Resources",
    ogDescription: "Expert military justice support for UCMJ violations and court-martial defense.",
    ogType: "service"
  },

  benefitsEligibility: {
    title: "Military Benefits Calculator - VA Disability & Retirement Benefits",
    description: "Calculate your military benefits including VA disability compensation, retirement pay, and state veterans benefits. Comprehensive benefits eligibility assessment.",
    keywords: "military benefits calculator, VA disability calculator, military retirement calculator, veterans benefits",
    ogTitle: "Military Benefits Calculator - Calculate Your Benefits",
    ogDescription: "Estimate your VA disability, retirement, and state veterans benefits with our comprehensive calculator.",
    ogType: "application"
  }
};