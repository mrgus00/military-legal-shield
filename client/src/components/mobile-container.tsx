import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
  enableSafeArea?: boolean;
  enableTouch?: boolean;
}

export default function MobileContainer({ 
  children, 
  className,
  enableSafeArea = true,
  enableTouch = true 
}: MobileContainerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroidDevice = /Android/.test(userAgent);
      
      setIsMobile(isMobileDevice);
      setIsIOS(isIOSDevice);
      setIsAndroid(isAndroidDevice);
    };

    checkMobile();
    
    // Handle orientation changes and iOS viewport fixes
    const handleOrientationChange = () => {
      // Force viewport height recalculation on mobile
      if (isMobile) {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        
        // iOS Safari specific fixes
        if (isIOS) {
          // Force layout recalculation
          document.body.style.height = `${window.innerHeight}px`;
          setTimeout(() => {
            document.body.style.height = '';
          }, 100);
        }
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    // Initial viewport height setup
    handleOrientationChange();

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [isMobile]);

  const containerClasses = cn(
    "min-h-screen w-full max-w-full overflow-x-hidden no-bounce",
    {
      "ios-safe-area ios-scroll-fix": enableSafeArea && isIOS,
      "android-viewport": isAndroid,
      "touch-optimized": enableTouch && isMobile,
    },
    className
  );

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
}