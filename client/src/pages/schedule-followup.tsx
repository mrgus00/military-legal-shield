import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Clock,
  Video,
  Phone,
  MessageCircle,
  CheckCircle,
  User,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface FollowUpData {
  attorneyId: string;
  preferredDate: string;
  preferredTime: string;
  consultationType: 'video' | 'phone' | 'in-person';
  urgency: 'routine' | 'urgent' | 'priority';
  followUpReason: string;
  additionalNotes: string;
  documentsToReview: string[];
}

export default function ScheduleFollowUp() {
  const [followUpData, setFollowUpData] = useState<FollowUpData>({
    attorneyId: '',
    preferredDate: '',
    preferredTime: '',
    consultationType: 'video',
    urgency: 'routine',
    followUpReason: '',
    additionalNotes: '',
    documentsToReview: []
  });
  const [schedulingStep, setSchedulingStep] = useState(1);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedAttorney, setSelectedAttorney] = useState<any>(null);
  const { toast } = useToast();

  const scheduleFollowUpMutation = useMutation({
    mutationFn: async (data: FollowUpData) => {
      return await apiRequest('POST', '/api/schedule-followup', data);
    },
    onSuccess: (data) => {
      setSchedulingStep(3);
      toast({
        title: "Follow-up Scheduled",
        description: "Your follow-up consultation has been scheduled successfully",
      });
    },
    onError: () => {
      toast({
        title: "Scheduling Failed",
        description: "Unable to schedule follow-up consultation",
        variant: "destructive"
      });
    }
  });

  const handleScheduleFollowUp = () => {
    scheduleFollowUpMutation.mutate(followUpData);
  };

  const getAvailableSlots = (date: string) => {
    // Simulate available time slots based on date
    const slots = [
      '9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', 
      '3:00 PM', '4:30 PM', '6:00 PM'
    ];
    setAvailableSlots(slots);
    setSchedulingStep(2);
  };

  if (schedulingStep === 3) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-6 w-6" />
              Follow-up Consultation Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-medium">{followUpData.preferredDate} at {followUpData.preferredTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Consultation Type</p>
                <p className="font-medium capitalize">{followUpData.consultationType}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900">Next Steps</h4>
              <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                <li>Calendar invitation sent to your email</li>
                <li>Pre-consultation documents will be shared 24 hours prior</li>
                <li>Meeting link or call details provided before appointment</li>
                <li>Reminder notifications scheduled</li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => window.location.href = '/dashboard'}>
                Return to Dashboard
              </Button>
              <Button variant="outline" onClick={() => setSchedulingStep(1)}>
                Schedule Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (schedulingStep === 2) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Time Slot</CardTitle>
            <CardDescription>
              Available times for {followUpData.preferredDate}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-3">
              {availableSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant={followUpData.preferredTime === slot ? "default" : "outline"}
                  onClick={() => setFollowUpData({...followUpData, preferredTime: slot})}
                  className="h-12"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {slot}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button 
                onClick={() => setSchedulingStep(1)}
                variant="outline"
              >
                Back
              </Button>
              <Button 
                onClick={handleScheduleFollowUp}
                disabled={!followUpData.preferredTime || scheduleFollowUpMutation.isPending}
              >
                {scheduleFollowUpMutation.isPending ? 'Scheduling...' : 'Confirm Follow-up'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Schedule Follow-up Consultation
          </CardTitle>
          <CardDescription>
            Continue your legal support with a scheduled follow-up session
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Follow-up Details Form */}
      <Card>
        <CardHeader>
          <CardTitle>Consultation Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Consultation Type Selection */}
          <div className="space-y-3">
            <Label>Consultation Type</Label>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { type: 'video', icon: Video, label: 'Video Call', desc: 'Face-to-face consultation' },
                { type: 'phone', icon: Phone, label: 'Phone Call', desc: 'Audio-only consultation' },
                { type: 'in-person', icon: User, label: 'In-Person', desc: 'Office visit' }
              ].map(({ type, icon: Icon, label, desc }) => (
                <Card 
                  key={type}
                  className={`cursor-pointer transition-all ${
                    followUpData.consultationType === type 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setFollowUpData({...followUpData, consultationType: type as any})}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <h3 className="font-semibold">{label}</h3>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Urgency Level */}
          <div className="space-y-3">
            <Label>Urgency Level</Label>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { level: 'routine', label: 'Routine', desc: 'Within 2 weeks', color: 'bg-green-50 border-green-200' },
                { level: 'urgent', label: 'Urgent', desc: 'Within 1 week', color: 'bg-yellow-50 border-yellow-200' },
                { level: 'priority', label: 'Priority', desc: 'Within 3 days', color: 'bg-red-50 border-red-200' }
              ].map(({ level, label, desc, color }) => (
                <Card 
                  key={level}
                  className={`cursor-pointer transition-all ${
                    followUpData.urgency === level 
                      ? `border-blue-500 ${color}` 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setFollowUpData({...followUpData, urgency: level as any})}
                >
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold">{label}</h3>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preferredDate">Preferred Date</Label>
              <Input 
                id="preferredDate"
                type="date"
                value={followUpData.preferredDate}
                onChange={(e) => setFollowUpData({...followUpData, preferredDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="followUpReason">Follow-up Reason</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={followUpData.followUpReason}
                onChange={(e) => setFollowUpData({...followUpData, followUpReason: e.target.value})}
              >
                <option value="">Select reason</option>
                <option value="case-update">Case Update Discussion</option>
                <option value="document-review">Document Review</option>
                <option value="strategy-planning">Strategy Planning</option>
                <option value="court-preparation">Court Preparation</option>
                <option value="settlement-discussion">Settlement Discussion</option>
                <option value="general-consultation">General Consultation</option>
              </select>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea 
              id="additionalNotes"
              placeholder="Describe specific topics you want to discuss or questions you have..."
              value={followUpData.additionalNotes}
              onChange={(e) => setFollowUpData({...followUpData, additionalNotes: e.target.value})}
              rows={3}
            />
          </div>

          <Button 
            onClick={() => getAvailableSlots(followUpData.preferredDate)}
            disabled={!followUpData.preferredDate || !followUpData.followUpReason}
            className="w-full"
          >
            Check Available Times
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}