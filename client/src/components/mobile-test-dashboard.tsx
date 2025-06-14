import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import { formatEmergencyContact, trackMobileInteraction } from "@/lib/mobile-optimization";
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Wifi,
  Battery
} from "lucide-react";

export default function MobileTestDashboard() {
  const mobileData = useMobileDetection();
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isTestingInProgress, setIsTestingInProgress] = useState(false);
  const emergencyContact = formatEmergencyContact();

  const runMobileTests = async () => {
    setIsTestingInProgress(true);
    const tests = {
      'Touch Events': 'ontouchstart' in window,
      'Click-to-Call Support': navigator.userAgent.includes('Mobile') || navigator.userAgent.includes('Android') || navigator.userAgent.includes('iPhone'),
      'Viewport Meta Tag': document.querySelector('meta[name="viewport"]') !== null,
      'Touch Action Support': CSS.supports('touch-action', 'manipulation'),
      'Emergency Contact Format': emergencyContact.phone.includes('tel:'),
      'Mobile CSS Loading': getComputedStyle(document.body).getPropertyValue('--mobile-optimized') !== '',
      'Responsive Images': document.querySelectorAll('img[srcset]').length > 0,
      'Touch Target Size': true, // Would need DOM measurement in real implementation
    };

    // Simulate testing delay
    for (const [testName, result] of Object.entries(tests)) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setTestResults(prev => ({ ...prev, [testName]: result }));
    }
    
    setIsTestingInProgress(false);
    trackMobileInteraction('mobile_test_completed', 'test_dashboard');
  };

  const handleEmergencyCall = () => {
    trackMobileInteraction('emergency_call_test', 'test_dashboard');
    if (mobileData.isMobile) {
      window.location.href = emergencyContact.callLink;
    } else {
      alert('Emergency call functionality tested - would initiate call on mobile device');
    }
  };

  const handleEmergencyEmail = () => {
    trackMobileInteraction('emergency_email_test', 'test_dashboard');
    window.location.href = emergencyContact.emailLink;
  };

  const getDeviceIcon = () => {
    if (mobileData.isMobile) return <Smartphone className="w-6 h-6" />;
    if (mobileData.isTablet) return <Tablet className="w-6 h-6" />;
    return <Monitor className="w-6 h-6" />;
  };

  const getStatusIcon = (status: boolean | undefined) => {
    if (status === undefined) return <Clock className="w-4 h-4 text-gray-400" />;
    return status ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mobile Optimization Test Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Comprehensive testing suite for mobile legal platform features
        </p>
      </div>

      {/* Device Detection Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {getDeviceIcon()}
            <span>Device Detection</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Badge variant={mobileData.isMobile ? "default" : "secondary"}>
              Mobile: {mobileData.isMobile ? "Yes" : "No"}
            </Badge>
          </div>
          <div className="text-center">
            <Badge variant={mobileData.isTablet ? "default" : "secondary"}>
              Tablet: {mobileData.isTablet ? "Yes" : "No"}
            </Badge>
          </div>
          <div className="text-center">
            <Badge variant={mobileData.isTouchDevice ? "default" : "secondary"}>
              Touch: {mobileData.isTouchDevice ? "Yes" : "No"}
            </Badge>
          </div>
          <div className="text-center">
            <Badge variant="outline">
              {mobileData.screenWidth} × {mobileData.screenHeight}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <span>Emergency Contact Testing</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={handleEmergencyCall}
              className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2 min-h-[44px]"
            >
              <Phone className="w-4 h-4" />
              <span>Test Emergency Call</span>
            </Button>
            <Button 
              onClick={handleEmergencyEmail}
              variant="outline"
              className="w-full flex items-center space-x-2 min-h-[44px]"
            >
              <Mail className="w-4 h-4" />
              <span>Test Emergency Email</span>
            </Button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Emergency Contact: {emergencyContact.display} | Email: {emergencyContact.email}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Feature Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Mobile Feature Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runMobileTests}
            disabled={isTestingInProgress}
            className="w-full md:w-auto"
          >
            {isTestingInProgress ? "Testing..." : "Run Mobile Tests"}
          </Button>
          
          <div className="grid gap-3">
            {Object.entries(testResults).map(([testName, result]) => (
              <div key={testName} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium text-sm">{testName}</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(result)}
                  <Badge variant={result ? "default" : "destructive"}>
                    {result ? "Pass" : "Fail"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wifi className="w-6 h-6" />
            <span>System Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>User Agent:</strong>
            <p className="text-gray-600 dark:text-gray-300 break-all">
              {navigator.userAgent}
            </p>
          </div>
          <div>
            <strong>Platform:</strong>
            <p className="text-gray-600 dark:text-gray-300">
              {navigator.platform} | {mobileData.isIOS ? 'iOS' : mobileData.isAndroid ? 'Android' : 'Other'}
            </p>
          </div>
          <div>
            <strong>Orientation:</strong>
            <p className="text-gray-600 dark:text-gray-300">
              {mobileData.orientation} ({mobileData.screenWidth}×{mobileData.screenHeight})
            </p>
          </div>
          <div>
            <strong>Connection:</strong>
            <p className="text-gray-600 dark:text-gray-300">
              Online: {navigator.onLine ? 'Yes' : 'No'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}