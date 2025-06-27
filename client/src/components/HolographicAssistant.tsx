import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Cpu, 
  Eye, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Brain, 
  Shield, 
  Scale,
  MessageCircle,
  FileText,
  Search,
  Zap,
  Star,
  ChevronRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface HolographicMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  visualEffects?: {
    holographic: boolean;
    animated: boolean;
    color: string;
    intensity: number;
  };
  legalCitations?: Array<{
    source: string;
    regulation: string;
    relevance: number;
  }>;
  actionItems?: Array<{
    task: string;
    priority: 'high' | 'medium' | 'low';
    deadline?: string;
  }>;
}

interface HolographicSession {
  id: string;
  title: string;
  legalDomain: string;
  complexity: number;
  messages: HolographicMessage[];
  assistantPersonality: 'military-advisor' | 'legal-scholar' | 'tactical-guide' | 'compassionate-counselor';
  visualMode: 'holographic' | 'augmented' | 'traditional';
}

const HolographicAssistant: React.FC = () => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<HolographicSession | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [visualMode, setVisualMode] = useState<'holographic' | 'augmented' | 'traditional'>('holographic');
  const [assistantPersonality, setAssistantPersonality] = useState<'military-advisor' | 'legal-scholar' | 'tactical-guide' | 'compassionate-counselor'>('military-advisor');
  const [hologramIntensity, setHologramIntensity] = useState(85);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const recognitionRef = useRef<any>();

  // Initialize holographic display
  useEffect(() => {
    if (isActive && canvasRef.current && visualMode === 'holographic') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Holographic background effect
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
        );
        gradient.addColorStop(0, `rgba(0, 150, 255, ${hologramIntensity / 400})`);
        gradient.addColorStop(0.5, `rgba(0, 100, 200, ${hologramIntensity / 600})`);
        gradient.addColorStop(1, `rgba(0, 50, 150, ${hologramIntensity / 800})`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Animated grid lines
        const time = Date.now() * 0.001;
        ctx.strokeStyle = `rgba(0, 200, 255, ${hologramIntensity / 300})`;
        ctx.lineWidth = 1;
        
        for (let i = 0; i < canvas.width; i += 40) {
          ctx.beginPath();
          ctx.moveTo(i + Math.sin(time + i * 0.01) * 5, 0);
          ctx.lineTo(i + Math.sin(time + i * 0.01) * 5, canvas.height);
          ctx.stroke();
        }
        
        for (let i = 0; i < canvas.height; i += 40) {
          ctx.beginPath();
          ctx.moveTo(0, i + Math.cos(time + i * 0.01) * 5);
          ctx.lineTo(canvas.width, i + Math.cos(time + i * 0.01) * 5);
          ctx.stroke();
        }

        // Central holographic avatar outline
        if (isProcessing) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = 60 + Math.sin(time * 3) * 10;
          
          ctx.strokeStyle = `rgba(0, 255, 150, ${hologramIntensity / 200})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
          
          // Rotating rings
          for (let ring = 0; ring < 3; ring++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + (ring * 20), time + ring, time + ring + Math.PI);
            ctx.stroke();
          }
        }

        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, visualMode, hologramIntensity, isProcessing]);

  // Speech recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Unable to process voice input. Please try again.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [toast]);

  const processLegalGuidanceMutation = useMutation({
    mutationFn: async (query: {
      message: string;
      personality: string;
      legalDomain?: string;
      context?: any;
    }) => {
      const response = await apiRequest('POST', '/api/holographic-guidance/process', query);
      return response;
    },
    onSuccess: (data) => {
      if (currentSession) {
        const newMessage: HolographicMessage = {
          id: Date.now().toString(),
          type: 'assistant',
          content: data.response,
          timestamp: new Date(),
          visualEffects: {
            holographic: visualMode === 'holographic',
            animated: true,
            color: '#00ffaa',
            intensity: hologramIntensity
          },
          legalCitations: data.citations,
          actionItems: data.actionItems
        };

        setCurrentSession(prev => prev ? {
          ...prev,
          messages: [...prev.messages, newMessage]
        } : null);
      }
      
      // Text-to-speech if enabled
      if (speechEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        speechSynthesis.speak(utterance);
      }
      
      setIsProcessing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Guidance Processing Failed",
        description: error.message || "Unable to process legal guidance request.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  });

  const startNewSession = () => {
    const newSession: HolographicSession = {
      id: Date.now().toString(),
      title: `Legal Guidance Session ${new Date().toLocaleTimeString()}`,
      legalDomain: 'military-law',
      complexity: 1,
      messages: [{
        id: 'welcome',
        type: 'assistant',
        content: getWelcomeMessage(assistantPersonality),
        timestamp: new Date(),
        visualEffects: {
          holographic: visualMode === 'holographic',
          animated: true,
          color: '#00aaff',
          intensity: hologramIntensity
        }
      }],
      assistantPersonality,
      visualMode
    };

    setCurrentSession(newSession);
    setIsActive(true);
  };

  const sendMessage = () => {
    if (!userInput.trim() || !currentSession) return;

    const userMessage: HolographicMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setCurrentSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, userMessage]
    } : null);

    setIsProcessing(true);
    processLegalGuidanceMutation.mutate({
      message: userInput,
      personality: assistantPersonality,
      legalDomain: currentSession.legalDomain,
      context: {
        sessionHistory: currentSession.messages.slice(-5),
        visualMode,
        complexity: currentSession.complexity
      }
    });

    setUserInput('');
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        toast({
          title: "Voice Input Unavailable",
          description: "Your browser doesn't support speech recognition.",
          variant: "destructive",
        });
      }
    }
  };

  const getWelcomeMessage = (personality: string): string => {
    const messages = {
      'military-advisor': "Greetings, service member. I'm your Holographic Legal Guidance Assistant, configured in Military Advisor mode. I'm here to provide tactical legal support with military precision. What legal challenge requires immediate attention?",
      'legal-scholar': "Welcome to the Holographic Legal Research Interface. I'm operating in Legal Scholar mode, ready to dive deep into military law, regulations, and precedent. How may I assist with your legal research today?",
      'tactical-guide': "Tactical Legal Assistant activated. I'm your strategic partner for navigating complex military legal situations. Ready to analyze threats, opportunities, and optimal legal pathways. What's your mission?",
      'compassionate-counselor': "Hello, and thank you for reaching out. I'm here as your supportive legal guidance companion, ready to help you through whatever legal challenges you're facing with understanding and care. How can I help you today?"
    };
    return messages[personality] || messages['military-advisor'];
  };

  const personalityOptions = [
    { value: 'military-advisor', label: 'Military Advisor', icon: Shield, color: 'text-blue-600' },
    { value: 'legal-scholar', label: 'Legal Scholar', icon: Brain, color: 'text-purple-600' },
    { value: 'tactical-guide', label: 'Tactical Guide', icon: Zap, color: 'text-orange-600' },
    { value: 'compassionate-counselor', label: 'Compassionate Counselor', icon: Star, color: 'text-green-600' }
  ];

  const visualModeOptions = [
    { value: 'holographic', label: 'Holographic', icon: Sparkles },
    { value: 'augmented', label: 'Augmented Reality', icon: Eye },
    { value: 'traditional', label: 'Traditional Interface', icon: MessageCircle }
  ];

  if (!isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-blue-500/30">
              <Sparkles className="w-4 h-4" />
              Advanced AI Legal Technology
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Holographic Legal Guidance Assistant
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of legal guidance with our immersive AI assistant. 
              Get personalized legal advice through holographic visualization and interactive AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Assistant Personality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={assistantPersonality} onValueChange={(value: any) => setAssistantPersonality(value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {personalityOptions.map(option => {
                      const IconComponent = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className={`w-4 h-4 ${option.color}`} />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-cyan-400" />
                  Visual Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={visualMode} onValueChange={(value: any) => setVisualMode(value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {visualModeOptions.map(option => {
                      const IconComponent = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={startNewSession}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Activate Holographic Assistant
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-2">AI-Powered Analysis</h3>
                <p className="text-sm text-gray-400">Advanced machine learning for precise legal guidance</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-2">Holographic Interface</h3>
                <p className="text-sm text-gray-400">Immersive 3D visualization for complex legal concepts</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-2">Military Specialized</h3>
                <p className="text-sm text-gray-400">Expert knowledge in military law and regulations</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white relative overflow-hidden">
      {/* Holographic Canvas Background */}
      {visualMode === 'holographic' && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
          style={{ zIndex: 1 }}
        />
      )}

      <div className="relative z-10 container mx-auto px-4 py-4 max-w-6xl">
        {/* Header Controls */}
        <div className="flex items-center justify-between mb-6 bg-gray-900/70 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsActive(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Exit Session
            </Button>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              {assistantPersonality.replace('-', ' ')}
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              {visualMode}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className={speechEnabled ? 'text-green-400' : 'text-gray-500'}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>

            {visualMode === 'holographic' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Intensity:</span>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={hologramIntensity}
                  onChange={(e) => setHologramIntensity(parseInt(e.target.value))}
                  className="w-20"
                />
              </div>
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Messages Area */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-900/70 border-gray-700 backdrop-blur-sm h-96 mb-4">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  {currentSession?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80 overflow-y-auto space-y-4">
                {currentSession?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.visualEffects?.holographic
                          ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white border border-cyan-400/50 shadow-lg shadow-cyan-400/20'
                          : 'bg-gray-700 text-white'
                      }`}
                      style={
                        message.visualEffects?.holographic
                          ? {
                              boxShadow: `0 0 20px ${message.visualEffects.color}40`,
                              animation: message.visualEffects.animated ? 'pulse 2s infinite' : 'none',
                            }
                          : {}
                      }
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.legalCitations && message.legalCitations.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.legalCitations.map((citation, idx) => (
                            <div key={idx} className="text-xs text-cyan-300 border-l-2 border-cyan-400 pl-2">
                              <strong>{citation.source}:</strong> {citation.regulation}
                            </div>
                          ))}
                        </div>
                      )}
                      {message.actionItems && message.actionItems.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.actionItems.map((item, idx) => (
                            <div key={idx} className="text-xs text-yellow-300 flex items-center gap-1">
                              <ChevronRight className="w-3 h-3" />
                              <span>{item.task}</span>
                              <Badge className={`ml-1 text-xs ${
                                item.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                                item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-green-500/20 text-green-300'
                              }`}>
                                {item.priority}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white px-4 py-2 rounded-lg border border-cyan-400/50">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
                        <span className="text-sm">Processing legal guidance...</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask for legal guidance..."
                className="bg-gray-800 border-gray-600 text-white flex-1"
                disabled={isProcessing}
              />
              <Button
                onClick={toggleVoiceInput}
                variant="outline"
                className={`border-gray-600 ${
                  isListening ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
                disabled={isProcessing}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button
                onClick={sendMessage}
                disabled={!userInput.trim() || isProcessing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="bg-gray-900/70 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-sm">Session Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-gray-400">
                  <span className="text-white">Domain:</span> {currentSession?.legalDomain}
                </div>
                <div className="text-xs text-gray-400">
                  <span className="text-white">Complexity:</span> {currentSession?.complexity}/10
                </div>
                <div className="text-xs text-gray-400">
                  <span className="text-white">Messages:</span> {currentSession?.messages.length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/70 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 justify-start"
                  onClick={() => setUserInput("What are my rights during a court-martial?")}
                >
                  <Scale className="w-4 h-4 mr-2" />
                  Court-Martial Rights
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 justify-start"
                  onClick={() => setUserInput("How do I appeal a security clearance denial?")}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Security Clearance
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 justify-start"
                  onClick={() => setUserInput("What is the process for discharge upgrades?")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Discharge Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolographicAssistant;