import { useEffect, useState } from "react";

interface MobileCapabilities {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isTablet: boolean;
  hasTouch: boolean;
  orientation: "portrait" | "landscape";
  screenSize: {
    width: number;
    height: number;
  };
  devicePixelRatio: number;
  isStandalone: boolean; // PWA mode
  canInstall: boolean;
}

export function useMobileDetection(): MobileCapabilities {
  const [capabilities, setCapabilities] = useState<MobileCapabilities>({
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    isTablet: false,
    hasTouch: false,
    orientation: "portrait",
    screenSize: { width: 0, height: 0 },
    devicePixelRatio: 1,
    isStandalone: false,
    canInstall: false,
  });

  useEffect(() => {
    const detectCapabilities = () => {
      const userAgent = navigator.userAgent;
      
      // Device detection
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /Android/.test(userAgent);
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTablet = /iPad/.test(userAgent) || (isAndroid && !/Mobile/.test(userAgent));
      
      // Touch capability
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Screen orientation
      const orientation = window.innerHeight > window.innerWidth ? "portrait" : "landscape";
      
      // Screen size
      const screenSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      
      // Device pixel ratio
      const devicePixelRatio = window.devicePixelRatio || 1;
      
      // PWA standalone mode detection
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone === true;
      
      // PWA install capability
      const canInstall = 'serviceWorker' in navigator && 
                        'PushManager' in window &&
                        'Notification' in window;

      setCapabilities({
        isMobile,
        isIOS,
        isAndroid,
        isTablet,
        hasTouch,
        orientation,
        screenSize,
        devicePixelRatio,
        isStandalone,
        canInstall,
      });
    };

    // Initial detection
    detectCapabilities();

    // Listen for orientation changes
    const handleOrientationChange = () => {
      setTimeout(detectCapabilities, 100); // Small delay for accurate measurements
    };

    // Listen for resize events
    const handleResize = () => {
      detectCapabilities();
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return capabilities;
}