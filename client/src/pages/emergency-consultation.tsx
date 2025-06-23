import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Clock, 
  Phone, 
  Video, 
  MapPin, 
  Calendar,
  Shield,
  Zap,
  User,
  FileText,
  CheckCircle,
  ArrowRight,
  Star,
  CalendarDays
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface EmergencyBookingData {
  urgencyLevel: 'immediate' | 'urgent' | 'priority';
  legalIssue: string;
  militaryBranch: string;
  rank: string;
  location: string;
  description: string;
  preferredTime: string;
  contactMethod: 'phone' | 'video' | 'in-person';
  phoneNumber: string;
  email: string;
  budgetRange?: string;
  preferredLanguage?: string;
  securityClearanceLevel?: string;
  deploymentStatus?: string;
}

interface Attorney {
  id: number;
  firstName: string;
  lastName: string;
  firmName: string;
  specialties: string[];
  location: string;
  rating: number;
  responseTime: string;
  hourlyRate: string;
  availableSlots: string[];
  emergencyAvailable: boolean;
  languages: string[];
  militaryBackground: boolean;
  securityClearanceExperience: boolean;
  videoConsultationEnabled: boolean;
  reviewCount: number;
  recentReviews: Array<{
    rating: number;
    comment: string;
    clientInitials: string;
    date: string;
  }>;
  nextAvailableSlot: string;
}

