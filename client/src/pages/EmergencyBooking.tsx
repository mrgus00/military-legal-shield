import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EmergencyBookingWidget from '@/components/EmergencyBookingWidget';
import { useQuery } from '@tanstack/react-query';
import { Phone, Shield, Clock, Users, Star, AlertTriangle, Zap } from 'lucide-react';
import { HomeButton } from '@/components/HomeButton';

const EmergencyBooking: React.FC = () => {
  const [showBookingWidget, setShowBookingWidget] = useState(false);

  // Get available emergency attorneys
  const { data: availableAttorneys, isLoading } = useQuery({
    queryKey: ['/api/emergency-booking/available-attorneys'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Get user's emergency booking history
  const { data: userBookings } = useQuery({
    queryKey: ['/api/emergency-booking/user-bookings']
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-start mb-6">
          <HomeButton />
        </div>
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <AlertTriangle className="w-4 h-4" />
            Emergency Legal Support Available 24/7
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            One-Click Emergency Legal Consultation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect instantly with verified military attorneys for urgent legal matters. 
            Our emergency system ensures you get immediate professional assistance when you need it most.
          </p>
        </div>

        {/* Emergency Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-2">
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {availableAttorneys?.attorneys?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Attorneys Available Now</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-2">
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">5 min</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-2">
                <Star className="w-8 h-8 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">4.8/5</div>
              <div className="text-sm text-gray-600">Client Satisfaction</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-2">
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Coverage</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Emergency Hotline */}
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Life-threatening emergency?</strong> Call 911 immediately. 
                For urgent legal matters requiring immediate attorney contact, call our emergency hotline: 
                <a href="tel:+18006455243" className="font-bold underline ml-1">
                  1-800-MIL-LEGAL
                </a>
              </AlertDescription>
            </Alert>

            {/* Booking Widget */}
            {!showBookingWidget ? (
              <Card className="border-2 border-red-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-red-700">
                    Emergency Legal Consultation
                  </CardTitle>
                  <p className="text-gray-600">
                    Connect with a military attorney in minutes for urgent legal matters
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    onClick={() => setShowBookingWidget(true)}
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
                  >
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Start Emergency Booking
                  </Button>
                  <p className="text-sm text-gray-500 mt-4">
                    One-click process • Immediate attorney matching • Secure communication
                  </p>
                </CardContent>
              </Card>
            ) : (
              <EmergencyBookingWidget />
            )}

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle>How Emergency Booking Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Describe Your Issue</h4>
                      <p className="text-sm text-gray-600">
                        Select your legal issue type and provide a brief description. 
                        Our system automatically determines urgency level.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Instant Attorney Matching</h4>
                      <p className="text-sm text-gray-600">
                        Our AI matches you with the best available attorney based on your issue type, 
                        location, and urgency level.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Immediate Contact</h4>
                      <p className="text-sm text-gray-600">
                        Attorney contacts you within minutes via your preferred method. 
                        Both parties receive SMS confirmations with booking details.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            {userBookings?.bookings && userBookings.bookings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Recent Emergency Consultations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userBookings.bookings.slice(0, 3).map((booking: any) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{booking.bookingReference}</div>
                          <div className="text-sm text-gray-600">
                            {booking.issueType.replace('-', ' ')} • {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge
                          className={
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Available Attorneys */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Available Emergency Attorneys
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-red-600 rounded-full mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Loading attorneys...</p>
                  </div>
                ) : availableAttorneys?.attorneys ? (
                  <div className="space-y-3">
                    {availableAttorneys.attorneys.slice(0, 3).map((attorney: any) => (
                      <div key={attorney.id} className="p-3 border rounded-lg">
                        <div className="font-medium">{attorney.name}</div>
                        <div className="text-sm text-gray-600">{attorney.firm}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {attorney.specialties.slice(0, 2).join(', ')}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {attorney.responseTime}
                          </Badge>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-green-600">Available</span>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      View All Available Attorneys
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600">No attorneys currently available</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Emergency hotline remains available 24/7
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Urgency Levels */}
            <Card>
              <CardHeader>
                <CardTitle>Urgency Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-red-100 text-red-800 border-red-300">Critical</Badge>
                    <span className="text-sm text-gray-600">Contact within 5 minutes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-orange-100 text-orange-800 border-orange-300">Urgent</Badge>
                    <span className="text-sm text-gray-600">Contact within 15 minutes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">High</Badge>
                    <span className="text-sm text-gray-600">Contact within 30 minutes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-800 border-green-300">Routine</Badge>
                    <span className="text-sm text-gray-600">Contact within 1 hour</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a 
                    href="tel:+18002736327" 
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-50"
                  >
                    <Phone className="w-4 h-4 text-red-600" />
                    <div>
                      <div className="font-medium text-sm">Military Crisis Line</div>
                      <div className="text-xs text-gray-600">1-800-273-8255</div>
                    </div>
                  </a>
                  <a 
                    href="tel:+18006455243" 
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-50"
                  >
                    <Shield className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">Legal Emergency Hotline</div>
                      <div className="text-xs text-gray-600">1-800-MIL-LEGAL</div>
                    </div>
                  </a>
                  <a 
                    href="tel:+18002738255" 
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-50"
                  >
                    <Phone className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">Chaplain Support</div>
                      <div className="text-xs text-gray-600">1-800-273-8255</div>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBooking;