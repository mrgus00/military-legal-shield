import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone, 
  Download, 
  Bell, 
  Wifi, 
  Battery, 
  Share2, 
  Shield, 
  Zap,
  MessageSquare,
  AlertTriangle,
  Settings,
  ExternalLink
} from 'lucide-react';
import { Link } from 'wouter';
import PageLayout from '@/components/page-layout';
import PWAInstallPrompt from '@/components/mobile/PWAInstallPrompt';
import MobileNotificationManager from '@/components/mobile/MobileNotificationManager';
import OfflineHandler from '@/components/mobile/OfflineHandler';
import { useMobileCapabilities, useViewport, shareContent } from '@/lib/mobile-utils';
import { HomeButton } from '@/components/HomeButton';

export default function MobileDashboard() {
  const capabilities = useMobileCapabilities();
  const viewport = useViewport();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const shareApp = async () => {
    const shareData = {
      title: 'Military Legal Shield',
      text: 'Get 24/7 legal support for military personnel with AI-powered case analysis and attorney matching.',
      url: window.location.origin
    };

    const shared = await shareContent(shareData);
    if (!shared) {
      // Fallback - copy to clipboard
      navigator.clipboard?.writeText(window.location.origin);
    }
  };

  const mobileFeatures = [
    {
      name: 'PWA Installation',
      description: 'Install as native app',
      status: capabilities.isStandalone ? 'installed' : capabilities.isInstallable ? 'available' : 'unavailable',
      icon: Download,
      action: () => setShowInstallPrompt(true)
    },
    {
      name: 'Push Notifications',
      description: 'Real-time legal alerts',
      status: capabilities.hasPushNotifications ? 'available' : 'unavailable',
      icon: Bell
    },
    {
      name: 'Offline Support',
      description: 'Works without internet',
      status: capabilities.hasBackgroundSync ? 'available' : 'limited',
      icon: Wifi
    },
    {
      name: 'Web Share',
      description: 'Share with other apps',
      status: capabilities.hasWebShare ? 'available' : 'unavailable',
      icon: Share2,
      action: shareApp
    },
    {
      name: 'Secure Messaging',
      description: 'End-to-end encryption',
      status: 'available',
      icon: Shield,
      link: '/secure-messaging'
    },
    {
      name: 'Emergency Features',
      description: '24/7 legal assistance',
      status: 'available',
      icon: AlertTriangle,
      link: '/urgent-match'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
      case 'installed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'limited':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
      case 'installed':
        return '✓';
      case 'limited':
        return '⚠';
      default:
        return '✗';
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-navy-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-start mb-6">
              <HomeButton className="bg-blue-800/50 border-blue-600 text-white hover:bg-blue-700/50" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Smartphone className="w-10 h-10" />
              Mobile App Dashboard
            </h1>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">
              Advanced mobile features and PWA capabilities for Military Legal Shield
            </p>
          </div>

          {/* Device Info */}
          <Card className="mb-8 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Device Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{viewport.width}x{viewport.height}</div>
                  <div className="text-sm text-gray-600">Screen Size</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 capitalize">{viewport.orientation}</div>
                  <div className="text-sm text-gray-600">Orientation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 capitalize">{capabilities.connectionType}</div>
                  <div className="text-sm text-gray-600">Connection</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {capabilities.batteryLevel ? `${Math.round(capabilities.batteryLevel)}%` : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Battery</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PWA Status */}
          <Card className="mb-8 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  PWA Status
                </span>
                <Badge className={`${capabilities.isStandalone ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {capabilities.isStandalone ? 'Installed' : 'Web App'}
                </Badge>
              </CardTitle>
              <CardDescription>
                Progressive Web App features and installation status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {capabilities.isStandalone ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">App Installed</h3>
                  <p className="text-green-600">Military Legal Shield is running as a native app</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Web App Mode</h3>
                  <p className="text-blue-600 mb-4">Install for the best mobile experience</p>
                  {capabilities.isInstallable && (
                    <Button onClick={() => setShowInstallPrompt(true)}>
                      <Download className="w-4 h-4 mr-2" />
                      Install App
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mobile Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {mobileFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card key={feature.name} className="bg-white/95 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{feature.name}</CardTitle>
                          <CardDescription className="text-sm">{feature.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(feature.status)}>
                        {getStatusIcon(feature.status)} {feature.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {feature.action && (
                        <Button onClick={feature.action} size="sm" className="flex-1">
                          Try Now
                        </Button>
                      )}
                      {feature.link && (
                        <Link href={feature.link}>
                          <Button size="sm" variant="outline" className="flex-1">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Offline Handler */}
          <div className="mb-8">
            <OfflineHandler />
          </div>

          {/* Notification Manager */}
          <div className="mb-8">
            <MobileNotificationManager />
          </div>

          {/* Quick Actions */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common mobile app functions and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/urgent-match">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <span className="text-xs">Emergency</span>
                  </Button>
                </Link>
                
                <Link href="/secure-messaging">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2">
                    <MessageSquare className="w-6 h-6 text-blue-500" />
                    <span className="text-xs">Secure Chat</span>
                  </Button>
                </Link>
                
                <Link href="/ai-case-analysis">
                  <Button variant="outline" className="w-full h-20 flex-col gap-2">
                    <Zap className="w-6 h-6 text-purple-500" />
                    <span className="text-xs">AI Analysis</span>
                  </Button>
                </Link>
                
                <Button onClick={shareApp} variant="outline" className="w-full h-20 flex-col gap-2">
                  <Share2 className="w-6 h-6 text-green-500" />
                  <span className="text-xs">Share App</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* PWA Install Prompt */}
      {showInstallPrompt && <PWAInstallPrompt />}
    </PageLayout>
  );
}