export default function EmergencyConsultation() {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<EmergencyBookingData>({
    urgencyLevel: 'urgent',
    legalIssue: '',
    militaryBranch: '',
    rank: '',
    location: '',
    description: '',
    preferredTime: '',
    contactMethod: 'phone',
    phoneNumber: '',
    email: ''
  });
  const [matchedAttorneys, setMatchedAttorneys] = useState<any[]>([]);
  const [selectedAttorney, setSelectedAttorney] = useState<any>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const { toast } = useToast();

  const emergencyBookingMutation = useMutation({
    mutationFn: async (data: EmergencyBookingData) => {
      const response = await apiRequest('POST', '/api/emergency-consultation', data);
      return response;
    },
    onSuccess: (data: any) => {
      setMatchedAttorneys(data.matchedAttorneys || []);
      setStep(2);
      toast({
        title: "Emergency Consultation Request Submitted",
        description: `Found ${data.matchedAttorneys?.length || 0} available attorneys`,
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "Unable to process emergency consultation request",
        variant: "destructive"
      });
    }
  });

  const confirmBookingMutation = useMutation({
    mutationFn: async (attorneyData: any) => {
      return await apiRequest('POST', '/api/confirm-emergency-booking', {
        ...bookingData,
        attorneyId: attorneyData.id,
        selectedTime: attorneyData.availableSlots[0]
      });
    },
    onSuccess: () => {
      setBookingConfirmed(true);
      setStep(3);
      toast({
        title: "Emergency Consultation Confirmed",
        description: "You will receive confirmation details shortly",
      });
    }
  });

  const handleEmergencySubmit = () => {
    if (!bookingData.legalIssue || !bookingData.militaryBranch || !bookingData.phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    emergencyBookingMutation.mutate(bookingData);
  };

  const handleAttorneySelect = (attorney: any) => {
    setSelectedAttorney(attorney);
    confirmBookingMutation.mutate(attorney);
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'immediate': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'priority': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (step === 3 && bookingConfirmed) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-green-700">Emergency Consultation Confirmed</h1>
          <p className="text-gray-600">Your emergency legal consultation has been successfully booked</p>
        </div>

        <Card className="border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Calendar className="h-5 w-5" />
              Consultation Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Attorney</Label>
                <p className="text-lg font-semibold">{selectedAttorney?.name}</p>
                <p className="text-sm text-gray-600">{selectedAttorney?.firm}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Consultation Time</Label>
                <p className="text-lg font-semibold">{selectedAttorney?.availableSlots[0]}</p>
                <p className="text-sm text-gray-600">via {bookingData.contactMethod}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">What happens next:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• You'll receive a confirmation email within 5 minutes</li>
                <li>• Attorney will contact you 15 minutes before scheduled time</li>
                <li>• Prepare any relevant documents for the consultation</li>
                <li>• Emergency support hotline: 1-800-MIL-LEGAL</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                className="flex-1"
              >
                Return to Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/legal-roadmap'}
                className="flex-1"
              >
                View Legal Resources
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Available Emergency Attorneys</h1>
          <p className="text-gray-600">Select an attorney for immediate consultation</p>
        </div>

        <div className="grid gap-4">
          {matchedAttorneys.map((attorney, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="text-xl font-semibold">{attorney.name}</h3>
                      <p className="text-gray-600">{attorney.firm}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{attorney.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {attorney.specializations?.slice(0, 3).map((spec: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <Label className="text-gray-700">Experience</Label>
                        <p className="font-medium">{attorney.experience} years</p>
                      </div>
                      <div>
                        <Label className="text-gray-700">Rating</Label>
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-4 w-4 ${
                                  star <= attorney.rating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">
                            ({attorney.reviewCount || 0} reviews)
                          </span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-700">Video Available</Label>
                        <div className="flex items-center gap-1">
                          {attorney.videoConsultationEnabled ? (
                            <>
                              <Video className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">Yes</span>
                            </>
                          ) : (
                            <>
                              <Phone className="h-4 w-4 text-blue-600" />
                              <span className="text-blue-600 font-medium">Phone Only</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-700">Response Time</Label>
                        <p className="font-medium">{attorney.responseTime}</p>
                      </div>
                    </div>

                    {/* Recent Reviews Section */}
                    {attorney.recentReviews && attorney.recentReviews.length > 0 && (
                      <div className="border-t pt-3 mt-3">
                        <Label className="text-gray-700 text-sm">Recent Client Feedback</Label>
                        <div className="space-y-2 mt-2">
                          {attorney.recentReviews.slice(0, 2).map((review, idx) => (
                            <div key={idx} className="bg-gray-50 p-2 rounded text-xs">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className={`h-3 w-3 ${
                                        star <= review.rating 
                                          ? 'text-yellow-400 fill-current' 
                                          : 'text-gray-300'
                                      }`} 
                                    />
                                  ))}
                                </div>
                                <span className="text-gray-600">- {review.clientInitials}</span>
                                <span className="text-gray-500">{review.date}</span>
                              </div>
                              <p className="text-gray-700 italic">"{review.comment}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <Label className="text-gray-700">Next Available</Label>
                      <p className="font-medium text-green-600">{attorney.availableSlots?.[0] || 'Within 1 hour'}</p>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <Badge className={getUrgencyColor('immediate')}>
                      Emergency Available
                    </Badge>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Rate:</span> {attorney.hourlyRate || '$300-500/hr'}
                      </div>
                      
                      {/* Consultation Method Selection */}
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-700">Consultation Method</Label>
                        <div className="flex gap-2">
                          {attorney.videoConsultationEnabled && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs"
                              onClick={() => setBookingData({...bookingData, contactMethod: 'video'})}
                            >
                              <Video className="h-3 w-3 mr-1" />
                              Video
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => setBookingData({...bookingData, contactMethod: 'phone'})}
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            Phone
                          </Button>
                        </div>
                      </div>

                      {/* Available Time Slots */}
                      {attorney.availableSlots && attorney.availableSlots.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-700">Next Available</Label>
                          <div className="grid grid-cols-2 gap-1">
                            {attorney.availableSlots.slice(0, 4).map((slot, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                className="text-xs p-1"
                                onClick={() => setBookingData({...bookingData, preferredTime: slot})}
                              >
                                {slot}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button 
                        onClick={() => handleAttorneySelect(attorney)}
                        disabled={confirmBookingMutation.isPending}
                        className="w-full"
                      >
                        {confirmBookingMutation.isPending ? (
                          <>Processing Payment...</>
                        ) : (
                          <>
                            Book & Pay
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-gray-500 text-center">
                        Secure payment via Stripe
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Emergency Header */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-6 w-6" />
            Emergency Legal Consultation
          </CardTitle>
          <CardDescription className="text-red-600">
            Get immediate legal assistance from qualified military attorneys
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Urgency Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            How urgent is your legal issue?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { level: 'immediate', title: 'Immediate', desc: 'Within 30 minutes', icon: AlertTriangle },
              { level: 'urgent', title: 'Urgent', desc: 'Within 2 hours', icon: Clock },
              { level: 'priority', title: 'Priority', desc: 'Within 24 hours', icon: Calendar }
            ].map(({ level, title, desc, icon: Icon }) => (
              <Card 
                key={level}
                className={`cursor-pointer transition-all ${
                  bookingData.urgencyLevel === level 
                    ? 'border-red-500 bg-red-50' 
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setBookingData({...bookingData, urgencyLevel: level as any})}
              >
                <CardContent className="p-4 text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-gray-600">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legal Issue Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Legal Issue Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="legalIssue">Type of Legal Issue *</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={bookingData.legalIssue}
                onChange={(e) => setBookingData({...bookingData, legalIssue: e.target.value})}
              >
                <option value="">Select issue type</option>
                <option value="court-martial">Court-Martial</option>
                <option value="article-15">Article 15 / NJP</option>
                <option value="security-clearance">Security Clearance</option>
                <option value="administrative">Administrative Separation</option>
                <option value="family">Family/Divorce</option>
                <option value="criminal">Criminal Defense</option>
                <option value="financial">Financial/Debt</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label htmlFor="militaryBranch">Military Branch *</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={bookingData.militaryBranch}
                onChange={(e) => setBookingData({...bookingData, militaryBranch: e.target.value})}
              >
                <option value="">Select branch</option>
                <option value="army">U.S. Army</option>
                <option value="navy">U.S. Navy</option>
                <option value="air-force">U.S. Air Force</option>
                <option value="marines">U.S. Marines</option>
                <option value="coast-guard">U.S. Coast Guard</option>
                <option value="space-force">U.S. Space Force</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rank">Rank</Label>
              <Input 
                id="rank"
                placeholder="e.g., SSG, LT, etc."
                value={bookingData.rank}
                onChange={(e) => setBookingData({...bookingData, rank: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="location">Location/Base</Label>
              <Input 
                id="location"
                placeholder="Current duty station"
                value={bookingData.location}
                onChange={(e) => setBookingData({...bookingData, location: e.target.value})}
              />
            </div>
          </div>

          {/* Enhanced Filtering Options */}
          <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
            <div>
              <Label htmlFor="budgetRange">Budget Range</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={bookingData.budgetRange || ''}
                onChange={(e) => setBookingData({...bookingData, budgetRange: e.target.value})}
              >
                <option value="">Select budget range</option>
                <option value="under-500">Under $500</option>
                <option value="500-1500">$500 - $1,500</option>
                <option value="1500-5000">$1,500 - $5,000</option>
                <option value="5000-plus">$5,000+</option>
                <option value="payment-plan">Payment Plan Available</option>
                <option value="military-discount">Military Discount Expected</option>
              </select>
            </div>
            <div>
              <Label htmlFor="preferredLanguage">Preferred Language</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={bookingData.preferredLanguage || ''}
                onChange={(e) => setBookingData({...bookingData, preferredLanguage: e.target.value})}
              >
                <option value="">English (Default)</option>
                <option value="spanish">Spanish</option>
                <option value="korean">Korean</option>
                <option value="german">German</option>
                <option value="japanese">Japanese</option>
                <option value="arabic">Arabic</option>
                <option value="tagalog">Tagalog</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="securityClearanceLevel">Security Clearance Level</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={bookingData.securityClearanceLevel || ''}
                onChange={(e) => setBookingData({...bookingData, securityClearanceLevel: e.target.value})}
              >
                <option value="">None/Not Applicable</option>
                <option value="confidential">Confidential</option>
                <option value="secret">Secret</option>
                <option value="top-secret">Top Secret</option>
                <option value="ts-sci">TS/SCI</option>
                <option value="q-clearance">Q Clearance</option>
              </select>
            </div>
            <div>
              <Label htmlFor="deploymentStatus">Current Status</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={bookingData.deploymentStatus || ''}
                onChange={(e) => setBookingData({...bookingData, deploymentStatus: e.target.value})}
              >
                <option value="">Select status</option>
                <option value="stateside">Stateside</option>
                <option value="deployed">Currently Deployed</option>
                <option value="pcs">PCS Orders</option>
                <option value="training">Training/TDY</option>
                <option value="leave">On Leave</option>
                <option value="separating">Separating Soon</option>
                <option value="reserves">Reserves/Guard</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Brief Description of Issue</Label>
            <Textarea 
              id="description"
              placeholder="Provide key details about your legal situation..."
              rows={4}
              value={bookingData.description}
              onChange={(e) => setBookingData({...bookingData, description: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input 
                id="phoneNumber"
                type="tel"
                placeholder="(555) 123-4567"
                value={bookingData.phoneNumber}
                onChange={(e) => setBookingData({...bookingData, phoneNumber: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email"
                type="email"
                placeholder="your.email@mail.mil"
                value={bookingData.email}
                onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label>Preferred Consultation Method</Label>
            <div className="flex gap-4 mt-2">
              {[
                { method: 'phone', icon: Phone, label: 'Phone Call' },
                { method: 'video', icon: Video, label: 'Video Call' },
                { method: 'in-person', icon: MapPin, label: 'In-Person' }
              ].map(({ method, icon: Icon, label }) => (
                <Card 
                  key={method}
                  className={`cursor-pointer flex-1 ${
                    bookingData.contactMethod === method 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setBookingData({...bookingData, contactMethod: method as any})}
                >
                  <CardContent className="p-3 text-center">
                    <Icon className="h-6 w-6 mx-auto mb-1" />
                    <p className="text-sm font-medium">{label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Request Emergency Consultation</h3>
              <p className="text-sm text-gray-600">
                Attorney will contact you within {
                  bookingData.urgencyLevel === 'immediate' ? '30 minutes' :
                  bookingData.urgencyLevel === 'urgent' ? '2 hours' : '24 hours'
                }
              </p>
            </div>
            <Button 
              onClick={handleEmergencySubmit}
              disabled={emergencyBookingMutation.isPending}
              size="lg"
              className="bg-red-600 hover:bg-red-700"
            >
              {emergencyBookingMutation.isPending ? (
                <>Processing...</>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  Get Emergency Help
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Disclaimer */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <p className="text-sm text-yellow-800">
            <strong>Emergency Disclaimer:</strong> This service is for urgent legal consultation. 
            For life-threatening emergencies, call 911 immediately. For mental health crises, 
            contact the Military Crisis Line at 1-800-273-8255.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}