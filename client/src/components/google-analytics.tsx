import { useEffect } from 'react';
import { useLocation } from 'wouter';

// Google Analytics 4 configuration
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual GA4 measurement ID

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export function GoogleAnalytics() {
  const [location] = useLocation();

  useEffect(() => {
    // Load Google Analytics script
    if (typeof window !== 'undefined' && !window.gtag) {
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}', {
          page_title: document.title,
          page_location: window.location.href
        });
      `;
      document.head.appendChild(script2);

      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
    }
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location,
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }, [location]);

  return null;
}

// Custom event tracking functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title
    });
  }
};

// Track military-specific events
export const trackMilitaryAction = (action: string, branch?: string, details?: Record<string, any>) => {
  trackEvent('military_action', {
    action_type: action,
    military_branch: branch,
    ...details
  });
};

export const trackLegalConsultation = (consultationType: string, urgency: string) => {
  trackEvent('legal_consultation', {
    consultation_type: consultationType,
    urgency_level: urgency,
    timestamp: new Date().toISOString()
  });
};

export const trackAttorneySearch = (searchTerm: string, filters: Record<string, any>) => {
  trackEvent('attorney_search', {
    search_term: searchTerm,
    filters_applied: Object.keys(filters).join(','),
    ...filters
  });
};

export const trackDocumentGeneration = (documentType: string, branch: string) => {
  trackEvent('document_generation', {
    document_type: documentType,
    military_branch: branch
  });
};

export const trackLegalChallenge = (challengeId: number, score: number, completed: boolean) => {
  trackEvent('legal_challenge', {
    challenge_id: challengeId,
    score: score,
    completed: completed
  });
};

export default GoogleAnalytics;