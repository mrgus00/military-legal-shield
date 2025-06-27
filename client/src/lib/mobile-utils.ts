// Mobile utilities for enhanced PWA and native app preparation
import { useEffect, useState } from 'react';

// Device detection and capabilities
export interface MobileCapabilities {
  isStandalone: boolean;
  isInstallable: boolean;
  isPWA: boolean;
  hasPushNotifications: boolean;
  hasBackgroundSync: boolean;
  hasWebShare: boolean;
  hasFileSystemAccess: boolean;
  hasWakeLock: boolean;
  hasVibration: boolean;
  hasGeolocation: boolean;
  connectionType: string;
  batteryLevel?: number;
  isLowPowerMode: boolean;
}

// Device orientation and viewport management
export interface ViewportInfo {
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  safeAreaInsets: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// Hook for mobile capabilities detection
export function useMobileCapabilities(): MobileCapabilities {
  const [capabilities, setCapabilities] = useState<MobileCapabilities>({
    isStandalone: false,
    isInstallable: false,
    isPWA: false,
    hasPushNotifications: false,
    hasBackgroundSync: false,
    hasWebShare: false,
    hasFileSystemAccess: false,
    hasWakeLock: false,
    hasVibration: false,
    hasGeolocation: false,
    connectionType: 'unknown',
    isLowPowerMode: false
  });

  useEffect(() => {
    const updateCapabilities = () => {
      const newCapabilities: MobileCapabilities = {
        isStandalone: window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true,
        isInstallable: !!(window as any).deferredPrompt,
        isPWA: 'serviceWorker' in navigator,
        hasPushNotifications: 'PushManager' in window && 'serviceWorker' in navigator,
        hasBackgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
        hasWebShare: 'share' in navigator,
        hasFileSystemAccess: 'showOpenFilePicker' in window,
        hasWakeLock: 'wakeLock' in navigator,
        hasVibration: 'vibrate' in navigator,
        hasGeolocation: 'geolocation' in navigator,
        connectionType: (navigator as any).connection?.effectiveType || 'unknown',
        isLowPowerMode: (navigator as any).deviceMemory < 4 || 
                       (navigator as any).connection?.saveData === true
      };

      // Check battery level if available
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          newCapabilities.batteryLevel = battery.level * 100;
        });
      }

      setCapabilities(newCapabilities);
    };

    updateCapabilities();

    // Listen for connection changes
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', updateCapabilities);
    }

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', updateCapabilities);

    return () => {
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', updateCapabilities);
      }
      mediaQuery.removeEventListener('change', updateCapabilities);
    };
  }, []);

  return capabilities;
}

// Hook for viewport and orientation management
export function useViewport(): ViewportInfo {
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    safeAreaInsets: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  });

  useEffect(() => {
    const updateViewport = () => {
      // Get safe area insets from CSS environment variables
      const style = getComputedStyle(document.documentElement);
      const safeAreaTop = parseInt(style.getPropertyValue('--safe-area-inset-top') || '0');
      const safeAreaRight = parseInt(style.getPropertyValue('--safe-area-inset-right') || '0');
      const safeAreaBottom = parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0');
      const safeAreaLeft = parseInt(style.getPropertyValue('--safe-area-inset-left') || '0');

      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
        safeAreaInsets: {
          top: safeAreaTop,
          right: safeAreaRight,
          bottom: safeAreaBottom,
          left: safeAreaLeft
        }
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  return viewport;
}

// PWA installation management
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return { isInstallable, installPWA };
}

// Push notification management
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertVapidKey(import.meta.env.VITE_VAPID_PUBLIC_KEY || '')
    });

    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
}

// Background sync helpers
export async function scheduleBackgroundSync(tag: string, data?: any): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('sync' in window.ServiceWorkerRegistration.prototype)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Store data for sync if provided
    if (data) {
      const cache = await caches.open('background-sync');
      await cache.put(`/sync-${tag}`, new Response(JSON.stringify(data)));
    }

    await registration.sync.register(tag);
    return true;
  } catch (error) {
    console.error('Failed to schedule background sync:', error);
    return false;
  }
}

// Web Share API
export async function shareContent(data: ShareData): Promise<boolean> {
  if (!('share' in navigator)) {
    // Fallback to clipboard or other sharing methods
    if (data.url && 'clipboard' in navigator) {
      try {
        await navigator.clipboard.writeText(data.url);
        return true;
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
    return false;
  }

  try {
    await navigator.share(data);
    return true;
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Failed to share:', error);
    }
    return false;
  }
}

// Wake Lock API for keeping screen on during important tasks
export async function requestWakeLock(): Promise<WakeLockSentinel | null> {
  if (!('wakeLock' in navigator)) {
    return null;
  }

  try {
    const wakeLock = await (navigator as any).wakeLock.request('screen');
    return wakeLock;
  } catch (error) {
    console.error('Failed to request wake lock:', error);
    return null;
  }
}

// Haptic feedback
export function vibrate(pattern: number | number[]): boolean {
  if (!('vibrate' in navigator)) {
    return false;
  }

  try {
    navigator.vibrate(pattern);
    return true;
  } catch (error) {
    console.error('Failed to vibrate:', error);
    return false;
  }
}

// Performance monitoring for mobile
export function usePerformanceMonitoring() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        // First Input Delay (FID)
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log('FID:', entry);
          }
        }).observe({ type: 'first-input', buffered: true });

        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log('LCP:', entry);
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // Cumulative Layout Shift (CLS)
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log('CLS:', entry);
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch (error) {
        console.warn('Performance monitoring not available:', error);
      }
    }
  }, []);
}

// Utility functions
function convertVapidKey(vapidKey: string): Uint8Array {
  const padding = '='.repeat((4 - vapidKey.length % 4) % 4);
  const base64 = (vapidKey + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Mobile-specific CSS helper
export function addMobileCSSSupport() {
  // Add safe area inset CSS variables
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --safe-area-inset-top: env(safe-area-inset-top, 0px);
      --safe-area-inset-right: env(safe-area-inset-right, 0px);
      --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
      --safe-area-inset-left: env(safe-area-inset-left, 0px);
    }
    
    .mobile-safe-area {
      padding-top: var(--safe-area-inset-top);
      padding-right: var(--safe-area-inset-right);
      padding-bottom: var(--safe-area-inset-bottom);
      padding-left: var(--safe-area-inset-left);
    }
    
    .mobile-fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh; /* Dynamic viewport height for mobile */
    }
    
    @media (max-width: 768px) {
      .mobile-touch-friendly {
        min-height: 44px;
        min-width: 44px;
      }
    }
  `;
  document.head.appendChild(style);
}

export default {
  useMobileCapabilities,
  useViewport,
  usePWAInstall,
  requestNotificationPermission,
  subscribeToPushNotifications,
  scheduleBackgroundSync,
  shareContent,
  requestWakeLock,
  vibrate,
  usePerformanceMonitoring,
  addMobileCSSSupport
};