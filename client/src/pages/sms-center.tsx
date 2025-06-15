import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MessageSquare, Phone, AlertTriangle, CheckCircle, Settings, Users, Clock, Shield } from "lucide-react";

export default function SMSCenter() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [serviceMemberName, setServiceMemberName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendWelcomeSMS = async () => {
    if (!phoneNumber || !serviceMemberName) {
      toast({
        title: "Required Fields",
        description: "Please enter both phone number and name",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/sms/welcome', {
        phoneNumber,
        serviceMemberName
      });

      if (response.ok) {
        toast({
          title: "Welcome SMS Sent",
          description: "Message sent successfully to " + phoneNumber,
        });
      } else {
        throw new Error('Failed to send SMS');
      }
    } catch (error) {
      toast({
        title: "SMS Error",
        description: "Failed to send welcome message",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppointmentReminder = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/sms/appointment-reminder', {
        phoneNumber,
        appointmentDetails: {
          attorneyName: 'Col. Sarah Mitchell',
          date: 'January 20, 2025',
          time: '2:00 PM',
          location: 'Fort Liberty Legal Office'
        }
      });

      if (response.ok) {
        toast({
          title: "Appointment Reminder Sent",
          description: "Reminder sent to " + phoneNumber,
        });
      }
    } catch (error) {
      toast({
        title: "SMS Error",
        description: "Failed to send appointment reminder",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaseUpdate = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/sms/case-update', {
        phoneNumber,
        caseUpdate: {
          caseNumber: 'MLS-2025-001',
          status: 'Document Review Complete',
          nextSteps: 'Attorney consultation scheduled for next week',
          attorneyName: 'Col. Sarah Mitchell'
        }
      });

      if (response.ok) {
        toast({
          title: "Case Update Sent",
          description: "Update sent to " + phoneNumber,
        });
      }
    } catch (error) {
      toast({
        title: "SMS Error",
        description: "Failed to send case update",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              SMS Communication Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive SMS notification system for Military Legal Shield platform
            </p>
          </div>

          <Tabs defaultValue="test" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="test">Test Messages</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Test Messages Tab */}
            <TabsContent value="test" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-orange-600" />
                      <span>SMS Testing</span>
                    </CardTitle>
                    <CardDescription>
                      Test SMS notifications with real phone numbers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Service Member Name</Label>
                      <Input
                        id="name"
                        placeholder="SGT John Smith"
                        value={serviceMemberName}
                        onChange={(e) => setServiceMemberName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        onClick={handleSendWelcomeSMS}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Send Welcome Message
                      </Button>
                      
                      <Button
                        onClick={handleAppointmentReminder}
                        disabled={isLoading}
                        variant="outline"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Send Appointment Reminder
                      </Button>
                      
                      <Button
                        onClick={handleCaseUpdate}
                        disabled={isLoading}
                        variant="outline"
                        className="border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Case Update
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Status Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-blue-600" />
                      <span>SMS Status</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-800">Twilio Connected</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-blue-800">Emergency Alerts</span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Ready</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Users className="h-5 w-5 text-orange-600" />
                          <span className="font-medium text-orange-800">Attorney Network</span>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">Online</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Emergency Alerts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2 text-gray-600">
                      <li>• Instant attorney notifications</li>
                      <li>• 24/7 emergency hotline alerts</li>
                      <li>• Priority case escalation</li>
                      <li>• Automatic response confirmation</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-blue-700">
                      <Clock className="h-5 w-5" />
                      <span>Appointment Management</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2 text-gray-600">
                      <li>• Automated reminders</li>
                      <li>• Confirmation requests</li>
                      <li>• Schedule changes</li>
                      <li>• Location updates</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-green-700">
                      <MessageSquare className="h-5 w-5" />
                      <span>Case Updates</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2 text-gray-600">
                      <li>• Status notifications</li>
                      <li>• Document updates</li>
                      <li>• Next steps guidance</li>
                      <li>• Attorney communications</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Webhook Configuration</CardTitle>
                  <CardDescription>
                    Configure Twilio webhook settings for incoming messages
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <Input 
                      value="https://your-domain.com/api/sms/webhook"
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Supported Commands</Label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">HELP</span> - Show help menu
                        </div>
                        <div>
                          <span className="font-medium">STOP</span> - Unsubscribe
                        </div>
                        <div>
                          <span className="font-medium">START</span> - Subscribe
                        </div>
                        <div>
                          <span className="font-medium">EMERGENCY</span> - Get help link
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">1,247</p>
                        <p className="text-sm text-gray-600">Messages Sent</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                      <div>
                        <p className="text-2xl font-bold">23</p>
                        <p className="text-sm text-gray-600">Emergency Alerts</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">456</p>
                        <p className="text-sm text-gray-600">Reminders</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-8 w-8 text-orange-600" />
                      <div>
                        <p className="text-2xl font-bold">98.5%</p>
                        <p className="text-sm text-gray-600">Delivery Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}