import { useState, useEffect } from "react";

interface MobileDetectionResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  orientation: 'portrait' | 'landscape';
  screenWidth: number;
  screenHeight: number;
  isIOS: boolean;
  isAndroid: boolean;
}

export function useMobileDetection(): MobileDetectionResult {
  const [detection, setDetection] = useState<MobileDetectionResult>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    orientation: 'landscape',
    screenWidth: 1024,
    screenHeight: 768,
    isIOS: false,
    isAndroid: false,
  });

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent;
      
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const orientation = height > width ? 'portrait' : 'landscape';
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /Android/.test(userAgent);

      setDetection({
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        orientation,
        screenWidth: width,
        screenHeight: height,
        isIOS,
        isAndroid,
      });
    };

    // Initial detection
    detectDevice();

    // Listen for resize events
    window.addEventListener('resize', detectDevice);
    window.addEventListener('orientationchange', detectDevice);

    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener('orientationchange', detectDevice);
    };
  }, []);

  return detection;
}