import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Phone, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Shield,
  Users,
  ExternalLink
} from "lucide-react";

interface WhatsAppConnectorProps {
  variant?: "emergency" | "support" | "consultation" | "compact";
  phoneNumber?: string;
  message?: string;
  className?: string;
}

export default function WhatsAppConnector({ 
  variant = "support", 
  phoneNumber = "+1-800-645-5342",
  message,
  className = ""
}: WhatsAppConnectorProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const getDefaultMessage = () => {
    switch (variant) {
      case "emergency":
        return "🚨 EMERGENCY LEGAL ASSISTANCE NEEDED - I require immediate military legal support. Please connect me with an available attorney.";
      case "consultation":
        return "📋 Legal Consultation Request - I would like to schedule a consultation with a military attorney to discuss my legal matter.";
      case "support":
        return "💬 General Support - I need assistance with military legal services and would like to speak with a representative.";
      default:
        return "👋 Hello, I need assistance with military legal services.";
    }
  };

  const handleWhatsAppConnect = () => {
    setIsConnecting(true);
    
    const finalMessage = message || getDefaultMessage();
    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    
    // Track interaction for analytics
    console.log("WhatsApp connection initiated:", { variant, phoneNumber });
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Reset connecting state after a delay
    setTimeout(() => setIsConnecting(false), 2000);
  };

  if (variant === "compact") {
    return (
      <Button
        onClick={handleWhatsAppConnect}
        disabled={isConnecting}
        className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
        size="sm"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        {isConnecting ? "Connecting..." : "WhatsApp"}
      </Button>
    );
  }

  const variantConfig = {
    emergency: {
      title: "Emergency WhatsApp Support",
      description: "Immediate response for urgent legal matters requiring instant attention",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      buttonColor: "bg-red-600 hover:bg-red-700",
      icon: AlertCircle,
      iconColor: "text-red-600",
      badge: "Emergency - 24/7",
      badgeColor: "bg-red-100 text-red-800",
      responseTime: "under 5 minutes"
    },
    consultation: {
      title: "WhatsApp Consultation Booking",
      description: "Schedule attorney consultations and legal advice sessions via WhatsApp",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200", 
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      icon: Users,
      iconColor: "text-blue-600",
      badge: "Professional Service",
      badgeColor: "bg-blue-100 text-blue-800",
      responseTime: "Within 1 hour"
    },
    support: {
      title: "WhatsApp Support Chat",
      description: "Direct messaging for questions, guidance, and general assistance",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      buttonColor: "bg-green-600 hover:bg-green-700", 
      icon: MessageCircle,
      iconColor: "text-green-600",
      badge: "24/7 Available",
      badgeColor: "bg-green-100 text-green-800",
      responseTime: "under 15 minutes"
    }
  };

  const config = variantConfig[variant];
  const IconComponent = config.icon;

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{config.title}</CardTitle>
              <Badge className={`${config.badgeColor} mt-1`}>
                {config.badge}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {config.responseTime}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 mb-4">{config.description}</p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Encrypted messaging for privacy</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Direct connection to legal experts</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>File sharing capabilities</span>
          </div>
          {variant === "emergency" && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-red-600" />
              <span>Priority emergency routing</span>
            </div>
          )}
        </div>

        <Button
          onClick={handleWhatsAppConnect}
          disabled={isConnecting}
          className={`w-full ${config.buttonColor} text-white`}
          size="lg"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          {isConnecting ? "Connecting to WhatsApp..." : "Start WhatsApp Chat"}
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>

        <div className="mt-3 text-xs text-gray-500 text-center">
          Clicking will open WhatsApp with a pre-filled message. 
          Standard messaging rates may apply.
        </div>
      </CardContent>
    </Card>
  );
}

// Floating WhatsApp button component
export function FloatingWhatsAppButton() {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Notification badge */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
          !
        </div>
        
        <Button
          onClick={() => {
            const whatsappUrl = `https://wa.me/18006455342?text=${encodeURIComponent("👋 Hello! I need assistance with military legal services.")}`;
            window.open(whatsappUrl, '_blank');
          }}
          className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
        
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-1 -right-1 w-5 h-5 bg-gray-600 text-white rounded-full text-xs hover:bg-gray-700"
        >
          ×
        </button>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-16 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
        Need help? Chat with us on WhatsApp
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
}