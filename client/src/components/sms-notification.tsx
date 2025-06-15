import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MessageSquare, Phone, AlertTriangle, CheckCircle } from "lucide-react";

interface SMSNotificationProps {
  type?: 'welcome' | 'appointment' | 'case-update' | 'emergency';
  showForm?: boolean;
}

export function SMSNotification({ type = 'welcome', showForm = true }: SMSNotificationProps) {
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
          title: "SMS Sent",
          description: "Welcome message sent successfully",
        });
        setPhoneNumber('');
        setServiceMemberName('');
      } else {
        throw new Error('Failed to send SMS');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send SMS notification",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAppointmentReminder = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number for testing",
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
          description: "Test appointment reminder sent successfully",
        });
      } else {
        throw new Error('Failed to send appointment reminder');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send appointment reminder",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestCaseUpdate = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number for testing",
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
          description: "Test case update sent successfully",
        });
      } else {
        throw new Error('Failed to send case update');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send case update",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <div>
          <p className="text-sm font-medium text-green-800">SMS Notifications Active</p>
          <p className="text-xs text-green-600">Emergency alerts and updates will be sent via SMS</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-orange-600" />
          <span>SMS Notifications</span>
        </CardTitle>
        <CardDescription>
          Test SMS notification features for Military Legal Shield platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phone Number Input */}
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

        {/* Service Member Name Input */}
        <div className="space-y-2">
          <Label htmlFor="name">Service Member Name</Label>
          <Input
            id="name"
            placeholder="SGT John Smith"
            value={serviceMemberName}
            onChange={(e) => setServiceMemberName(e.target.value)}
          />
        </div>

        {/* SMS Type Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-green-700 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Welcome Messages
          </Badge>
          <Badge variant="outline" className="text-blue-700 border-blue-300">
            <Phone className="h-3 w-3 mr-1" />
            Appointment Reminders
          </Badge>
          <Badge variant="outline" className="text-purple-700 border-purple-300">
            <MessageSquare className="h-3 w-3 mr-1" />
            Case Updates
          </Badge>
          <Badge variant="outline" className="text-red-700 border-red-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Emergency Alerts
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={handleSendWelcomeSMS}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Send Welcome SMS
          </Button>
          
          <Button
            onClick={handleTestAppointmentReminder}
            disabled={isLoading}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            Test Appointment
          </Button>
          
          <Button
            onClick={handleTestCaseUpdate}
            disabled={isLoading}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            Test Case Update
          </Button>
        </div>

        {/* Information Panel */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-semibold text-orange-800 mb-2">SMS Features Available</h4>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Emergency legal alerts to attorneys and hotlines</li>
            <li>• Appointment confirmations and reminders</li>
            <li>• Case status updates and next steps</li>
            <li>• Welcome messages for new subscribers</li>
            <li>• Two-way SMS support for HELP, STOP commands</li>
          </ul>
        </div>

        {/* Webhook Information */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Webhook Configuration</h4>
          <p className="text-sm text-gray-600 mb-2">
            Configure your Twilio webhook URL to handle incoming messages:
          </p>
          <code className="text-xs bg-gray-100 p-2 rounded block">
            https://your-domain.com/api/sms/webhook
          </code>
        </div>
      </CardContent>
    </Card>
  );
}