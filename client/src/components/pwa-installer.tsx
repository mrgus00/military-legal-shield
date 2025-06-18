import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Smartphone, 
  Wifi, 
  Bell, 
  Shield,
  X
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = (window.navigator as any).standalone === true;
    
    setIsInstalled(isStandalone || (isIOS && isInStandaloneMode));

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      setShowBanner(true);
    };

    // Handle app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setShowBanner(false);
      console.log('PWA: App installed successfully');
    };

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA: Install accepted');
    } else {
      console.log('PWA: Install dismissed');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
    setShowBanner(false);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        new Notification('MilitaryLegalShield', {
          body: 'Notifications enabled! You\'ll receive updates about your legal cases.',
          icon: '/icons/icon-192x192.svg',
          badge: '/icons/badge-72x72.png'
        });
      }
    }
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('PWA: Service Worker registered successfully:', registration.scope);
      } catch (error) {
        console.error('PWA: Service Worker registration failed:', error);
      }
    }
  };

  useEffect(() => {
    registerServiceWorker();
  }, []);

  if (isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-80 shadow-lg border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-green-800">
              <Shield className="w-5 h-5 mr-2" />
              App Installed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">
                  <Wifi className="w-3 h-3 mr-1" />
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
                {notificationPermission === 'granted' && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <Bell className="w-3 h-3 mr-1" />
                    Notifications
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!showBanner || !isInstallable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-blue-800">
              <Smartphone className="w-5 h-5 mr-2" />
              Install App
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBanner(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            Install MilitaryLegalShield for offline access and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center text-green-600">
                <Wifi className="w-4 h-4 mr-1" />
                Offline Access
              </div>
              <div className="flex items-center text-blue-600">
                <Bell className="w-4 h-4 mr-1" />
                Push Notifications
              </div>
              <div className="flex items-center text-purple-600">
                <Shield className="w-4 h-4 mr-1" />
                Secure Storage
              </div>
              <div className="flex items-center text-orange-600">
                <Download className="w-4 h-4 mr-1" />
                Quick Access
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleInstall} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Install Now
              </Button>
              
              {notificationPermission !== 'granted' && (
                <Button 
                  variant="outline" 
                  onClick={requestNotificationPermission}
                  className="flex-1"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Enable Alerts
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}