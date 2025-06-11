import { useEffect, useCallback } from "react";
import { useLoading } from "@/contexts/LoadingContext";

interface UseMilitaryLoadingOptions {
  variant?: "default" | "security" | "legal" | "emergency" | "tactical";
  showProgress?: boolean;
  autoHideDelay?: number;
  loadingMessages?: string[];
}

export function useMilitaryLoading(options: UseMilitaryLoadingOptions = {}) {
  const { showLoading, hideLoading, updateProgress, updateLoadingText } = useLoading();

  const startLoading = useCallback((customText?: string) => {
    showLoading({
      variant: options.variant || "default",
      showProgress: options.showProgress || false,
      loadingText: customText,
    });
  }, [showLoading, options.variant, options.showProgress]);

  const stopLoading = useCallback(() => {
    if (options.autoHideDelay) {
      setTimeout(() => {
        hideLoading();
      }, options.autoHideDelay);
    } else {
      hideLoading();
    }
  }, [hideLoading, options.autoHideDelay]);

  const setProgress = useCallback((progress: number, message?: string) => {
    updateProgress(progress);
    if (message) {
      updateLoadingText(message);
    }
  }, [updateProgress, updateLoadingText]);

  // Simulate military loading sequence
  const startMilitarySequence = useCallback((duration: number = 3000) => {
    const messages = options.loadingMessages || [
      "Initializing secure connection...",
      "Accessing military database...",
      "Verifying credentials...",
      "Loading encrypted data...",
      "System ready"
    ];

    startLoading(messages[0]);
    
    const steps = messages.length;
    const stepDuration = duration / steps;
    
    messages.forEach((message, index) => {
      setTimeout(() => {
        const progress = ((index + 1) / steps) * 100;
        setProgress(progress, message);
        
        if (index === steps - 1) {
          setTimeout(() => {
            stopLoading();
          }, stepDuration / 2);
        }
      }, index * stepDuration);
    });
  }, [startLoading, setProgress, stopLoading, options.loadingMessages]);

  return {
    startLoading,
    stopLoading,
    setProgress,
    startMilitarySequence,
  };
}

// Hook for API request loading
export function useApiLoading() {
  return useMilitaryLoading({
    variant: "default",
    showProgress: true,
    loadingMessages: [
      "Establishing secure connection...",
      "Authenticating request...",
      "Processing data...",
      "Encrypting response...",
      "Complete"
    ]
  });
}

// Hook for emergency loading
export function useEmergencyLoading() {
  return useMilitaryLoading({
    variant: "emergency",
    showProgress: true,
    loadingMessages: [
      "EMERGENCY ACCESS INITIATED",
      "Connecting to urgent legal support...",
      "Locating nearest attorneys...",
      "Prioritizing your case...",
      "Emergency assistance ready"
    ]
  });
}

// Hook for security operations
export function useSecurityLoading() {
  return useMilitaryLoading({
    variant: "security",
    showProgress: true,
    loadingMessages: [
      "Scanning security protocols...",
      "Verifying clearance level...",
      "Establishing encrypted channel...",
      "Security verification complete...",
      "Access granted"
    ]
  });
}

// Hook for legal operations
export function useLegalLoading() {
  return useMilitaryLoading({
    variant: "legal",
    showProgress: true,
    loadingMessages: [
      "Accessing UCMJ database...",
      "Loading legal frameworks...",
      "Connecting to legal advisors...",
      "Preparing case resources...",
      "Legal system online"
    ]
  });
}