import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/page-layout";
import { AlertTriangle, Clock, Shield, Phone, MessageSquare, CheckCircle, Zap, Scale, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import MilitaryTooltip, { MILITARY_TOOLTIPS } from "@/components/military-tooltip";

interface EmergencyConsultationRequest {
  fullName: string;
  rank: string;
  branch: string;
  unit: string;
  email: string;
  phone: string;
  legalIssue: string;
  urgencyLevel: string;
  description: string;
  availableTimeSlots: string[];
  preferredContactMethod: string;
}

export default function UrgentMatch() {
  const [formData, setFormData] = useState<EmergencyConsultationRequest>({
    fullName: "",
    rank: "",
    branch: "",
    unit: "",
    email: "",
    phone: "",
    legalIssue: "",
    urgencyLevel: "",
    description: "",
    availableTimeSlots: [],
    preferredContactMethod: ""
  });

  const { toast } = useToast();

  const emergencyConsultationMutation = useMutation({
    mutationFn: async (data: EmergencyConsultationRequest) => {
      return await apiRequest("POST", "/api/emergency-consultation", data);
    },
    onSuccess: () => {
      toast({
        title: "Emergency Consultation Requested",
        description: "An attorney will contact you within 30 minutes. Check your email for confirmation.",
      });
      // Reset form
      setFormData({
        fullName: "",
        rank: "",
        branch: "",
        unit: "",
        email: "",
        phone: "",
        legalIssue: "",
        urgencyLevel: "",
        description: "",
        availableTimeSlots: [],
        preferredContactMethod: ""
      });
    },
    onError: (error) => {
      toast({
        title: "Request Failed",
        description: "Unable to submit emergency consultation request. Please try again or call our emergency line.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.legalIssue || !formData.urgencyLevel) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    emergencyConsultationMutation.mutate(formData);
  };

  const handleTimeSlotToggle = (timeSlot: string) => {
    setFormData(prev => ({
      ...prev,
      availableTimeSlots: prev.availableTimeSlots.includes(timeSlot)
        ? prev.availableTimeSlots.filter(slot => slot !== timeSlot)
        : [...prev.availableTimeSlots, timeSlot]
    }));
  };

  const legalIssues = [
    "Court-Martial Defense",
    "Article 15 (Non-Judicial Punishment)",
    "DUI/DWI",
    "False Accusations",
    "Military Sexual Trauma (MST)",
    "Discharge Upgrade",
    "Security Clearance Issues",
    "Family Law/Divorce",
    "Criminal Defense",
    "Administrative Separation",
    "Other"
  ];

  const urgencyLevels = [
    { value: "immediate", label: "Immediate (Within 1 hour)", color: "text-red-600" },
    { value: "urgent", label: "Urgent (Within 24 hours)", color: "text-orange-600" },
    { value: "priority", label: "Priority (Within 48 hours)", color: "text-yellow-600" }
  ];

  const timeSlots = [
    "Now (Available immediately)",
    "Morning (8 AM - 12 PM)",
    "Afternoon (12 PM - 5 PM)",
    "Evening (5 PM - 8 PM)",
    "Weekend availability"
  ];

  return (
    <PageLayout>
      {/* Emergency Header */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-12 sm:py-16">
        <div className="w-full max-w-full mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-red-500 rounded-full text-white text-sm font-medium mb-4 animate-pulse">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Emergency Legal Support
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Immediate Legal Consultation
            </h1>
            
            <p className="text-lg sm:text-xl text-red-100 mb-6 max-w-3xl mx-auto">
              Get connected with a military attorney within 30 minutes. Available 24/7 for urgent legal matters.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="bg-red-500/20 rounded-lg p-3 sm:p-4">
                <Clock className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-semibold">Response in 30 min</p>
              </div>
              <div className="bg-red-500/20 rounded-lg p-3 sm:p-4">
                <Shield className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-semibold">Confidential & Secure</p>
              </div>
              <div className="bg-red-500/20 rounded-lg p-3 sm:p-4">
                <Users className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-semibold">Military Specialists</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Consultation Form */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="w-full max-w-full mx-auto px-3 sm:px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-red-200 shadow-xl">
              <CardHeader className="bg-red-50 border-b border-red-200">
                <CardTitle className="text-xl sm:text-2xl text-red-800 flex items-center">
                  <Zap className="w-6 h-6 mr-2" />
                  Emergency Consultation Request
                </CardTitle>
                <CardDescription className="text-red-600">
                  Complete this form to connect with an available military attorney immediately.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName" className="text-sm font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Enter your full name"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="rank" className="text-sm font-medium">
                        Rank
                      </Label>
                      <Input
                        id="rank"
                        type="text"
                        value={formData.rank}
                        onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                        placeholder="e.g., E-5, O-3, W-2"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="branch" className="text-sm font-medium">
                        Military Branch
                      </Label>
                      <Select value={formData.branch} onValueChange={(value) => setFormData({ ...formData, branch: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select your branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="army">U.S. Army</SelectItem>
                          <SelectItem value="navy">U.S. Navy</SelectItem>
                          <SelectItem value="marines">U.S. Marine Corps</SelectItem>
                          <SelectItem value="airforce">U.S. Air Force</SelectItem>
                          <SelectItem value="spaceforce">U.S. Space Force</SelectItem>
                          <SelectItem value="coastguard">U.S. Coast Guard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="unit" className="text-sm font-medium">
                        Unit/Installation
                      </Label>
                      <Input
                        id="unit"
                        type="text"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        placeholder="e.g., Fort Bragg, USS Enterprise"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  {/* Legal Issue Details */}
                  <div>
                    <Label htmlFor="legalIssue" className="text-sm font-medium">
                      Type of Legal Issue *
                    </Label>
                    <Select value={formData.legalIssue} onValueChange={(value) => setFormData({ ...formData, legalIssue: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select the type of legal issue" />
                      </SelectTrigger>
                      <SelectContent>
                        {legalIssues.map((issue) => (
                          <SelectItem key={issue} value={issue}>{issue}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="urgencyLevel" className="text-sm font-medium">
                      Urgency Level *
                    </Label>
                    <Select value={formData.urgencyLevel} onValueChange={(value) => setFormData({ ...formData, urgencyLevel: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="How urgent is your situation?" />
                      </SelectTrigger>
                      <SelectContent>
                        {urgencyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <span className={level.color}>{level.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium">
                      Brief Description of Your Situation
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Provide a brief overview of your legal situation (confidential)"
                      className="mt-1 h-24"
                    />
                  </div>

                  {/* Availability */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      When are you available for consultation?
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <label key={slot} className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={formData.availableTimeSlots.includes(slot)}
                            onChange={() => handleTimeSlotToggle(slot)}
                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          />
                          <span className="text-sm">{slot}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contactMethod" className="text-sm font-medium">
                      Preferred Contact Method
                    </Label>
                    <Select value={formData.preferredContactMethod} onValueChange={(value) => setFormData({ ...formData, preferredContactMethod: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="How should we contact you?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="text">Text Message</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={emergencyConsultationMutation.isPending}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-lg"
                    >
                      {emergencyConsultationMutation.isPending ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Connecting You to an Attorney...
                        </>
                      ) : (
                        <>
                          <Scale className="w-5 h-5 mr-2" />
                          Request Emergency Consultation
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Emergency Contact Information */}
            <Card className="mt-6 border-orange-200">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-lg text-orange-800 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Alternative Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">
                    If this is an immediate emergency or you need to speak with someone right now:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <a
                      href="tel:+1-800-MILITARY"
                      className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Emergency Line: 1-800-MILITARY
                    </a>
                    <span className="text-gray-400">or</span>
                    <a
                      href="sms:+18008888888"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Text: 1-800-888-8888
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Available 24/7 for emergency military legal situations
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}