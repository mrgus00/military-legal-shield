import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/header';
import Footer from '@/components/footer';
import VideoCall from '@/components/video-call';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  Shield, 
  Video, 
  MessageSquare, 
  FileText,
  CheckCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Attorney } from '@shared/schema';

export default function VideoConsultation() {
  const [location, setLocation] = useLocation();
  const [selectedAttorney, setSelectedAttorney] = useState<Attorney | null>(null);
  const [consultationStarted, setConsultationStarted] = useState(false);

  const { data: attorneys } = useQuery<Attorney[]>({
    queryKey: ["/api/attorneys"],
  });

  const availableAttorneys = attorneys?.filter(attorney => 
    attorney.isVerified && attorney.isActive
  ) || [];

  const handleAttorneySelect = (attorney: Attorney) => {
    setSelectedAttorney(attorney);
  };

  const handleConsultationStart = () => {
    setConsultationStarted(true);
  };

  const handleConsultationEnd = () => {
    setConsultationStarted(false);
    setSelectedAttorney(null);
  };

  if (consultationStarted && selectedAttorney) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-screen flex flex-col">
          <div className="flex-1 relative">
            <VideoCall
              attorneyName={`${selectedAttorney.firstName} ${selectedAttorney.lastName}`}
              specialty={selectedAttorney.specialties[0]}
              onCallEnd={handleConsultationEnd}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Video Consultation Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect directly with military law experts through secure video calls. 
            Get immediate legal guidance from verified attorneys specializing in military law.
          </p>
        </div>

        {/* Security Notice */}
        <Card className="mb-8 border-l-4 border-l-green-500 animate-slide-up">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Secure & Encrypted</h3>
                <p className="text-gray-600">
                  All video consultations are end-to-end encrypted and HIPAA compliant. 
                  Your conversations are completely private and secure.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {!selectedAttorney ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Attorneys for Video Consultation
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableAttorneys.map((attorney, index) => (
                <Card 
                  key={attorney.id} 
                  className={`cursor-pointer transition-all duration-300 hover-lift animate-fade-in stagger-${Math.min(index + 1, 5)}`}
                  onClick={() => handleAttorneySelect(attorney)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-navy-800 text-white">
                          {attorney.firstName[0]}{attorney.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {attorney.firstName} {attorney.lastName}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Available Now
                          </Badge>
                          {attorney.isVerified && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex flex-wrap gap-1">
                        {attorney.specialties.slice(0, 2).map((specialty, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {attorney.experience}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Response time: ~2 min
                      </div>
                      <Button 
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white hover-scale transition-smooth"
                      >
                        <Video className="w-4 h-4 mr-1" />
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {availableAttorneys.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Attorneys Available
                  </h3>
                  <p className="text-gray-600 mb-6">
                    All attorneys are currently in consultation. Please try again in a few minutes 
                    or schedule an appointment.
                  </p>
                  <Button 
                    onClick={() => setLocation('/consultation-booking')}
                    className="bg-navy-800 hover:bg-navy-900 text-white"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-navy-800 text-white">
                    {selectedAttorney.firstName[0]}{selectedAttorney.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedAttorney.firstName} {selectedAttorney.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedAttorney.specialties[0]}</p>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Before Your Consultation</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Ensure you have a stable WiFi connection</li>
                  <li>• Test your camera and microphone</li>
                  <li>• Prepare any relevant documents</li>
                  <li>• Find a quiet, private location</li>
                </ul>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Ready to Start</h4>
                    <p className="text-sm text-gray-600">Secure video consultation</p>
                  </div>
                </div>
                <Button 
                  onClick={handleConsultationStart}
                  className="bg-green-600 hover:bg-green-700 text-white click-ripple hover-glow"
                >
                  Start Video Call
                </Button>
              </div>

              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedAttorney(null)}
                  className="flex-1 hover-scale transition-smooth"
                >
                  Choose Different Attorney
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 hover-scale transition-smooth"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message First
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Card className="text-center hover-lift transition-smooth">
            <CardContent className="p-6">
              <Video className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">HD Video Quality</h3>
              <p className="text-gray-600 text-sm">
                Crystal clear video and audio for effective communication
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-lift transition-smooth">
            <CardContent className="p-6">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
              <p className="text-gray-600 text-sm">
                End-to-end encryption ensures your consultations remain confidential
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-lift transition-smooth">
            <CardContent className="p-6">
              <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Document Sharing</h3>
              <p className="text-gray-600 text-sm">
                Share documents securely during your consultation
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}