import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  FileText,
  Gavel,
  Shield
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  urgencyLevel?: 'low' | 'medium' | 'high';
  category?: string;
  requiresHumanAttorney?: boolean;
  ucmjReferences?: string[];
}

interface LegalAssistantProps {
  userId?: string;
  context?: string;
}

export function AILegalAssistant({ userId = 'anonymous', context = 'general' }: LegalAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Legal Assistant specializing in military law. I can help with UCMJ questions, court-martial guidance, security clearance issues, and general military legal matters. How can I assist you today?',
      timestamp: new Date(),
      urgencyLevel: 'low',
      category: 'welcome'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/legal-assistant', {
        message,
        context,
        userId,
        conversationHistory: messages.slice(-5) // Send last 5 messages for context
      });
      return response;
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        urgencyLevel: data.urgencyLevel,
        category: data.category,
        requiresHumanAttorney: data.requiresHumanAttorney,
        ucmjReferences: data.ucmjReferences
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      // Show urgent notifications
      if (data.urgencyLevel === 'high' || data.requiresHumanAttorney) {
        toast({
          title: "Urgent Legal Matter",
          description: "This situation may require immediate attorney consultation.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      setIsTyping(false);
      toast({
        title: "Assistant Unavailable",
        description: "Please try again or contact our support team.",
        variant: "destructive",
      });
    }
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    sendMessageMutation.mutate(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const getUrgencyColor = (level?: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getUrgencyIcon = (level?: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="w-3 h-3" />;
      case 'medium': return <Clock className="w-3 h-3" />;
      default: return <CheckCircle className="w-3 h-3" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center">
          <Bot className="w-6 h-6 mr-2 text-blue-600" />
          AI Legal Assistant
        </CardTitle>
        <CardDescription>
          Specialized military law guidance available 24/7. For emergencies, contact our emergency hotline.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="flex items-center mb-1">
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 mr-2" />
                      ) : (
                        <Bot className="w-4 h-4 mr-2" />
                      )}
                      <span className="text-sm font-medium">
                        {message.role === 'user' ? 'You' : 'Legal Assistant'}
                      </span>
                      <span className="text-xs opacity-70 ml-2">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {message.role === 'assistant' && (
                      <div className="mt-2 space-y-2">
                        {/* Urgency Level */}
                        {message.urgencyLevel && (
                          <Badge className={`${getUrgencyColor(message.urgencyLevel)} text-xs`}>
                            {getUrgencyIcon(message.urgencyLevel)}
                            <span className="ml-1 capitalize">{message.urgencyLevel} Priority</span>
                          </Badge>
                        )}
                        
                        {/* Category */}
                        {message.category && (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="w-3 h-3 mr-1" />
                            {message.category}
                          </Badge>
                        )}
                        
                        {/* Attorney Required */}
                        {message.requiresHumanAttorney && (
                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                            <Gavel className="w-3 h-3 mr-1" />
                            Attorney Consultation Recommended
                          </Badge>
                        )}
                        
                        {/* UCMJ References */}
                        {message.ucmjReferences && message.ucmjReferences.length > 0 && (
                          <div className="mt-2">
                            <div className="text-xs opacity-70 mb-1">UCMJ References:</div>
                            <div className="flex flex-wrap gap-1">
                              {message.ucmjReferences.map((ref, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  <Shield className="w-3 h-3 mr-1" />
                                  {ref}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center">
                    <Bot className="w-4 h-4 mr-2" />
                    <span className="text-sm">Legal Assistant is typing</span>
                    <div className="flex space-x-1 ml-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />
        
        <div className="p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Ask about UCMJ, court-martial, security clearance, or military legal matters..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sendMessageMutation.isPending}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || sendMessageMutation.isPending}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            This AI assistant provides general guidance. For complex legal matters, consult with a qualified military attorney.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}