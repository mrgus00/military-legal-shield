import { useState, useEffect } from "react";
import { Shield, Star, Target, Zap, Activity, Award, Compass, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LoadingScreenProps {
  isLoading: boolean;
  loadingText?: string;
  variant?: "default" | "security" | "legal" | "emergency" | "tactical";
  progress?: number;
  showProgress?: boolean;
  onComplete?: () => void;
}

const militaryLoadingVariants = {
  default: {
    icon: Shield,
    color: "from-blue-600 to-blue-800",
    accentColor: "text-yellow-400",
    borderColor: "border-yellow-400",
    messages: [
      "Initializing secure connection...",
      "Accessing military legal database...",
      "Verifying credentials...",
      "Loading encrypted data...",
      "Ready for duty, service member"
    ]
  },
  security: {
    icon: Target,
    color: "from-red-600 to-red-800",
    accentColor: "text-yellow-300",
    borderColor: "border-yellow-300",
    messages: [
      "Scanning security protocols...",
      "Establishing secure channel...",
      "Authenticating clearance level...",
      "Encryption enabled...",
      "Security verified"
    ]
  },
  legal: {
    icon: Award,
    color: "from-green-600 to-green-800",
    accentColor: "text-gold-400",
    borderColor: "border-gold-400",
    messages: [
      "Accessing legal frameworks...",
      "Loading UCMJ database...",
      "Connecting to legal advisors...",
      "Preparing case resources...",
      "Legal system online"
    ]
  },
  emergency: {
    icon: Zap,
    color: "from-orange-600 to-red-700",
    accentColor: "text-yellow-200",
    borderColor: "border-yellow-200",
    messages: [
      "PRIORITY ACCESS INITIATED",
      "Connecting to emergency counsel...",
      "Locating nearest legal support...",
      "Activating rapid response...",
      "Emergency assistance ready"
    ]
  },
  tactical: {
    icon: Compass,
    color: "from-gray-700 to-gray-900",
    accentColor: "text-green-400",
    borderColor: "border-green-400",
    messages: [
      "Tactical systems online...",
      "Loading mission parameters...",
      "Establishing command link...",
      "All systems operational...",
      "Mission ready"
    ]
  }
};

export default function MilitaryLoadingScreen({ 
  isLoading, 
  loadingText,
  variant = "default",
  progress,
  showProgress = false,
  onComplete 
}: LoadingScreenProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [dotsCount, setDotsCount] = useState(0);
  
  const config = militaryLoadingVariants[variant];
  const IconComponent = config.icon;

  useEffect(() => {
    if (!isLoading) {
      onComplete?.();
      return;
    }

    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => 
        prev < config.messages.length - 1 ? prev + 1 : prev
      );
    }, 1200);

    const animationInterval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 800);

    const dotsInterval = setInterval(() => {
      setDotsCount(prev => (prev + 1) % 4);
    }, 400);

    return () => {
      clearInterval(messageInterval);
      clearInterval(animationInterval);
      clearInterval(dotsInterval);
    };
  }, [isLoading, config.messages.length, onComplete]);

  if (!isLoading) return null;

  const dots = ".".repeat(dotsCount);

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex items-center justify-center">
      {/* Military Grid Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Radar Sweep Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className={`absolute top-1/2 left-1/2 w-96 h-96 border border-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping opacity-20`}
        />
        <div 
          className={`absolute top-1/2 left-1/2 w-64 h-64 border border-green-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping opacity-30`}
          style={{ animationDelay: '0.5s' }}
        />
        <div 
          className={`absolute top-1/2 left-1/2 w-32 h-32 border border-green-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping opacity-40`}
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Main Loading Container */}
      <div className="relative z-10 text-center max-w-md mx-auto px-8">
        {/* Military Emblem */}
        <div className="relative mb-8">
          <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center shadow-2xl ${config.borderColor} border-4 animate-pulse`}>
            <IconComponent className={`w-12 h-12 ${config.accentColor} animate-spin`} style={{ animationDuration: '3s' }} />
          </div>
          
          {/* Military Stars */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
            <Star className="w-4 h-4 text-blue-900 fill-current" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
            <Star className="w-3 h-3 text-blue-900 fill-current" />
          </div>
        </div>

        {/* Military Rank Indicator */}
        <div className="flex justify-center mb-6">
          <Badge variant="secondary" className={`${config.accentColor} bg-opacity-20 border ${config.borderColor} font-bold text-sm tracking-wider animate-pulse`}>
            ★ SECURE MILITARY SYSTEM ★
          </Badge>
        </div>

        {/* Loading Messages */}
        <div className="mb-6">
          <div className={`text-xl font-bold ${config.accentColor} mb-2 font-mono tracking-wide`}>
            {loadingText || config.messages[currentMessageIndex]}
            <span className="animate-pulse">{dots}</span>
          </div>
          
          {/* Status Indicators */}
          <div className="flex justify-center space-x-4 mb-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i <= currentMessageIndex ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-6">
            <div className={`w-full bg-gray-700 rounded-full h-3 border ${config.borderColor}`}>
              <div 
                className={`h-full bg-gradient-to-r ${config.color} rounded-full transition-all duration-300 relative overflow-hidden`}
                style={{ width: `${progress || 0}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-20 animate-pulse" />
              </div>
            </div>
            <div className={`text-sm ${config.accentColor} mt-2 font-mono`}>
              {progress || 0}% COMPLETE
            </div>
          </div>
        )}

        {/* Military Activity Indicators */}
        <div className="flex justify-center space-x-6 text-green-400">
          <div className="flex flex-col items-center">
            <Activity className="w-5 h-5 animate-pulse mb-1" />
            <span className="text-xs font-mono">ACTIVE</span>
          </div>
          <div className="flex flex-col items-center">
            <Target className="w-5 h-5 animate-spin mb-1" style={{ animationDuration: '4s' }} />
            <span className="text-xs font-mono">SCANNING</span>
          </div>
          <div className="flex flex-col items-center">
            <Flag className="w-5 h-5 animate-bounce mb-1" />
            <span className="text-xs font-mono">SECURE</span>
          </div>
        </div>

        {/* Classification Banner */}
        <div className="mt-8 text-center">
          <div className={`inline-block px-4 py-1 bg-red-600 text-white text-xs font-bold tracking-wider border-2 border-red-400 animate-pulse`}>
            UNCLASSIFIED // FOR OFFICIAL USE ONLY
          </div>
        </div>
      </div>

      {/* Corner Military Decorations */}
      <div className="absolute top-4 left-4 text-yellow-400 opacity-50">
        <div className="text-xs font-mono tracking-wider">MILOPS</div>
        <div className="flex space-x-1 mt-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-yellow-400 animate-ping" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
      </div>

      <div className="absolute top-4 right-4 text-yellow-400 opacity-50">
        <div className="text-xs font-mono tracking-wider text-right">LEGAL.SYS</div>
        <div className="flex space-x-1 mt-1 justify-end">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-yellow-400 animate-ping" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}