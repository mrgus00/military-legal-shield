// Google Analytics implementation for MilitaryLegalShield
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Google Analytics Measurement ID not found - tracking disabled');
    return;
  }

  // Add Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', {
      page_title: document.title,
      page_location: window.location.href
    });
  `;
  document.head.appendChild(script2);
};

// Track page views for single-page application
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url,
    page_title: title || document.title
  });
};

// Track military legal specific events
export const trackLegalEvent = (
  action: string, 
  category: 'consultation' | 'document' | 'attorney_match' | 'emergency' | 'subscription',
  label?: string, 
  value?: number,
  militaryBranch?: string
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    custom_parameters: {
      military_branch: militaryBranch,
      platform: 'military_legal_shield'
    }
  });
};

// Track consultation requests
export const trackConsultationRequest = (
  consultationType: 'emergency' | 'scheduled' | 'document_review',
  militaryBranch: string,
  legalArea: string
) => {
  trackLegalEvent('consultation_request', 'consultation', `${consultationType}_${legalArea}`, 1, militaryBranch);
};

// Track document downloads
export const trackDocumentDownload = (
  documentType: string,
  militaryBranch?: string
) => {
  trackLegalEvent('document_download', 'document', documentType, 1, militaryBranch);
};

// Track attorney matching
export const trackAttorneyMatch = (
  matchType: 'search' | 'contact' | 'consultation_booked',
  location: string,
  specialization: string
) => {
  trackLegalEvent('attorney_match', 'attorney_match', `${matchType}_${specialization}`, 1);
};

// Track emergency legal requests
export const trackEmergencyRequest = (
  urgency: 'immediate' | 'urgent' | 'routine',
  militaryBranch: string,
  location: string
) => {
  trackLegalEvent('emergency_request', 'emergency', `${urgency}_${location}`, 1, militaryBranch);
};

// Track subscription events
export const trackSubscription = (
  action: 'started' | 'completed' | 'cancelled',
  planType: 'basic' | 'premium',
  militaryBranch?: string
) => {
  trackLegalEvent('subscription', 'subscription', `${action}_${planType}`, planType === 'premium' ? 29.99 : 0, militaryBranch);
};

// Track user engagement
export const trackEngagement = (
  feature: string,
  timeSpent?: number
) => {
  trackLegalEvent('engagement', 'consultation', feature, timeSpent);
};