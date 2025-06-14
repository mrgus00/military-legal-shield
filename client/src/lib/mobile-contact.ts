// Mobile contact optimization utilities
// Ensures all phone numbers are clickable and emails are tappable on mobile devices

export interface EmergencyContact {
  phone: string;
  email: string;
  description: string;
}

export const EMERGENCY_CONTACTS = {
  military: {
    phone: "+1-800-555-0123",
    email: "emergency@militarylegalshield.com",
    description: "24/7 Military Legal Emergency Line"
  },
  crisis: {
    phone: "+1-988", // National Suicide & Crisis Lifeline
    email: "support@militarylegalshield.com",
    description: "Crisis Support"
  },
  general: {
    phone: "+1-800-555-0199",
    email: "support@militarylegalshield.com", 
    description: "General Support"
  }
};

export function formatPhoneForClick(phone: string): string {
  // Remove all non-numeric characters except + for international numbers
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function formatEmailForClick(email: string): string {
  return `mailto:${email}`;
}

export function createClickablePhone(phone: string, displayText?: string): {
  href: string;
  display: string;
  isClickable: boolean;
} {
  return {
    href: formatPhoneForClick(phone),
    display: displayText || phone,
    isClickable: true
  };
}

export function createClickableEmail(email: string, subject?: string, body?: string): {
  href: string;
  display: string;
  isClickable: boolean;
} {
  let href = formatEmailForClick(email);
  
  const params = new URLSearchParams();
  if (subject) params.append('subject', subject);
  if (body) params.append('body', body);
  
  if (params.toString()) {
    href += `?${params.toString()}`;
  }
  
  return {
    href,
    display: email,
    isClickable: true
  };
}

export function getMobileEmergencyContacts() {
  return Object.entries(EMERGENCY_CONTACTS).map(([key, contact]) => ({
    id: key,
    ...contact,
    phoneLink: createClickablePhone(contact.phone),
    emailLink: createClickableEmail(
      contact.email, 
      `Emergency Legal Assistance - ${contact.description}`,
      'I need immediate legal assistance. Please contact me as soon as possible.'
    )
  }));
}

// Utility to detect if device supports touch (mobile/tablet)
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Enhanced mobile button classes for better touch targets
export function getMobileButtonClasses(variant: 'primary' | 'secondary' | 'emergency' = 'primary'): string {
  const baseClasses = "min-h-[44px] min-w-[44px] touch-manipulation";
  
  const variantClasses = {
    primary: "bg-navy-600 hover:bg-navy-700 text-white px-6 py-3 rounded-lg font-medium",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-medium",
    emergency: "bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg"
  };
  
  return `${baseClasses} ${variantClasses[variant]}`;
}

// Track mobile interactions for analytics
export function trackMobileContact(contactType: 'phone' | 'email', contactId: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'mobile_contact', {
      contact_type: contactType,
      contact_id: contactId,
      device_type: isTouchDevice() ? 'mobile' : 'desktop'
    });
  }
}