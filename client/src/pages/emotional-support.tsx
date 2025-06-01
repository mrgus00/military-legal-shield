import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Phone, 
  MessageCircle, 
  Headphones, 
  BookOpen, 
  Users, 
  Calendar,
  Shield,
  Sunrise,
  Leaf,
  Waves,
  Moon
} from "lucide-react";
import { useState } from "react";

export default function EmotionalSupport() {
  const [selectedBreathingExercise, setSelectedBreathingExercise] = useState<string | null>(null);

  const crisisResources = [
    {
      name: "Veterans Crisis Line",
      phone: "1-800-273-8255",
      text: "838255",
      chat: "VeteransCrisisLine.net",
      available: "24/7",
      description: "Confidential support for veterans and service members in crisis"
    },
    {
      name: "Military Crisis Line",
      phone: "1-800-273-8255",
      text: "838255", 
      available: "24/7",
      description: "Immediate support for active duty military personnel"
    },
    {
      name: "Military Family Life Counselors",
      phone: "Contact your base/installation",
      available: "Business Hours",
      description: "On-base counseling and family support services"
    }
  ];

  const wellnessResources = [
    {
      title: "Mindfulness & Meditation",
      icon: Leaf,
      color: "sage",
      description: "Guided meditation sessions designed for military personnel",
      activities: ["5-minute morning meditation", "Stress relief breathing", "Sleep preparation", "Focus enhancement"]
    },
    {
      title: "Stress Management",
      icon: Waves,
      color: "navy",
      description: "Evidence-based techniques for managing deployment and mission stress",
      activities: ["Progressive muscle relaxation", "Tactical breathing", "Visualization exercises", "Stress inoculation"]
    },
    {
      title: "Sleep Support",
      icon: Moon,
      color: "warm-gray",
      description: "Resources for better sleep hygiene and rest recovery",
      activities: ["Sleep hygiene checklist", "Bedtime routines", "Combat insomnia", "Shift work adaptation"]
    },
    {
      title: "Peer Support",
      icon: Users,
      color: "military-gold",
      description: "Connect with fellow service members for mutual support",
      activities: ["Support groups", "Buddy system", "Veteran mentors", "Family support networks"]
    }
  ];

  const breathingExercises = [
    {
      id: "tactical",
      name: "Tactical Breathing",
      duration: "4-4-4-4",
      description: "Military-tested breathing technique for stress control",
      instructions: "Inhale for 4 counts, hold for 4, exhale for 4, hold for 4"
    },
    {
      id: "box",
      name: "Box Breathing",
      duration: "4-4-4-4",
      description: "Calming technique used by special forces",
      instructions: "Inhale for 4, hold for 4, exhale for 4, pause for 4"
    },
    {
      id: "478",
      name: "4-7-8 Breathing",
      duration: "4-7-8",
      description: "Natural tranquilizer for the nervous system", 
      instructions: "Inhale for 4, hold for 7, exhale slowly for 8"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 via-white to-navy-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-sage-100 to-military-gold-100 rounded-full">
                <Heart className="h-12 w-12 text-sage-500" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-navy-700 mb-4">
              Emotional Support & Wellness
            </h1>
            <p className="text-xl text-navy-600 max-w-3xl mx-auto mb-8">
              Comprehensive mental health resources designed specifically for military personnel. 
              Your mental wellness is as important as your physical readiness.
            </p>
            <div className="flex justify-center">
              <Badge className="bg-sage-100 text-sage-700 px-4 py-2 text-sm">
                Confidential • Safe • Always Available
              </Badge>
            </div>
          </div>

          {/* Crisis Resources */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 mb-8">
              <div className="text-center">
                <Shield className="h-8 w-8 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-800 mb-2">Need Immediate Help?</h2>
                <p className="text-red-700 mb-6">If you're in crisis, these resources are available 24/7</p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {crisisResources.map((resource, index) => (
                    <Card key={index} className="bg-white border-red-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-red-800">{resource.name}</CardTitle>
                        <Badge variant="outline" className="w-fit">{resource.available}</Badge>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-600">{resource.description}</p>
                        <div className="space-y-2">
                          <Button className="w-full bg-red-600 hover:bg-red-700" size="sm">
                            <Phone className="h-4 w-4 mr-2" />
                            Call {resource.phone}
                          </Button>
                          {resource.text && (
                            <Button variant="outline" className="w-full" size="sm">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Text {resource.text}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Main Content Tabs */}
          <Tabs defaultValue="resources" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="resources">Wellness Resources</TabsTrigger>
                <TabsTrigger value="breathing">Breathing Exercises</TabsTrigger>
                <TabsTrigger value="support">Get Support</TabsTrigger>
              </TabsList>
            </div>

            {/* Wellness Resources */}
            <TabsContent value="resources" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {wellnessResources.map((resource, index) => (
                  <Card key={index} className={`bg-gradient-to-br from-${resource.color}-50 to-white border-${resource.color}-200 hover:shadow-lg transition-shadow`}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 bg-${resource.color}-100 rounded-lg`}>
                          <resource.icon className={`h-6 w-6 text-${resource.color}-600`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-navy-700">{resource.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-navy-600">{resource.description}</p>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-navy-700">Available Activities:</h4>
                        <ul className="space-y-1">
                          {resource.activities.map((activity, actIndex) => (
                            <li key={actIndex} className="flex items-center text-sm text-navy-600">
                              <div className={`w-2 h-2 bg-${resource.color}-400 rounded-full mr-3`}></div>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button className={`w-full bg-${resource.color}-500 hover:bg-${resource.color}-600`}>
                        Start Session
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Breathing Exercises */}
            <TabsContent value="breathing" className="space-y-8">
              <div className="text-center mb-8">
                <Sunrise className="h-12 w-12 text-military-gold-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-navy-700 mb-4">Tactical Breathing Exercises</h3>
                <p className="text-navy-600 max-w-2xl mx-auto">
                  Combat-proven breathing techniques to help manage stress, improve focus, and maintain operational readiness.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {breathingExercises.map((exercise) => (
                  <Card 
                    key={exercise.id} 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedBreathingExercise === exercise.id 
                        ? 'ring-2 ring-sage-400 bg-gradient-to-br from-sage-50 to-military-gold-50' 
                        : 'bg-white hover:bg-gradient-to-br hover:from-sage-50 hover:to-white'
                    }`}
                    onClick={() => setSelectedBreathingExercise(selectedBreathingExercise === exercise.id ? null : exercise.id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-navy-700">{exercise.name}</span>
                        <Badge variant="outline" className="text-sage-600">{exercise.duration}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-navy-600">{exercise.description}</p>
                      <div className="p-4 bg-sage-50 rounded-lg">
                        <p className="text-sm text-sage-700 font-medium">{exercise.instructions}</p>
                      </div>
                      {selectedBreathingExercise === exercise.id && (
                        <div className="pt-4 border-t">
                          <Button className="w-full bg-sage-500 hover:bg-sage-600">
                            <Headphones className="h-4 w-4 mr-2" />
                            Start Guided Session
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Get Support */}
            <TabsContent value="support" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-br from-navy-50 to-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-navy-700">
                      <Users className="h-6 w-6 mr-3" />
                      Professional Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-navy-600">Connect with licensed military mental health professionals</p>
                    <div className="space-y-3">
                      <Button className="w-full bg-navy-600 hover:bg-navy-700">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Counseling Session
                      </Button>
                      <Button variant="outline" className="w-full">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Start Anonymous Chat
                      </Button>
                      <Button variant="outline" className="w-full">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Access Self-Help Resources
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-military-gold-50 to-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-navy-700">
                      <Heart className="h-6 w-6 mr-3" />
                      Peer Support Network
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-navy-600">Connect with fellow service members who understand your experience</p>
                    <div className="space-y-3">
                      <Button className="w-full bg-military-gold-500 hover:bg-military-gold-600">
                        <Users className="h-4 w-4 mr-2" />
                        Join Support Group
                      </Button>
                      <Button variant="outline" className="w-full">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Find a Buddy
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Shield className="h-4 w-4 mr-2" />
                        Veteran Mentorship
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Resources */}
              <Card className="bg-gradient-to-r from-sage-50 to-warm-gray-50">
                <CardHeader>
                  <CardTitle className="text-center text-navy-700">Additional Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 text-center">
                    <div className="p-4">
                      <BookOpen className="h-8 w-8 text-sage-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-navy-700">Educational Materials</h4>
                      <p className="text-sm text-navy-600">Mental health resources and guides</p>
                    </div>
                    <div className="p-4">
                      <Users className="h-8 w-8 text-sage-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-navy-700">Family Support</h4>
                      <p className="text-sm text-navy-600">Resources for military families</p>
                    </div>
                    <div className="p-4">
                      <Shield className="h-8 w-8 text-sage-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-navy-700">Confidential Help</h4>
                      <p className="text-sm text-navy-600">Private and secure support options</p>
                    </div>
                    <div className="p-4">
                      <Calendar className="h-8 w-8 text-sage-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-navy-700">Flexible Scheduling</h4>
                      <p className="text-sm text-navy-600">Support that fits your schedule</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}