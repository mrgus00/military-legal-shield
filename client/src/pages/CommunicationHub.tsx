import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Video, 
  Phone, 
  Mail, 
  Send, 
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  Globe,
  MessageCircle,
  Headphones,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/page-layout";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'attorney';
  timestamp: Date;
  type: 'text' | 'video_link' | 'document';
}

interface VideoConsultation {
  id: string;
  attorneyName: string;
  scheduledTime: Date;
  duration: number;
  meetingLink?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export default function CommunicationHub() {
  const [activeTab, setActiveTab] = useState("live-chat");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // WhatsApp AI Integration
  const whatsappConnect = useMutation({
    mutationFn: async (phoneNumber: string) => {
      return await apiRequest("POST", "/api/communication/whatsapp-connect", { phoneNumber });
    },
    onSuccess: () => {
      toast({
        title: "WhatsApp Connected",
        description: "You'll receive legal updates and can chat with our AI assistant via WhatsApp.",
      });
    },
  });

  // Live Chat with AI
  const sendChatMessage = useMutation({
    mutationFn: async (message: string) => {
      return await apiRequest("POST", "/api/communication/chat", { message, type: 'legal_query' });
    },
    onSuccess: (response: any) => {
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + '_ai',
        content: response.aiResponse || "I'm here to help with your military legal questions.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    },
  });

  // Video Consultation Booking
  const scheduleVideoCall = useMutation({
    mutationFn: async (consultationData: any) => {
      return await apiRequest("POST", "/api/communication/video-consultation", consultationData);
    },
    onSuccess: (response: any) => {
      toast({
        title: "Video Consultation Scheduled",
        description: `Your consultation is scheduled for ${response.scheduledTime || 'soon'}. Meeting link sent to your email.`,
      });
    },
  });

  // Email Notification Settings
  const updateEmailSettings = useMutation({
    mutationFn: async (settings: any) => {
      return await apiRequest("POST", "/api/communication/email-settings", settings);
    },
    onSuccess: () => {
      toast({
        title: "Email Settings Updated",
        description: "Your notification preferences have been saved.",
      });
    },
  });

  // Get active video consultations
  const { data: videoConsultations = [] } = useQuery({
    queryKey: ["/api/communication/video-consultations"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: chatInput,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    sendChatMessage.mutate(chatInput);
    setChatInput("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="live-chat" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Live Chat
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                WhatsApp AI
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Video Calls
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Live Chat Tab */}
            <TabsContent value="live-chat" className="space-y-6">
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
                <CardContent>
                  {/* Chat Messages */}
                  <div className="h-96 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                    {chatMessages.length === 0 && (
                      <div className="text-center text-gray-500 mt-8">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Start a conversation with our AI legal assistant</p>
                        <p className="text-sm mt-1">Ask about court-martial, security clearance, or any military legal matter</p>
                      </div>
                    )}
                    
                    {chatMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : message.sender === 'ai'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-orange-100 text-orange-800 border border-orange-200'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-200 px-4 py-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Chat Input */}
                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about court-martial defense, security clearance, DUI charges..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={sendChatMessage.isPending}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={sendChatMessage.isPending || !chatInput.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* WhatsApp Tab */}
            <TabsContent value="whatsapp" className="space-y-6">
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
                      onClick={() => whatsappConnect.mutate(whatsappPhone)}
                      disabled={whatsappConnect.isPending || !whatsappPhone}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Connect WhatsApp
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

                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-4">Or scan QR code to start WhatsApp chat:</p>
                    <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                      <div className="text-center">
                        <Globe className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">QR Code for WhatsApp</p>
                        <p className="text-xs text-gray-400 mt-1">+1 (800) 555-LEGAL</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Video Consultation Tab */}
            <TabsContent value="video" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Schedule New Video Call */}
                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-purple-600" />
                      Schedule Video Consultation
                    </CardTitle>
                    <CardDescription>
                      Book a secure video call with a military legal expert
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Legal Issue Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select legal issue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="court-martial">Court-Martial Defense</SelectItem>
                          <SelectItem value="security-clearance">Security Clearance</SelectItem>
                          <SelectItem value="administrative">Administrative Actions</SelectItem>
                          <SelectItem value="family-law">Military Family Law</SelectItem>
                          <SelectItem value="discharge">Discharge Issues</SelectItem>
                        </SelectContent>
                      </Select>
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

                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Video Call
                    </Button>
                  </CardContent>
                </Card>

                {/* Active Video Consultations */}
                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-orange-600" />
                      Your Video Consultations
                    </CardTitle>
                    <CardDescription>
                      Upcoming and recent video consultations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {Array.isArray(videoConsultations) && videoConsultations.length > 0 ? (
                      <div className="space-y-3">
                        {videoConsultations.map((consultation: VideoConsultation) => (
                          <div key={consultation.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">Attorney {consultation.attorneyName}</h4>
                              <Badge variant={consultation.status === 'scheduled' ? 'default' : 'secondary'}>
                                {consultation.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {consultation.scheduledTime.toLocaleString()}
                            </p>
                            {consultation.status === 'scheduled' && consultation.meetingLink && (
                              <Button size="sm" className="w-full">
                                <Video className="w-4 h-4 mr-2" />
                                Join Meeting
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No scheduled consultations</p>
                        <p className="text-sm mt-1">Schedule your first video call to get started</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Email Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
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
                      <Button variant="outline" size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Enabled
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Emergency Alerts</h4>
                        <p className="text-sm text-gray-600">Immediate notifications for urgent legal matters</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Enabled
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Court Date Reminders</h4>
                        <p className="text-sm text-gray-600">Reminders 24 hours before scheduled court appearances</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Enabled
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Weekly Legal Newsletter</h4>
                        <p className="text-sm text-gray-600">Military legal news and important updates</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
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

                  <Button 
                    onClick={() => updateEmailSettings.mutate({ notifications: emailNotifications })}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}