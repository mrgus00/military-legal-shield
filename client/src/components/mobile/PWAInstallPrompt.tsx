import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, Smartphone, Shield, Zap, Wifi } from 'lucide-react';
import { usePWAInstall, useMobileCapabilities } from '@/lib/mobile-utils';

export default function PWAInstallPrompt() {
  const { isInstallable, installPWA } = usePWAInstall();
  const capabilities = useMobileCapabilities();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show install prompt if installable and not already standalone or dismissed
    const hasBeenDismissed = localStorage.getItem('pwa-install-dismissed') === 'true';
    setDismissed(hasBeenDismissed);
    
    if (isInstallable && !capabilities.isStandalone && !hasBeenDismissed) {
      // Delay showing prompt to avoid being intrusive
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isInstallable, capabilities.isStandalone]);

  const handleInstall = async () => {
    await installPWA();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleNotNow = () => {
    setShowPrompt(false);
    // Don't permanently dismiss, allow showing again in the future
  };

  if (!showPrompt || dismissed || capabilities.isStandalone) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-900 border-0 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Install Military Legal Shield</CardTitle>
                <CardDescription>Get native app experience</CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Wifi className="w-4 h-4 text-blue-600" />
              <span>Works Offline</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Download className="w-4 h-4 text-purple-600" />
              <span>No App Store</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Mobile App Features:</h4>
            <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-300">
              <li>• 24/7 emergency legal consultation</li>
              <li>• End-to-end encrypted messaging</li>
              <li>• Offline case analysis and resources</li>
              <li>• Push notifications for urgent alerts</li>
              <li>• Home screen shortcuts to key features</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleInstall}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Install App
            </Button>
            <Button 
              onClick={handleNotNow}
              variant="outline"
              className="flex-1"
            >
              Not Now
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            This app will be installed directly to your device without using an app store.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}