import { Phone, AlertTriangle } from "lucide-react";
import { formatEmergencyContact, trackMobileInteraction } from "@/lib/mobile-optimization";
import { useState, useEffect } from "react";

interface MobileEmergencyBannerProps {
  isVisible?: boolean;
  onDismiss?: () => void;
}

export default function MobileEmergencyBanner({ isVisible = true, onDismiss }: MobileEmergencyBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const emergencyContact = formatEmergencyContact();

  // Check if banner was previously dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('emergency-banner-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('emergency-banner-dismissed', 'true');
    onDismiss?.();
  };

  const handleEmergencyCall = () => {
    trackMobileInteraction('emergency_call', 'floating_banner');
    window.location.href = emergencyContact.callLink;
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm">
      <div className="bg-red-600 text-white rounded-lg shadow-lg border border-red-500 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-100" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">
              Emergency Legal Crisis?
            </p>
            <p className="text-xs text-red-100 mt-1">
              Get immediate military legal support 24/7
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-red-100 hover:text-white touch-manipulation"
            aria-label="Dismiss emergency banner"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleEmergencyCall}
            className="flex-1 bg-white text-red-600 hover:bg-red-50 font-semibold py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 touch-manipulation min-h-[44px]"
            aria-label="Call Emergency Legal Support"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm">Call Now</span>
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-red-100 hover:text-white transition-colors duration-200 text-sm touch-manipulation"
            aria-label="Dismiss banner"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}