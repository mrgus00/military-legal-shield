import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Users, 
  Clock, 
  CheckCircle,
  Send,
  Phone,
  Video,
  Shield,
  Zap
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import WhatsAppConnector from "@/components/whatsapp-connector";

export default function ChatSupport() {
  const [message, setMessage] = useState("");
  const [chatStarted, setChatStarted] = useState(false);

  const chatFeatures = [
    {
      icon: Zap,
      title: "Instant Response",
      description: "Get immediate replies from our legal support team"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "All conversations are encrypted and confidential"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Chat with verified military legal professionals"
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "Support available around the clock"
    }
  ];

  const chatCategories = [
    {
      title: "Emergency Legal Help",
      description: "Immediate assistance for urgent legal matters",
      responseTime: "&lt; 2 minutes",
      color: "red",
      message: "🚨 EMERGENCY: I need immediate legal assistance with an urgent matter."
    },
    {
      title: "Court-Martial Support",
      description: "Defense assistance and legal representation",
      responseTime: "< 5 minutes", 
      color: "orange",
      message: "⚖️ I need help with court-martial proceedings and defense."
    },
    {
      title: "Family Law Issues",
      description: "Divorce, custody, and deployment preparations",
      responseTime: "< 5 minutes",
      color: "pink",
      message: "👨‍👩‍👧‍👦 I need assistance with military family law matters."
    },
    {
      title: "VA Benefits Claims",
      description: "Disability claims and benefits assistance",
      responseTime: "< 10 minutes",
      color: "green",
      message: "🎖️ I need help with VA disability claims and benefits."
    },
    {
      title: "General Questions",
      description: "Platform support and general inquiries",
      responseTime: "< 15 minutes",
      color: "blue",
      message: "💬 I have a general question about military legal services."
    }
  ];

  const handleStartChat = (category?: any) => {
    if (category) {
      setMessage(category.message);
    }
    setChatStarted(true);
  };

  const handleSendMessage = () => {
    // In a real implementation, this would connect to a live chat system
    console.log("Starting chat with message:", message);
    alert("Chat system would be initialized here. For immediate assistance, please use our WhatsApp support or call our emergency hotline.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6">Live Chat Support</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Connect instantly with our military legal experts through secure live chat. 
              Get real-time assistance for all your legal needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => handleStartChat()}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Live Chat
              </Button>
              <Link href="/whatsapp-support">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                  WhatsApp Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Live Chat?</h2>
            <p className="text-xl text-gray-600">Fast, secure, and convenient legal support</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {chatFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Chat Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Select Your Support Category</h2>
            <p className="text-xl text-gray-600">Choose the type of assistance you need for faster routing</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chatCategories.map((category, index) => (
              <Card key={index} className={`border-l-4 border-l-${category.color}-500 hover:shadow-lg transition-shadow cursor-pointer`} onClick={() => handleStartChat(category)}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <Badge className={`bg-${category.color}-100 text-${category.color}-800 w-fit`}>
                    {category.responseTime}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                  <Button className={`w-full bg-${category.color}-600 hover:bg-${category.color}-700 text-white`}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Interface */}
      {chatStarted && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your Chat</h2>
              <p className="text-gray-600">Type your message below to begin the conversation</p>
            </div>

            <Card className="shadow-lg">
              <CardHeader className="bg-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Military Legal Support</CardTitle>
                      <div className="flex items-center gap-1 text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Online - Ready to help
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-white text-blue-600">
                    <Clock className="w-3 h-3 mr-1" />
                    &lt; 2 min response
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="h-64 bg-gray-50 p-4 overflow-y-auto">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
                      <p className="text-sm">Hello! I'm here to help with your military legal needs. How can I assist you today?</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Press Enter to send • Your conversation is secure and confidential
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Alternative Support Options */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Other Support Options</h2>
            <p className="text-xl text-gray-600">Multiple ways to get the help you need</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <WhatsAppConnector variant="emergency" />
            <WhatsAppConnector variant="support" />
            <WhatsAppConnector variant="consultation" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Phone className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Emergency Hotline</h3>
                <p className="text-gray-600 text-sm mb-4">24/7 phone support for urgent matters</p>
                <Link href="/emergency-consultation">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Call Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Video className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Video Consultation</h3>
                <p className="text-gray-600 text-sm mb-4">Face-to-face meetings with attorneys</p>
                <Link href="/video-consultation">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Schedule
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Community Forum</h3>
                <p className="text-gray-600 text-sm mb-4">Connect with other service members</p>
                <Link href="/community-forum">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Join Discussion
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Support Hours */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Clock className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">24/7 Live Chat Available</h2>
          <p className="text-xl mb-8">
            Our live chat support is available around the clock to assist with your legal needs. 
            Emergency matters are prioritized and handled immediately by our expert team.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Emergency</div>
              <div className="text-blue-100">Under 2 minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">General Support</div>
              <div className="text-blue-100">Under 15 minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Consultations</div>
              <div className="text-blue-100">Within 1 hour</div>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => handleStartChat()}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Start Live Chat Now
          </Button>
        </div>
      </section>
    </div>
  );
}