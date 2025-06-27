import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Video, 
  Phone, 
  Mail, 
  Send, 
  Calendar,
  MessageCircle,
  Headphones,
  Shield,
  Lock,
  Timer,
  EyeOff,
  Smartphone
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/page-layout";

export default function SimpleCommunicationHub() {
  const [chatInput, setChatInput] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    toast({
      title: "Message Sent",
      description: "Our AI legal assistant will respond shortly.",
    });
    setChatInput("");
  };

  const handleWhatsAppConnect = () => {
    if (!whatsappPhone) return;
    
    toast({
      title: "WhatsApp Connected",
      description: "You'll receive legal updates and can chat with our AI assistant via WhatsApp.",
    });
    setWhatsappPhone("");
  };

  const handleVideoSchedule = () => {
    toast({
      title: "Video Consultation Scheduled",
      description: "Your consultation has been scheduled. Meeting link sent to your email.",
    });
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-blue-900 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Military Legal Communication Hub
            </h1>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Connect with legal experts through multiple channels - AI chat, WhatsApp, video calls, and email notifications
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Chat */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-blue-600" />
                  AI Legal Assistant - Available 24/7
                </CardTitle>
                <CardDescription>
                  Get instant answers to military legal questions from our AI assistant
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-64 bg-gray-50 rounded-lg p-4 overflow-y-auto">
                  <div className="text-center text-gray-500 mt-16">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Start a conversation with our AI legal assistant</p>
                    <p className="text-sm mt-1">Ask about court-martial, security clearance, or any military legal matter</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about court-martial defense, security clearance, DUI charges..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Integration */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  WhatsApp AI Legal Assistant
                </CardTitle>
                <CardDescription>
                  Get legal assistance directly through WhatsApp with our AI-powered chat
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleWhatsAppConnect}
                    disabled={!whatsappPhone}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">WhatsApp AI Features:</h3>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• 24/7 legal question answering</li>
                    <li>• Emergency legal consultation alerts</li>
                    <li>• Document template sharing</li>
                    <li>• Attorney connection assistance</li>
                    <li>• Court date and deadline reminders</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Video Consultation */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-600" />
                  Video Consultation Booking
                </CardTitle>
                <CardDescription>
                  Schedule a secure video call with a military legal expert
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Legal Issue Type</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Court-Martial Defense</option>
                    <option>Security Clearance</option>
                    <option>Administrative Actions</option>
                    <option>Military Family Law</option>
                    <option>Discharge Issues</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" />
                    <Input type="time" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Brief Description</label>
                  <Textarea placeholder="Briefly describe your legal situation..." />
                </div>

                <Button 
                  onClick={handleVideoSchedule}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Video Call
                </Button>
              </CardContent>
            </Card>

            {/* Email Notifications */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-600" />
                  Email Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive legal updates and reminders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Legal Case Updates</h4>
                      <p className="text-sm text-gray-600">Get notified about case progress and attorney updates</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Emergency Alerts</h4>
                      <p className="text-sm text-gray-600">Immediate notifications for urgent legal matters</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Court Date Reminders</h4>
                      <p className="text-sm text-gray-600">Reminders 24 hours before scheduled court appearances</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                      Enabled
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Email Automation Features:</h3>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Automatic attorney match notifications</li>
                    <li>• Document deadline reminders</li>
                    <li>• Case status change alerts</li>
                    <li>• Emergency consultation confirmations</li>
                    <li>• Legal resource recommendations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Secure Messaging - NEW Signal-like Features */}
            <Card className="bg-white/95 backdrop-blur-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Secure Military Messaging
                </CardTitle>
                <CardDescription>
                  Signal-like privacy with end-to-end encryption, self-destructing messages, and minimal metadata logging
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Lock className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-blue-800">End-to-End Encryption</h4>
                      <p className="text-sm text-blue-600">Military-grade cryptography</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Timer className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-blue-800">Self-Destructing Messages</h4>
                      <p className="text-sm text-blue-600">Auto-delete after set time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <EyeOff className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-blue-800">No Metadata Logging</h4>
                      <p className="text-sm text-blue-600">Zero IP or timestamp storage</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Privacy Features</h3>
                  <ul className="space-y-2 text-sm mb-4">
                    <li>• Forward secrecy with ephemeral keys for each message</li>
                    <li>• Messages automatically deleted from server after delivery</li>
                    <li>• No user identification or personal data stored</li>
                    <li>• Perfect for sensitive military legal communications</li>
                  </ul>
                  
                  <Link href="/secure-messaging">
                    <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                      <Shield className="w-4 h-4 mr-2" />
                      Open Secure Messaging
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Dashboard Link */}
          <div className="mt-8 text-center">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="py-6">
                <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
                  <Smartphone className="w-6 h-6" />
                  Mobile App Features
                </h3>
                <p className="mb-4">Access advanced PWA features, offline capabilities, and mobile-optimized tools</p>
                <Link href="/mobile-dashboard">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Open Mobile Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Contact Info */}
          <div className="mt-8 text-center">
            <Card className="bg-red-600 text-white">
              <CardContent className="py-6">
                <h3 className="text-xl font-bold mb-2">Emergency Legal Assistance</h3>
                <p className="mb-4">For immediate legal threats requiring urgent attorney consultation</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a href="tel:+18005550123" className="flex items-center gap-2 bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    <Phone className="w-4 h-4" />
                    (800) 555-0123
                  </a>
                  <span className="text-red-100">Available 24/7</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}