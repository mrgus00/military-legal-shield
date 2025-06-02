import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import { useMood, useMoodDetection } from "@/contexts/MoodContext";
import MoodIndicator from "@/components/mood-indicator";
import MoodAwareCard from "@/components/mood-aware-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Phone, Shield, MapPin, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UrgentMatch() {
  const { setMood, colors, currentMood, detectMoodFromContent } = useMood();
  const { toast } = useToast();
  
  // Set urgent mood when entering this page
  useEffect(() => {
    setMood("urgent");
  }, [setMood]);

  const [isMatching, setIsMatching] = useState(false);

  const handleUrgentMatch = () => {
    setIsMatching(true);
    
    // Simulate urgent matching process
    setTimeout(() => {
      setIsMatching(false);
      toast({
        title: "Attorney Match Found",
        description: "Emergency legal counsel has been notified and will contact you within 15 minutes.",
        variant: "default",
      });
    }, 3000);
  };

  const urgentAttorneys = [
    {
      id: 1,
      name: "Col. Sarah Mitchell (Ret.)",
      specialty: "Court-Martial Defense",
      location: "Available 24/7",
      responseTime: "< 15 minutes",
      rating: 4.9,
      cases: 150,
      status: "online"
    },
    {
      id: 2,
      name: "Maj. Robert Chen (Ret.)",
      specialty: "Emergency Legal Aid",
      location: "Available Now",
      responseTime: "< 10 minutes",
      rating: 4.8,
      cases: 89,
      status: "online"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Header />
      
      {/* Mood Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <MoodIndicator />
      </div>

      {/* Emergency Header */}
      <div className="py-8" style={{ backgroundColor: colors.primary }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-12 h-12 mr-3" />
              <h1 className="text-4xl font-bold">Emergency Legal Support</h1>
            </div>
            <p className="text-xl opacity-90">
              Immediate connection to experienced military legal counsel
            </p>
            <div className="flex items-center justify-center mt-4">
              <Badge className="bg-white text-red-600 px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                24/7 Emergency Response
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Emergency Action Button */}
        <div className="mb-12 text-center">
          <MoodAwareCard priority="critical" className="max-w-2xl mx-auto">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Need Immediate Legal Help?</h3>
              <p className="text-lg mb-6">
                Connect with emergency legal counsel within minutes. Available 24/7 for urgent military legal matters.
              </p>
              <Button 
                size="lg" 
                onClick={handleUrgentMatch}
                disabled={isMatching}
                className="w-full max-w-md text-lg py-6"
                style={{ backgroundColor: colors.primary }}
              >
                {isMatching ? (
                  <>
                    <div className="animate-spin w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full" />
                    Finding Attorney...
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5 mr-3" />
                    Get Emergency Legal Help Now
                  </>
                )}
              </Button>
            </div>
          </MoodAwareCard>
        </div>

        {/* Available Emergency Attorneys */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
            Available Emergency Attorneys
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {urgentAttorneys.map((attorney) => (
              <MoodAwareCard key={attorney.id} priority="high">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-lg">{attorney.name}</h4>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <p className="text-sm opacity-75 mb-2">{attorney.specialty}</p>
                    <div className="flex items-center space-x-4 text-sm opacity-75 mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {attorney.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {attorney.responseTime}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          ⭐ {attorney.rating}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {attorney.cases} cases
                        </Badge>
                      </div>
                      <Button 
                        size="sm"
                        style={{ 
                          backgroundColor: colors.accent,
                          color: "white"
                        }}
                      >
                        Contact Now
                      </Button>
                    </div>
                  </div>
                </div>
              </MoodAwareCard>
            ))}
          </div>
        </div>

        {/* Emergency Resources */}
        <div>
          <h3 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
            Emergency Legal Resources
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <MoodAwareCard priority="high" title="Emergency Rights Card">
              <p className="text-sm mb-4">Know your rights during emergency situations</p>
              <Button variant="outline" size="sm" className="w-full">
                Download Card
              </Button>
            </MoodAwareCard>
            
            <MoodAwareCard priority="normal" title="Crisis Hotlines">
              <p className="text-sm mb-4">24/7 support hotlines for immediate assistance</p>
              <Button variant="outline" size="sm" className="w-full">
                View Numbers
              </Button>
            </MoodAwareCard>
            
            <MoodAwareCard priority="normal" title="Emergency Contacts">
              <p className="text-sm mb-4">Key contacts for urgent legal situations</p>
              <Button variant="outline" size="sm" className="w-full">
                Access List
              </Button>
            </MoodAwareCard>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}