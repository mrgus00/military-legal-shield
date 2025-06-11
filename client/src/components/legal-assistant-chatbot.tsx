import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X, Minimize2, Maximize2, Shield, Scale, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  type?: "text" | "suggestion" | "emergency";
}

interface ChatResponse {
  response: string;
  suggestions?: string[];
  urgencyLevel?: "low" | "medium" | "high";
  category?: string;
}

const militaryQuickActions = [
  { text: "Article 15 guidance", icon: FileText, category: "administrative" },
  { text: "Security clearance help", icon: Shield, category: "security" },
  { text: "Court-martial defense", icon: Scale, category: "legal" },
  { text: "Emergency consultation", icon: MessageCircle, category: "emergency" },
];

const assistantPersonality = {
  name: "Sergeant Legal",
  rank: "SGT",
  branch: "Legal Corps",
  avatar: "⚖️",
  traits: [
    "Direct and professional",
    "Military protocol awareness", 
    "UCMJ expertise",
    "Supportive but authoritative"
  ]
};

export default function LegalAssistantChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: `Hooah! I'm ${assistantPersonality.name}, your military legal assistant. I'm here to provide guidance on military legal matters, UCMJ questions, and connect you with appropriate resources. How can I assist you today, service member?`,
      sender: "assistant",
      timestamp: new Date(),
      type: "text"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Debug logging to ensure component renders
  useEffect(() => {
    console.log("Legal Assistant Chatbot component loaded");
  }, []);

  const chatMutation = useMutation({
    mutationFn: async (message: string): Promise<ChatResponse> => {
      const response = await apiRequest("POST", "/api/legal-assistant/chat", {
        message,
        context: "military_legal",
        userId: "guest", // Will be replaced with actual user ID when auth is implemented
      });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        content: data.response,
        sender: "assistant",
        timestamp: new Date(),
        type: data.urgencyLevel === "high" ? "emergency" : "text"
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Add suggestions if provided
      if (data.suggestions && data.suggestions.length > 0) {
        const suggestionMessage: ChatMessage = {
          id: Date.now() + "-suggestions",
          content: data.suggestions.join(" | "),
          sender: "assistant",
          timestamp: new Date(),
          type: "suggestion"
        };
        setMessages(prev => [...prev, suggestionMessage]);
      }
      
      setIsTyping(false);
    },
    onError: (error) => {
      setIsTyping(false);
      toast({
        title: "Communication Error",
        description: "Unable to connect with legal assistant. Please try again.",
        variant: "destructive",
      });
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    chatMutation.mutate(inputMessage);
  };

  const handleQuickAction = (action: string) => {
    const quickMessages: { [key: string]: string } = {
      "Article 15 guidance": "I need guidance about Article 15 proceedings. What are my rights and options?",
      "Security clearance help": "I'm having issues with my security clearance. Can you help me understand the process?",
      "Court-martial defense": "I need information about court-martial proceedings and my legal rights.",
      "Emergency consultation": "This is an urgent legal matter. I need immediate guidance on my situation."
    };
    
    const message = quickMessages[action] || action;
    setInputMessage(message);
    
    // Send the message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    chatMutation.mutate(message);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999] group">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-2xl animate-bounce hover:animate-none transition-all duration-300 hover:scale-110 border-4 border-yellow-400"
          style={{ 
            background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
            boxShadow: '0 10px 25px rgba(30, 64, 175, 0.4), 0 0 0 3px rgba(255, 255, 255, 0.1)'
          }}
        >
          <MessageCircle className="w-8 h-8 text-white animate-pulse" />
        </Button>
        
        {/* Military Badge Indicator */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse border-2 border-white shadow-lg">
          <span className="text-sm font-bold text-blue-900">⚖️</span>
        </div>
        
        {/* Notification Pulse */}
        <div className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-20"></div>
        
        {/* Tooltip */}
        <div className="absolute -top-20 right-0 bg-gray-900 text-white px-4 py-3 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl border border-gray-700">
          <div className="font-bold text-yellow-400">🎖️ SGT Legal Ready</div>
          <div className="text-xs text-gray-300">Military Legal Assistant</div>
          <div className="text-xs text-blue-300 mt-1">Click for instant help</div>
          <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? "h-14" : "h-96 w-80"
    }`}>
      <Card className="h-full shadow-2xl border-navy-200">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-navy-600 to-navy-700 text-white p-3 rounded-t-lg border-b-2 border-yellow-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-8 w-8 bg-navy-500 ring-2 ring-yellow-500">
                  <AvatarFallback className="text-white bg-navy-500 animate-pulse">
                    {assistantPersonality.avatar}
                  </AvatarFallback>
                </Avatar>
                {/* Military Stripes Animation */}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-navy-900 rounded-full"></div>
                </div>
              </div>
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-1">
                  {assistantPersonality.name}
                  <span className="text-yellow-400 animate-bounce">★</span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs bg-yellow-500 text-navy-900 font-bold">
                    {assistantPersonality.rank}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <span className="text-xs font-medium">Ready for Duty</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 text-white hover:bg-navy-500"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 text-white hover:bg-navy-500"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-64">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-navy-600 text-white"
                        : message.type === "emergency"
                        ? "bg-red-100 text-red-900 border border-red-300"
                        : message.type === "suggestion"
                        ? "bg-blue-50 text-blue-900 border border-blue-200"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
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

            {/* Quick Actions */}
            <div className="p-3 border-t bg-gray-50">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {militaryQuickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.text)}
                    className="text-xs justify-start"
                  >
                    <action.icon className="w-3 h-3 mr-1" />
                    {action.text}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about military legal matters..."
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  size="sm"
                  className="bg-navy-600 hover:bg-navy-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}