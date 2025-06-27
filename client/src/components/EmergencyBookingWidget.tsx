import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Phone, Video, MapPin, Clock, Shield, AlertTriangle } from 'lucide-react';

interface EmergencyBookingData {
  urgencyLevel: 'critical' | 'urgent' | 'high' | 'routine';
  issueType: string;
  briefDescription: string;
  preferredContactMethod: 'phone' | 'video' | 'in-person';
  contactInfo: {
    phone: string;
    email: string;
    location?: string;
    preferredTime?: string;
    timezone: string;
  };
  estimatedDuration: number;
}

interface EmergencyBookingWidgetProps {
  className?: string;
  showHeader?: boolean;
}

const EmergencyBookingWidget: React.FC<EmergencyBookingWidgetProps> = ({ 
  className = '', 
  showHeader = true 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<EmergencyBookingData>({
    urgencyLevel: 'urgent',
    issueType: '',
    briefDescription: '',
    preferredContactMethod: 'phone',
    contactInfo: {
      phone: '',
      email: '',
      location: '',
      preferredTime: '',
      timezone: 'America/New_York'
    },
    estimatedDuration: 30
  });
  const [step, setStep] = useState<'form' | 'confirmation' | 'success'>('form');
  const [bookingResult, setBookingResult] = useState<any>(null);

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: EmergencyBookingData) => {
      const response = await apiRequest('POST', '/api/emergency-booking/create', bookingData);
      return response;
    },
    onSuccess: (data) => {
      setBookingResult(data);
      setStep('success');
      toast({
        title: "Emergency Consultation Booked!",
        description: `Reference: ${data.reference}. Attorney will contact you shortly.`,
      });
    },
    onError: (error: any) => {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Unable to book emergency consultation. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleQuickBook = () => {
    if (!formData.issueType || !formData.briefDescription || !formData.contactInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before booking.",
        variant: "destructive",
      });
      return;
    }
    setStep('confirmation');
  };

  const confirmBooking = () => {
    createBookingMutation.mutate(formData);
  };

  const issueTypes = [
    { value: 'court-martial', label: 'Court-Martial Defense', urgency: 'critical' },
    { value: 'security-clearance', label: 'Security Clearance Issue', urgency: 'urgent' },
    { value: 'administrative-action', label: 'Administrative Action', urgency: 'high' },
    { value: 'meb-peb', label: 'MEB/PEB Process', urgency: 'high' },
    { value: 'discharge-upgrade', label: 'Discharge Upgrade', urgency: 'routine' },
    { value: 'family-law', label: 'Military Family Law', urgency: 'routine' },
    { value: 'finance', label: 'Financial/Debt Issues', urgency: 'routine' },
    { value: 'criminal', label: 'Criminal Defense', urgency: 'critical' },
    { value: 'other', label: 'Other Legal Issue', urgency: 'routine' }
  ];

  const urgencyColors = {
    critical: 'bg-red-100 text-red-800 border-red-300',
    urgent: 'bg-orange-100 text-orange-800 border-orange-300',
    high: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    routine: 'bg-green-100 text-green-800 border-green-300'
  };

  const urgencyIcons = {
    critical: <AlertTriangle className="w-4 h-4" />,
    urgent: <Clock className="w-4 h-4" />,
    high: <Shield className="w-4 h-4" />,
    routine: <Phone className="w-4 h-4" />
  };

  if (step === 'success' && bookingResult) {
    return (
      <Card className={`${className} border-green-200 bg-green-50`}>
        <CardHeader className="text-center">
          <CardTitle className="text-green-800 flex items-center justify-center gap-2">
            <Shield className="w-6 h-6" />
            Emergency Consultation Confirmed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-green-800">
              {bookingResult.reference}
            </div>
            <p className="text-sm text-green-700">Your booking reference number</p>
          </div>
          
          <Alert>
            <AlertDescription>
              {bookingResult.instructions}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
              <span className="font-medium">Attorney:</span>
              <span>{bookingResult.attorney.name}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
              <span className="font-medium">Firm:</span>
              <span>{bookingResult.attorney.firm}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
              <span className="font-medium">Contact Time:</span>
              <span>{new Date(bookingResult.scheduledDateTime).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
              <span className="font-medium">Method:</span>
              <span className="capitalize">{formData.preferredContactMethod}</span>
            </div>
            {bookingResult.meetingLink && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-800">Video Meeting Details:</p>
                <p className="text-sm text-blue-700">
                  Link: <a href={bookingResult.meetingLink} className="underline" target="_blank" rel="noopener noreferrer">
                    Join Meeting
                  </a>
                </p>
                {bookingResult.meetingPassword && (
                  <p className="text-sm text-blue-700">
                    Password: <code className="bg-blue-100 px-1 rounded">{bookingResult.meetingPassword}</code>
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="text-center space-y-2">
            <Button 
              onClick={() => {
                setStep('form');
                setBookingResult(null);
                setFormData({
                  urgencyLevel: 'urgent',
                  issueType: '',
                  briefDescription: '',
                  preferredContactMethod: 'phone',
                  contactInfo: {
                    phone: '',
                    email: '',
                    location: '',
                    preferredTime: '',
                    timezone: 'America/New_York'
                  },
                  estimatedDuration: 30
                });
              }}
              variant="outline"
              className="w-full"
            >
              Book Another Consultation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'confirmation') {
    const selectedIssue = issueTypes.find(issue => issue.value === formData.issueType);
    const estimatedCost = formData.urgencyLevel === 'critical' ? '$450' : 
                         formData.urgencyLevel === 'urgent' ? '$300' : 
                         formData.urgencyLevel === 'high' ? '$225' : '$150';

    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Confirm Emergency Booking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              Please review your emergency consultation details before confirming.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Issue Type:</span>
              <span>{selectedIssue?.label}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Urgency:</span>
              <Badge className={urgencyColors[formData.urgencyLevel]}>
                {urgencyIcons[formData.urgencyLevel]}
                <span className="ml-1 capitalize">{formData.urgencyLevel}</span>
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Contact Method:</span>
              <span className="capitalize flex items-center gap-1">
                {formData.preferredContactMethod === 'phone' && <Phone className="w-4 h-4" />}
                {formData.preferredContactMethod === 'video' && <Video className="w-4 h-4" />}
                {formData.preferredContactMethod === 'in-person' && <MapPin className="w-4 h-4" />}
                {formData.preferredContactMethod}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Phone:</span>
              <span>{formData.contactInfo.phone}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Estimated Cost:</span>
              <span className="font-bold text-lg">{estimatedCost}</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Description:</h4>
            <p className="text-sm text-blue-700">{formData.briefDescription}</p>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => setStep('form')} 
              variant="outline" 
              className="flex-1"
            >
              Back to Edit
            </Button>
            <Button 
              onClick={confirmBooking}
              disabled={createBookingMutation.isPending}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {createBookingMutation.isPending ? 'Booking...' : 'Confirm Emergency Booking'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            Emergency Legal Consultation
          </CardTitle>
          <p className="text-sm text-gray-600">
            Get immediate legal assistance from verified military attorneys
          </p>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Legal Issue Type *</label>
            <Select 
              value={formData.issueType} 
              onValueChange={(value) => {
                const selectedIssue = issueTypes.find(issue => issue.value === value);
                setFormData(prev => ({
                  ...prev,
                  issueType: value,
                  urgencyLevel: selectedIssue?.urgency as any || 'routine'
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your legal issue" />
              </SelectTrigger>
              <SelectContent>
                {issueTypes.map(issue => (
                  <SelectItem key={issue.value} value={issue.value}>
                    <div className="flex items-center gap-2">
                      <span>{issue.label}</span>
                      <Badge variant="outline" className="text-xs">
                        {issue.urgency}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Brief Description *</label>
            <Textarea
              value={formData.briefDescription}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                briefDescription: e.target.value
              }))}
              placeholder="Briefly describe your legal situation (minimum 20 characters)"
              className="min-h-[80px]"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.briefDescription.length}/500 characters
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <Input
                type="tel"
                value={formData.contactInfo.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: { ...prev.contactInfo, phone: e.target.value }
                }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <Input
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: { ...prev.contactInfo, email: e.target.value }
                }))}
                placeholder="your.email@military.mil"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Preferred Contact Method</label>
            <Select 
              value={formData.preferredContactMethod} 
              onValueChange={(value: any) => setFormData(prev => ({
                ...prev,
                preferredContactMethod: value
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Call
                  </div>
                </SelectItem>
                <SelectItem value="video">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Video Call
                  </div>
                </SelectItem>
                <SelectItem value="in-person">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    In-Person Meeting
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.issueType && (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Urgency Level:</span>
                <Badge className={urgencyColors[formData.urgencyLevel]}>
                  {urgencyIcons[formData.urgencyLevel]}
                  <span className="ml-1 capitalize">{formData.urgencyLevel}</span>
                </Badge>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {formData.urgencyLevel === 'critical' && 'Attorney will contact you within 5 minutes'}
                {formData.urgencyLevel === 'urgent' && 'Attorney will contact you within 15 minutes'}
                {formData.urgencyLevel === 'high' && 'Attorney will contact you within 30 minutes'}
                {formData.urgencyLevel === 'routine' && 'Attorney will contact you within 1 hour'}
              </div>
            </div>
          )}
        </div>

        <Button 
          onClick={handleQuickBook}
          disabled={!formData.issueType || !formData.briefDescription || !formData.contactInfo.phone}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Book Emergency Consultation
        </Button>

        <div className="text-xs text-gray-500 text-center">
          By clicking "Book Emergency Consultation", you agree to our terms of service and 
          authorize emergency contact via SMS and phone calls.
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyBookingWidget;