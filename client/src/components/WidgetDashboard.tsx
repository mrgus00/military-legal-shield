import { useState } from 'react';
import { Grid3X3, Maximize2, Minimize2, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GoogleCalendarWidget from './widgets/GoogleCalendarWidget';
import GoogleDriveWidget from './widgets/GoogleDriveWidget';
import SmartWidget from './widgets/SmartWidget';

interface WidgetConfig {
  id: string;
  name: string;
  component: React.ComponentType;
  enabled: boolean;
  size: 'small' | 'medium' | 'large';
  position: number;
}

export default function WidgetDashboard() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    {
      id: 'calendar',
      name: 'Google Calendar',
      component: GoogleCalendarWidget,
      enabled: true,
      size: 'medium',
      position: 1
    },
    {
      id: 'drive',
      name: 'Google Drive',
      component: GoogleDriveWidget,
      enabled: true,
      size: 'medium',
      position: 2
    },
    {
      id: 'smart',
      name: 'Smart Assistant',
      component: SmartWidget,
      enabled: true,
      size: 'large',
      position: 3
    }
  ]);

  const [isConfigMode, setIsConfigMode] = useState(false);

  const toggleWidget = (widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, enabled: !widget.enabled }
        : widget
    ));
  };

  const changeWidgetSize = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, size }
        : widget
    ));
  };

  const getGridClass = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-1 row-span-1';
      case 'medium': return 'col-span-1 row-span-2';
      case 'large': return 'col-span-2 row-span-2';
      default: return 'col-span-1 row-span-1';
    }
  };

  const enabledWidgets = widgets.filter(widget => widget.enabled);

  return (
    <div className="space-y-4">
      {/* Widget Dashboard Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Grid3X3 className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Smart Widgets</h2>
          <Badge variant="secondary" className="text-xs">
            {enabledWidgets.length} Active
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsConfigMode(!isConfigMode)}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          {isConfigMode ? 'Done' : 'Configure'}
        </Button>
      </div>

      {/* Configuration Mode */}
      {isConfigMode && (
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Widget Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {widgets.map((widget) => (
              <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={widget.enabled}
                    onChange={() => toggleWidget(widget.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="font-medium">{widget.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={widget.size}
                    onChange={(e) => changeWidgetSize(widget.id, e.target.value as any)}
                    className="text-sm border rounded px-2 py-1"
                    disabled={!widget.enabled}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                  <Badge variant={widget.enabled ? "default" : "secondary"} className="text-xs">
                    {widget.enabled ? "On" : "Off"}
                  </Badge>
                </div>
              </div>
            ))}
            <div className="text-xs text-gray-500 pt-2 border-t">
              Configure widget visibility and sizes. Changes are applied immediately.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Widgets Grid */}
      {enabledWidgets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
          {enabledWidgets
            .sort((a, b) => a.position - b.position)
            .map((widget) => {
              const WidgetComponent = widget.component;
              return (
                <div
                  key={widget.id}
                  className={`${getGridClass(widget.size)} min-h-[300px]`}
                >
                  <WidgetComponent />
                </div>
              );
            })}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Grid3X3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-600 mb-2">No Widgets Active</h3>
            <p className="text-sm text-gray-500 mb-4">
              Enable widgets to access your calendar, files, and smart insights
            </p>
            <Button
              variant="outline"
              onClick={() => setIsConfigMode(true)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configure Widgets
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Widget Benefits Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Grid3X3 className="h-4 w-4 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-blue-900">Enhanced Data Accessibility</h3>
              <p className="text-sm text-blue-700">
                These widgets provide quick access to your essential information:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Google Calendar:</strong> View legal appointments and consultations</li>
                <li>• <strong>Google Drive:</strong> Access documents and files directly</li>
                <li>• <strong>Smart Assistant:</strong> AI-powered insights and quick actions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}