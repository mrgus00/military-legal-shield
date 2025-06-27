import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell, BellOff, Shield, AlertTriangle, MessageSquare, Calendar } from 'lucide-react';
import { requestNotificationPermission, subscribeToPushNotifications } from '@/lib/mobile-utils';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  emergencyAlerts: boolean;
  caseUpdates: boolean;
  appointmentReminders: boolean;
  secureMessages: boolean;
  legalNewsUpdates: boolean;
}

export default function MobileNotificationManager() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    emergencyAlerts: true,
    caseUpdates: true,
    appointmentReminders: true,
    secureMessages: true,
    legalNewsUpdates: false
  });
  const { toast } = useToast();

  useEffect(() => {
    checkNotificationStatus();
    loadSettings();
  }, []);

  const checkNotificationStatus = () => {
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  };

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('notification-settings', JSON.stringify(newSettings));
  };

  const requestPermissions = async () => {
    try {
      const granted = await requestNotificationPermission();
      
      if (granted) {
        setHasPermission(true);
        
        // Subscribe to push notifications
        const subscription = await subscribeToPushNotifications();
        if (subscription) {
          setIsSubscribed(true);
          
          // Send subscription to server
          await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subscription,
              settings
            })
          });
          
          toast({
            title: "Notifications Enabled",
            description: "You'll receive important legal alerts and updates."
          });
        }
      } else {
        toast({
          title: "Permissions Denied",
          description: "You can enable notifications later in your browser settings.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      toast({
        title: "Setup Failed",
        description: "Unable to set up notifications. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
    
    // Update subscription on server
    if (isSubscribed) {
      fetch('/api/notifications/update-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    }
  };

  const testNotification = () => {
    if (hasPermission) {
      new Notification('Military Legal Shield', {
        body: 'Notifications are working correctly!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: 'test-notification'
      });
    }
  };

  if (!('Notification' in window)) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <BellOff className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Notifications are not supported in this browser.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Mobile Notifications
        </CardTitle>
        <CardDescription>
          Manage alerts and updates for your mobile device
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!hasPermission ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Enable Push Notifications</h4>
              <p className="text-sm text-blue-700 mb-4">
                Get instant alerts for emergency legal situations, case updates, and important deadlines.
              </p>
              <Button onClick={requestPermissions} className="w-full">
                <Bell className="w-4 h-4 mr-2" />
                Enable Notifications
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                We'll only send important legal notifications and emergency alerts.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Notifications Enabled</p>
                  <p className="text-sm text-green-700">You'll receive important legal alerts</p>
                </div>
              </div>
              <Button 
                onClick={testNotification}
                variant="outline"
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                Test
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Notification Categories</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="font-medium">Emergency Legal Alerts</p>
                      <p className="text-sm text-gray-600">Urgent legal situations requiring immediate attention</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.emergencyAlerts}
                    onCheckedChange={(checked) => updateSetting('emergencyAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="font-medium">Case Updates</p>
                      <p className="text-sm text-gray-600">Progress updates on your legal cases</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.caseUpdates}
                    onCheckedChange={(checked) => updateSetting('caseUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="font-medium">Appointment Reminders</p>
                      <p className="text-sm text-gray-600">Reminders for consultations and court dates</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.appointmentReminders}
                    onCheckedChange={(checked) => updateSetting('appointmentReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="font-medium">Secure Messages</p>
                      <p className="text-sm text-gray-600">New encrypted messages from attorneys</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.secureMessages}
                    onCheckedChange={(checked) => updateSetting('secureMessages', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Legal News Updates</p>
                      <p className="text-sm text-gray-600">Military legal news and policy changes</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.legalNewsUpdates}
                    onCheckedChange={(checked) => updateSetting('legalNewsUpdates', checked)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium mb-2">Privacy Notice</h5>
              <p className="text-sm text-gray-600">
                Your notification preferences are stored locally and encrypted. We never share 
                your alert settings with third parties.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}