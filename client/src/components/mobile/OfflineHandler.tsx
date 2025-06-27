import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Wifi, RefreshCw, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { scheduleBackgroundSync } from '@/lib/mobile-utils';
import { useToast } from '@/hooks/use-toast';

interface OfflineAction {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  data: any;
}

export default function OfflineHandler() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>([]);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load offline actions from localStorage
    loadOfflineActions();

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connection Restored",
        description: "Syncing offline actions...",
      });
      syncOfflineActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "No Internet Connection",
        description: "Working offline. Actions will sync when connection is restored.",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, []);

  const loadOfflineActions = () => {
    const stored = localStorage.getItem('offline-actions');
    if (stored) {
      try {
        const actions = JSON.parse(stored);
        setOfflineActions(actions.map((action: any) => ({
          ...action,
          timestamp: new Date(action.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load offline actions:', error);
      }
    }
  };

  const saveOfflineActions = (actions: OfflineAction[]) => {
    localStorage.setItem('offline-actions', JSON.stringify(actions));
    setOfflineActions(actions);
  };

  const addOfflineAction = (type: string, description: string, data: any) => {
    const newAction: OfflineAction = {
      id: Date.now().toString(),
      type,
      description,
      timestamp: new Date(),
      data
    };

    const updatedActions = [...offlineActions, newAction];
    saveOfflineActions(updatedActions);

    // Schedule background sync
    scheduleBackgroundSync('offline-actions', newAction);

    toast({
      title: "Action Saved",
      description: "Will sync when internet connection is restored.",
    });
  };

  const removeOfflineAction = (id: string) => {
    const updatedActions = offlineActions.filter(action => action.id !== id);
    saveOfflineActions(updatedActions);
  };

  const syncOfflineActions = async () => {
    if (!isOnline || offlineActions.length === 0) return;

    setSyncInProgress(true);

    try {
      // Process each offline action
      for (const action of offlineActions) {
        try {
          let endpoint = '';
          let method = 'POST';

          switch (action.type) {
            case 'emergency-consultation':
              endpoint = '/api/emergency-consultation';
              break;
            case 'case-analysis':
              endpoint = '/api/ai/analyze-case';
              break;
            case 'secure-message':
              endpoint = '/api/secure-messaging/send';
              break;
            case 'attorney-contact':
              endpoint = '/api/attorneys/contact';
              break;
            default:
              continue;
          }

          const response = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action.data)
          });

          if (response.ok) {
            removeOfflineAction(action.id);
            toast({
              title: "Action Synced",
              description: `${action.description} has been processed.`,
            });
          }
        } catch (error) {
          console.error(`Failed to sync action ${action.id}:`, error);
        }
      }

      // Schedule background sync for any remaining actions
      if (offlineActions.length > 0) {
        await scheduleBackgroundSync('offline-actions');
      }

    } finally {
      setSyncInProgress(false);
    }
  };

  const handleServiceWorkerMessage = (event: MessageEvent) => {
    if (event.data?.type === 'SYNC_COMPLETE') {
      loadOfflineActions(); // Refresh the list
      toast({
        title: "Sync Complete",
        description: "All offline actions have been processed.",
      });
    }
  };

  const retrySync = () => {
    if (isOnline) {
      syncOfflineActions();
    } else {
      toast({
        title: "No Connection",
        description: "Please check your internet connection and try again.",
        variant: "destructive"
      });
    }
  };

  const clearOfflineActions = () => {
    saveOfflineActions([]);
    toast({
      title: "Actions Cleared",
      description: "All offline actions have been removed.",
    });
  };

  // Expose addOfflineAction to window for use by other components
  useEffect(() => {
    (window as any).addOfflineAction = addOfflineAction;
    return () => {
      delete (window as any).addOfflineAction;
    };
  }, [offlineActions]);

  return (
    <Card className={`${!isOnline ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-600" />
            )}
            Connection Status
          </CardTitle>
          <Badge variant={isOnline ? "default" : "destructive"}>
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>
        <CardDescription>
          {isOnline 
            ? 'All features available with real-time sync'
            : 'Working offline - actions will sync when connection is restored'
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {offlineActions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Pending Actions ({offlineActions.length})
              </h4>
              {isOnline && (
                <Button
                  onClick={retrySync}
                  disabled={syncInProgress}
                  size="sm"
                  variant="outline"
                >
                  {syncInProgress ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Sync Now
                </Button>
              )}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {offlineActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{action.description}</p>
                    <p className="text-xs text-gray-500">
                      {action.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {action.type}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={clearOfflineActions}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}

        {offlineActions.length === 0 && isOnline && (
          <div className="text-center py-4">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-700">All actions are synced</p>
          </div>
        )}

        {!isOnline && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-medium text-yellow-800 mb-2">Offline Features Available:</h5>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• View cached legal resources and attorneys</li>
              <li>• Compose secure messages (will send when online)</li>
              <li>• Access offline emergency contacts</li>
              <li>• Use AI case analysis (cached responses)</li>
              <li>• Submit emergency consultations (will sync later)</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}