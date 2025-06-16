import { useEffect } from 'react';

// Google Tag Manager configuration
const GTM_ID = 'GTM-XXXXXXX'; // Replace with actual GTM container ID

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function GoogleTagManager() {
  useEffect(() => {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];

    // Add GTM script to head
    const script = document.createElement('script');
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');
    `;
    document.head.appendChild(script);

    // Add noscript fallback to body
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.appendChild(noscript);

    return () => {
      // Cleanup on unmount
      const gtmScript = document.querySelector(`script[src*="${GTM_ID}"]`);
      if (gtmScript) gtmScript.remove();
      
      const gtmNoscript = document.querySelector(`noscript iframe[src*="${GTM_ID}"]`);
      if (gtmNoscript?.parentElement) gtmNoscript.parentElement.remove();
    };
  }, []);

  return null;
}

// Enhanced event tracking for military legal services
export const pushToDataLayer = (event: string, data: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event,
      ...data
    });
  }
};

// Military-specific event tracking
export const trackMilitaryBranchSelection = (branch: string, page: string) => {
  pushToDataLayer('military_branch_selection', {
    military_branch: branch,
    page_location: page,
    event_category: 'Military',
    event_action: 'Branch Selection'
  });
};

export const trackLegalServiceRequest = (serviceType: string, urgency: string, branch?: string) => {
  pushToDataLayer('legal_service_request', {
    service_type: serviceType,
    urgency_level: urgency,
    military_branch: branch,
    event_category: 'Legal Services',
    event_action: 'Service Request'
  });
};

export const trackAttorneyContact = (attorneyId: string, contactMethod: string, location: string) => {
  pushToDataLayer('attorney_contact', {
    attorney_id: attorneyId,
    contact_method: contactMethod,
    attorney_location: location,
    event_category: 'Attorney Database',
    event_action: 'Contact Attorney'
  });
};

export const trackEmergencyConsultation = (consultationType: string, timeOfDay: string) => {
  pushToDataLayer('emergency_consultation', {
    consultation_type: consultationType,
    time_of_day: timeOfDay,
    event_category: 'Emergency Services',
    event_action: 'Emergency Consultation'
  });
};

export const trackDocumentDownload = (documentType: string, branch: string) => {
  pushToDataLayer('document_download', {
    document_type: documentType,
    military_branch: branch,
    event_category: 'Documents',
    event_action: 'Download'
  });
};

export const trackLegalChallengeCompletion = (challengeId: number, score: number, timeSpent: number) => {
  pushToDataLayer('legal_challenge_completion', {
    challenge_id: challengeId,
    score: score,
    time_spent_seconds: timeSpent,
    event_category: 'Legal Challenges',
    event_action: 'Challenge Completed'
  });
};

export const trackSubscriptionEvent = (eventType: string, planType: string, amount?: number) => {
  pushToDataLayer('subscription_event', {
    event_type: eventType, // 'start', 'cancel', 'upgrade', 'downgrade'
    plan_type: planType,
    amount: amount,
    event_category: 'Subscription',
    event_action: eventType
  });
};

export const trackSearchQuery = (query: string, resultsCount: number, filters: Record<string, any>) => {
  pushToDataLayer('search_query', {
    search_term: query,
    results_count: resultsCount,
    filters_applied: Object.keys(filters).join(','),
    event_category: 'Search',
    event_action: 'Attorney Search'
  });
};

// Enhanced ecommerce tracking for legal services
export const trackPurchase = (transactionId: string, value: number, items: any[]) => {
  pushToDataLayer('purchase', {
    transaction_id: transactionId,
    value: value,
    currency: 'USD',
    items: items,
    event_category: 'Ecommerce',
    event_action: 'Purchase'
  });
};

export default GoogleTagManager;