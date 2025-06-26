import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WhatsAppConnector from "@/components/whatsapp-connector";
import { 
  MessageCircle, 
  Clock, 
  Shield, 
  Users,
  CheckCircle,
  Smartphone,
  Globe,
  Lock,
  Zap
} from "lucide-react";
import { Link } from "wouter";

export default function WhatsAppSupport() {
  const supportNumbers = [
    {
      title: "Emergency Legal Support",
      number: "+1-800-645-5342",
      description: "Immediate assistance for urgent legal matters",
      hours: "24/7 Available",
      responseTime: "under 5 minutes",
      type: "emergency"
    },
    {
      title: "General Legal Support",
      number: "+1-800-645-5342",
      description: "Questions, guidance, and general assistance",
      hours: "24/7 Available", 
      responseTime: "under 15 minutes",
      type: "support"
    },
    {
      title: "Attorney Consultations",
      number: "+1-800-645-5342",
      description: "Schedule consultations with military attorneys",
      hours: "Mon-Fri 8AM-8PM EST",
      responseTime: "Within 1 hour",
      type: "consultation"
    }
  ];

  const features = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All WhatsApp messages are encrypted for maximum privacy and security"
    },
    {
      icon: Zap,
      title: "Instant Response",
      description: "Get immediate responses from our legal support team"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Connect directly with verified military legal professionals"
    },
    {
      icon: Globe,
      title: "Global Availability",
      description: "Access support from anywhere in the world, including overseas deployments"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Optimized for mobile devices and easy on-the-go access"
    },
    {
      icon: Shield,
      title: "Military Focused",
      description: "Specialized support team with military legal expertise"
    }
  ];

  const quickActions = [
    {
      title: "Emergency Legal Help",
      message: "🚨 EMERGENCY: I need immediate military legal assistance",
      icon: "🚨",
      color: "bg-red-600 hover:bg-red-700"
    },
    {
      title: "Court-Martial Defense",
      message: "⚖️ I need court-martial defense assistance and legal representation",
      icon: "⚖️",
      color: "bg-orange-600 hover:bg-orange-700"
    },
    {
      title: "Family Law Issues",
      message: "👨‍👩‍👧‍👦 I need help with military family law matters (divorce, custody, POA)",
      icon: "👨‍👩‍👧‍👦",
      color: "bg-pink-600 hover:bg-pink-700"
    },
    {
      title: "VA Benefits Claims",
      message: "🎖️ I need assistance with VA disability claims and benefits",
      icon: "🎖️",
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Deployment Preparation",
      message: "✈️ I'm deploying and need help with legal preparations (POA, wills, etc.)",
      icon: "✈️",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "General Question",
      message: "💬 I have a general question about military legal services",
      icon: "💬",
      color: "bg-gray-600 hover:bg-gray-700"
    }
  ];

  const handleQuickAction = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/18006455342?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6">WhatsApp Legal Support</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Get instant access to military legal experts through WhatsApp. 
              Secure, encrypted messaging for all your legal support needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-green-600 hover:bg-gray-100"
                onClick={() => handleQuickAction("👋 Hello! I need assistance with military legal services.")}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start WhatsApp Chat
              </Button>
              <Link href="/emergency-consultation">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
                  Emergency Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">WhatsApp Support Options</h2>
            <p className="text-xl text-gray-600">Choose the right support channel for your needs</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {supportNumbers.map((support, index) => (
              <WhatsAppConnector
                key={index}
                variant={support.type as "emergency" | "support" | "consultation"}
                phoneNumber={support.number}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <p className="text-xl text-gray-600">Start a conversation with pre-filled messages</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleQuickAction(action.message)}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{action.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{action.message}</p>
                  <Button className={`w-full ${action.color} text-white`}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why WhatsApp Support?</h2>
            <p className="text-xl text-gray-600">Secure, convenient, and always available</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Click Connect</h3>
              <p className="text-gray-600 text-sm">Choose your support type and click the WhatsApp button</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Send Message</h3>
              <p className="text-gray-600 text-sm">WhatsApp opens with a pre-filled message describing your need</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Get Response</h3>
              <p className="text-gray-600 text-sm">Receive immediate response from our legal support team</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Get Help</h3>
              <p className="text-gray-600 text-sm">Continue the conversation to get the legal assistance you need</p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Hours */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Clock className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">24/7 Support Available</h2>
          <p className="text-xl mb-8">
            Our WhatsApp support team is available around the clock to assist with your legal needs. 
            Emergency support is prioritized and handled immediately.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Emergency</div>
              <div className="text-green-100">Under 5 minutes response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">General Support</div>
              <div className="text-green-100">Under 15 minutes response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Consultations</div>
              <div className="text-green-100">Within 1 hour</div>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="bg-white text-green-600 hover:bg-gray-100"
            onClick={() => handleQuickAction("👋 Hello! I need assistance with military legal services.")}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Start Conversation Now
          </Button>
        </div>
      </section>
    </div>
  );
}