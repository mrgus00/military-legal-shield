// Mobile optimization utilities for MilitaryLegalShield
export interface ContactInfo {
  phone?: string;
  email?: string;
  name?: string;
}

// Format phone numbers for click-to-call
export function formatPhoneForCall(phone: string): string {
  // Remove all non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  return `tel:${cleaned}`;
}

// Format email for tap-to-email with optional subject and body
export function formatEmailForTap(
  email: string, 
  subject?: string, 
  body?: string
): string {
  let mailto = `mailto:${email}`;
  
  const params = new URLSearchParams();
  if (subject) params.append('subject', subject);
  if (body) params.append('body', body);
  
  const queryString = params.toString();
  if (queryString) {
    mailto += `?${queryString}`;
  }
  
  return mailto;
}

// Detect mobile device
export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// Detect touch device
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || 
         navigator.maxTouchPoints > 0 || 
         (navigator as any).msMaxTouchPoints > 0;
}

// Get viewport dimensions
export function getViewportDimensions() {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  
  return {
    width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  };
}

// Check if device is in landscape mode
export function isLandscape(): boolean {
  const { width, height } = getViewportDimensions();
  return width > height;
}

// Format attorney contact for mobile
export function formatAttorneyContact(attorney: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  specialties?: string[];
}): {
  callLink: string;
  emailLink: string;
  smsLink: string;
} {
  const fullName = `${attorney.firstName} ${attorney.lastName}`;
  const specialtiesText = attorney.specialties?.join(', ') || 'Military Legal Defense';
  
  return {
    callLink: formatPhoneForCall(attorney.phone),
    emailLink: formatEmailForTap(
      attorney.email,
      `Legal Consultation Request - ${fullName}`,
      `Dear ${fullName},\n\nI am a service member in need of legal assistance regarding ${specialtiesText}. I would like to schedule a consultation at your earliest convenience.\n\nThank you for your service to our military community.\n\nRespectfully,\n[Your Name]\n[Your Rank/Branch]\n[Your Phone Number]`
    ),
    smsLink: `sms:${attorney.phone.replace(/[^\d+]/g, '')}?body=Hello ${fullName}, I am a service member seeking legal consultation. Please contact me at your earliest convenience.`
  };
}

// Emergency contact formatting
export function formatEmergencyContact(): {
  phone: string;
  email: string;
  display: string;
  callLink: string;
  emailLink: string;
} {
  const emergencyPhone = '+1-800-645-4357';
  const emergencyEmail = 'emergency@militarylegalshield.com';
  
  return {
    phone: emergencyPhone,
    email: emergencyEmail,
    display: emergencyPhone,
    callLink: formatPhoneForCall(emergencyPhone),
    emailLink: formatEmailForTap(
      emergencyEmail,
      'URGENT: Emergency Legal Assistance Required',
      'This is an urgent request for legal assistance. Please contact me immediately.\n\n[Please provide brief description of your situation]\n\nContact Information:\nName: [Your Name]\nRank/Branch: [Your Rank and Branch]\nPhone: [Your Phone Number]\nLocation: [Your Current Location]'
    )
  };
}

// Support contact formatting
export function formatSupportContact(): {
  callLink: string;
  emailLink: string;
} {
  return {
    callLink: formatPhoneForCall('+1-800-645-4357'),
    emailLink: formatEmailForTap(
      'support@militarylegalshield.com',
      'Support Request - MilitaryLegalShield',
      'Hello,\n\nI need assistance with:\n[Please describe your issue]\n\nAccount Information:\nName: [Your Name]\nEmail: [Your Email]\n\nThank you for your assistance.'
    )
  };
}

// Mobile-optimized button classes
export const mobileButtonClasses = {
  primary: "min-h-[48px] px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 touch-manipulation",
  secondary: "min-h-[44px] px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-200 touch-manipulation",
  icon: "min-h-[44px] min-w-[44px] p-2 rounded-full transition-all duration-200 touch-manipulation",
  call: "min-h-[48px] px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 touch-manipulation flex items-center justify-center space-x-2",
  email: "min-h-[48px] px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 touch-manipulation flex items-center justify-center space-x-2"
};

// Mobile navigation helpers
export function getMobileNavClasses(isActive: boolean): string {
  const baseClasses = "flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 touch-manipulation";
  
  if (isActive) {
    return `${baseClasses} bg-navy-800 text-white`;
  }
  
  return `${baseClasses} text-gray-700 hover:bg-gray-100 active:bg-gray-200`;
}

// Mobile form input classes
export const mobileFormClasses = {
  input: "min-h-[48px] px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 touch-manipulation",
  textarea: "min-h-[96px] px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 touch-manipulation resize-none",
  select: "min-h-[48px] px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 touch-manipulation",
  label: "block text-sm font-medium text-gray-700 mb-2"
};

// SEO optimization helpers
export function generatePageTitle(pageTitle: string): string {
  return `${pageTitle} | MilitaryLegalShield - Expert Military Legal Defense`;
}

export function generateMetaDescription(content: string, maxLength: number = 160): string {
  if (content.length <= maxLength) return content;
  
  // Truncate at word boundary
  const truncated = content.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

// Analytics and tracking helpers for mobile
export function trackMobileInteraction(action: string, element: string, value?: string) {
  // Mobile-specific analytics tracking
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: 'Mobile Interaction',
      event_label: element,
      value: value
    });
  }
}