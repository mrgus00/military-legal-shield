import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SecurityReminder from "@/components/security-reminder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar,
  Clock,
  Video,
  Phone,
  MessageSquare,
  Star,
  CheckCircle,
  MapPin,
  Award,
  AlertCircle,
  Zap,
  Shield,
  Loader2,
  AlertTriangle,
  User,
  Users,
  Crown
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import PremiumUpgradePrompt from "@/components/premium-upgrade-prompt";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  consultationType: "phone" | "video" | "in-person";
  duration: number;
}

interface AttorneyAvailability {
  id: number;
  firstName: string;
  lastName: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  location: string;
  profileImage: string;
  pricePerHour: number;
  responseTime: string;
  availableToday: boolean;
  nextAvailable: string;
  timeSlots: TimeSlot[];
  consultationTypes: string[];
  languages: string[];
  experience: number;
  militaryBackground: boolean;
}

interface BookingRequest {
  attorneyId: number;
  timeSlotId: string;
  consultationType: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  caseDescription: string;
  urgency: string;
  preferredContact: string;
}

export default function ConsultationBooking() {
  const { isAuthenticated } = useAuth();
  const { isPremium, canAccessPremiumFeatures } = useSubscription();
  const [attorneys, setAttorneys] = useState<AttorneyAvailability[]>([]);
  const [selectedAttorney, setSelectedAttorney] = useState<AttorneyAvailability | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    specialty: "all",
    consultationType: "all",
    availability: "all",
    priceRange: "all",
    urgency: "standard",
    militaryBackground: false
  });
  const [quickBookMode, setQuickBookMode] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    caseDescription: "",
    urgency: "normal",
    preferredContact: "email"
  });
  const { toast } = useToast();

  // Show upgrade prompt for non-premium users
  if (isAuthenticated && !canAccessPremiumFeatures) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <PremiumUpgradePrompt 
              feature="Attorney Consultations"
              description="Direct consultations with verified military defense attorneys are available with Premium membership. Upgrade now to book your consultation and get personalized legal guidance."
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Load attorneys with real-time availability
  useEffect(() => {
    loadAttorneysWithAvailability();
  }, [selectedDate, searchFilters]);

  const loadAttorneysWithAvailability = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("GET", `/api/availability/attorneys?date=${selectedDate}&specialty=${searchFilters.specialty}&consultationType=${searchFilters.consultationType}`);
      const data = await response.json();
      setAttorneys(data);
    } catch (error) {
      console.error("Error loading attorney availability:", error);
      toast({
        title: "Loading Error",
        description: "Unable to load attorney availability. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickBook = async (attorney: AttorneyAvailability) => {
    const nextAvailableSlot = attorney.timeSlots.find(slot => slot.available);
    if (!nextAvailableSlot) {
      toast({
        title: "No Availability",
        description: "This attorney has no available slots today.",
        variant: "destructive"
      });
      return;
    }

    if (!bookingData.clientName || !bookingData.clientEmail) {
      setSelectedAttorney(attorney);
      setQuickBookMode(true);
      return;
    }

    // Auto-book with next available slot
    handleBookConsultation(attorney, nextAvailableSlot);
  };

  const handleBookConsultation = async (attorney: AttorneyAvailability, timeSlot: TimeSlot) => {
    if (!bookingData.clientName || !bookingData.clientEmail || !bookingData.caseDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before booking.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    try {
      const bookingRequest: BookingRequest = {
        attorneyId: attorney.id,
        timeSlotId: timeSlot.id,
        consultationType: timeSlot.consultationType,
        ...bookingData
      };

      const response = await apiRequest("POST", "/api/consultations/book", { booking: bookingRequest });
      const result = await response.json();

      toast({
        title: "Consultation Booked Successfully",
        description: `Your consultation with ${attorney.firstName} ${attorney.lastName} is confirmed for ${timeSlot.time}.`,
      });

      // Refresh availability
      loadAttorneysWithAvailability();
      setSelectedAttorney(null);
      setQuickBookMode(false);
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: "Unable to book consultation. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency": return "bg-red-100 text-red-800 border-red-200";
      case "urgent": return "bg-orange-100 text-orange-800 border-orange-200";
      case "normal": return "bg-sage-100 text-sage-800 border-sage-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "phone": return <Phone className="h-4 w-4" />;
      case "in-person": return <MessageSquare className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 via-white to-sage-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-military-gold-100 to-navy-100 rounded-full">
                <Calendar className="h-12 w-12 text-navy-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-navy-700 mb-4">
              Book Legal Consultation
            </h1>
            <p className="text-xl text-navy-600 max-w-3xl mx-auto mb-8">
              Connect instantly with verified military legal experts. Real-time availability, 
              secure booking, and immediate confirmation for your legal consultation needs.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-military-gold-100 text-military-gold-800 px-4 py-2">
                <Zap className="h-4 w-4 mr-1" />
                One-Click Booking
              </Badge>
              <Badge className="bg-navy-100 text-navy-800 px-4 py-2">
                <Clock className="h-4 w-4 mr-1" />
                Real-Time Availability
              </Badge>
              <Badge className="bg-sage-100 text-sage-800 px-4 py-2">
                <Shield className="h-4 w-4 mr-1" />
                Verified Attorneys
              </Badge>
            </div>
          </div>

          {/* Security Reminder */}
          <SecurityReminder />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Search Filters */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy-700">Search & Filter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Consultation Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialty">Legal Specialty</Label>
                    <Select value={searchFilters.specialty} onValueChange={(value) => 
                      setSearchFilters(prev => ({ ...prev, specialty: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="All Specialties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Specialties</SelectItem>
                        <SelectItem value="military-justice">Military Justice</SelectItem>
                        <SelectItem value="court-martial">Court-Martial Defense</SelectItem>
                        <SelectItem value="administrative">Administrative Actions</SelectItem>
                        <SelectItem value="discharge">Discharge Upgrades</SelectItem>
                        <SelectItem value="benefits">Benefits Claims</SelectItem>
                        <SelectItem value="security-clearance">Security Clearance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consultationType">Consultation Type</Label>
                    <Select value={searchFilters.consultationType} onValueChange={(value) => 
                      setSearchFilters(prev => ({ ...prev, consultationType: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="in-person">In-Person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Select value={searchFilters.availability} onValueChange={(value) => 
                      setSearchFilters(prev => ({ ...prev, availability: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Any Availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Availability</SelectItem>
                        <SelectItem value="today">Available Today</SelectItem>
                        <SelectItem value="emergency">Emergency Response</SelectItem>
                        <SelectItem value="within-24h">Within 24 Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Client Information Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy-700">Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Full Name *</Label>
                    <Input
                      id="clientName"
                      value={bookingData.clientName}
                      onChange={(e) => setBookingData(prev => ({ ...prev, clientName: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email Address *</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={bookingData.clientEmail}
                      onChange={(e) => setBookingData(prev => ({ ...prev, clientEmail: e.target.value }))}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Phone Number</Label>
                    <Input
                      id="clientPhone"
                      value={bookingData.clientPhone}
                      onChange={(e) => setBookingData(prev => ({ ...prev, clientPhone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Case Urgency</Label>
                    <Select value={bookingData.urgency} onValueChange={(value) => 
                      setBookingData(prev => ({ ...prev, urgency: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="urgent">Urgent (within 48 hours)</SelectItem>
                        <SelectItem value="emergency">Emergency (immediate)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caseDescription">Case Description *</Label>
                    <Textarea
                      id="caseDescription"
                      value={bookingData.caseDescription}
                      onChange={(e) => setBookingData(prev => ({ ...prev, caseDescription: e.target.value }))}
                      placeholder="Brief description of your legal situation..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attorney Availability List */}
            <div className="lg:col-span-2 space-y-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-navy-200 border-t-navy-600 rounded-full mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-navy-700">Loading Real-Time Availability...</h3>
                </div>
              ) : attorneys.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Available Attorneys</h3>
                    <p className="text-gray-500">Try adjusting your search filters or selecting a different date.</p>
                  </CardContent>
                </Card>
              ) : (
                attorneys.map(attorney => (
                  <Card key={attorney.id} className="bg-white hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={attorney.profileImage} />
                            <AvatarFallback className="bg-navy-100 text-navy-600 text-lg font-semibold">
                              {attorney.firstName[0]}{attorney.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-xl text-navy-700">
                              {attorney.firstName} {attorney.lastName}
                            </CardTitle>
                            <p className="text-navy-600">{attorney.specialty}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-military-gold-500 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">
                                  {attorney.rating} ({attorney.reviewCount} reviews)
                                </span>
                              </div>
                              {attorney.militaryBackground && (
                                <Badge className="bg-sage-100 text-sage-800">
                                  <Award className="h-3 w-3 mr-1" />
                                  Veteran Attorney
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-navy-600">
                            ${attorney.pricePerHour}/hr
                          </div>
                          <div className="text-sm text-gray-500">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {attorney.location}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Badge className={attorney.availableToday ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                            <Clock className="h-3 w-3 mr-1" />
                            {attorney.availableToday ? "Available Today" : `Next: ${attorney.nextAvailable}`}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            Response time: {attorney.responseTime}
                          </span>
                        </div>
                        
                        {/* One-Click Booking Button */}
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleQuickBook(attorney)}
                            disabled={isBooking || attorney.timeSlots.filter(slot => slot.available).length === 0}
                            className="bg-military-gold-500 hover:bg-military-gold-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg"
                          >
                            {isBooking ? (
                              <div className="flex items-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Booking...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Zap className="h-4 w-4" />
                                <span>Quick Book</span>
                              </div>
                            )}
                          </Button>
                          
                          {/* Real-time availability counter */}
                          <div className="flex items-center space-x-2 bg-sage-50 px-3 py-2 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-sage-700">
                              {attorney.timeSlots.filter(slot => slot.available).length} slots available
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Available Time Slots */}
                      <div>
                        <h4 className="font-semibold text-navy-700 mb-3">Available Time Slots</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {attorney.timeSlots.map(slot => (
                            <Button
                              key={slot.id}
                              variant={slot.available ? "outline" : "secondary"}
                              className={`h-auto p-3 flex flex-col items-center space-y-1 ${
                                slot.available 
                                  ? "border-navy-200 hover:border-navy-400 hover:bg-navy-50" 
                                  : "opacity-50 cursor-not-allowed"
                              }`}
                              disabled={!slot.available || isBooking}
                              onClick={() => handleBookConsultation(attorney, slot)}
                            >
                              <div className="flex items-center space-x-1">
                                {getConsultationIcon(slot.consultationType)}
                                <span className="text-sm font-medium">{slot.time}</span>
                              </div>
                              <span className="text-xs text-gray-500 capitalize">
                                {slot.consultationType} • {slot.duration}min
                              </span>
                              {slot.available && (
                                <CheckCircle className="h-3 w-3 text-sage-500" />
                              )}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {attorney.consultationTypes.map(type => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {getConsultationIcon(type)}
                            <span className="ml-1 capitalize">{type.replace('-', ' ')}</span>
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}