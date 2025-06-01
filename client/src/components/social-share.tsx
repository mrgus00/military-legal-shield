import { useState } from "react";
import { Share2, Facebook, Twitter, Linkedin, Link, MessageCircle, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  title: string;
  description: string;
  url?: string;
  category?: string;
  customMessage?: string;
  showCustomMessage?: boolean;
}

export default function SocialShare({ 
  title, 
  description, 
  url = window.location.href,
  category,
  customMessage = "",
  showCustomMessage = false
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState(customMessage);
  const { toast } = useToast();

  const shareData = {
    title,
    description,
    url,
    hashtags: "#MilitarySupport #Veterans #LegalDefense #MilLegal"
  };

  const encodedTitle = encodeURIComponent(shareData.title);
  const encodedDescription = encodeURIComponent(shareData.description);
  const encodedUrl = encodeURIComponent(shareData.url);
  const encodedMessage = encodeURIComponent(shareMessage || `${shareData.title} - ${shareData.description}`);

  const socialPlatforms = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`,
      description: "Share on Facebook"
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-500 hover:bg-sky-600",
      url: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}&hashtags=MilitarySupport,Veterans,LegalDefense`,
      description: "Share on Twitter"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700 hover:bg-blue-800",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
      description: "Share on LinkedIn"
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-600 hover:bg-green-700",
      url: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`,
      description: "Share on WhatsApp"
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      toast({
        title: "Link Copied",
        description: "The link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSocialShare = (platform: typeof socialPlatforms[0]) => {
    window.open(platform.url, '_blank', 'width=600,height=400');
    
    // Analytics tracking
    console.log(`Shared to ${platform.name}:`, {
      title: shareData.title,
      url: shareData.url,
      category: category || 'general'
    });
  };

  const defaultMessages = {
    attorney: "Found an excellent attorney through MilLegal Defense! Professional legal support for military personnel. 🇺🇸",
    consultation: "Just booked a legal consultation through MilLegal Defense. Quick and efficient process! ⚖️",
    resource: "Discovered valuable legal resources on MilLegal Defense. Essential for military personnel! 📚",
    review: "Left a review on MilLegal Defense. Great platform for military legal support! ⭐",
    general: "Check out MilLegal Defense - comprehensive legal support platform for military personnel! 🛡️"
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-military-gold-500" />
            Share This Content
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Content Preview */}
          <div className="bg-sage-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-navy-700 mb-1">{shareData.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{shareData.description}</p>
            {category && (
              <Badge variant="outline" className="text-xs">
                {category}
              </Badge>
            )}
          </div>

          {/* Custom Message */}
          {showCustomMessage && (
            <div className="space-y-2">
              <Label htmlFor="shareMessage">Custom Message (Optional)</Label>
              <Textarea
                id="shareMessage"
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                placeholder={defaultMessages[category as keyof typeof defaultMessages] || defaultMessages.general}
                rows={3}
                maxLength={280}
              />
              <p className="text-xs text-gray-500 text-right">
                {shareMessage.length}/280 characters
              </p>
            </div>
          )}

          {/* Social Platforms */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Share on Social Media
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {socialPlatforms.map((platform) => (
                <Button
                  key={platform.name}
                  variant="outline"
                  className={`${platform.color} text-white border-none justify-start gap-3 p-3 h-auto`}
                  onClick={() => handleSocialShare(platform)}
                >
                  <platform.icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium text-sm">{platform.name}</div>
                    <div className="text-xs opacity-90">{platform.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <Label htmlFor="shareUrl" className="text-sm font-medium text-gray-700">
              Or Copy Link
            </Label>
            <div className="flex gap-2">
              <Input
                id="shareUrl"
                value={shareData.url}
                readOnly
                className="flex-1 bg-gray-50"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="gap-2 min-w-fit"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* OPSEC Reminder */}
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-yellow-800 mb-1">OPSEC Reminder</p>
                <p className="text-xs text-yellow-700">
                  Avoid sharing sensitive personal information, unit details, or location data when posting about legal matters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Preset share configurations for different content types
export const SharePresets = {
  attorney: (attorneyName: string, specialty: string) => ({
    title: `Legal Representation - ${attorneyName}`,
    description: `Military attorney specializing in ${specialty}. Professional legal defense for service members.`,
    category: "attorney" as const,
    customMessage: `Found excellent legal representation through MilLegal Defense! ${attorneyName} specializes in ${specialty}. Highly recommend for military personnel needing legal support. 🇺🇸⚖️`,
    showCustomMessage: true
  }),

  consultation: (date: string, type: string) => ({
    title: "Legal Consultation Booked",
    description: `Scheduled ${type} consultation for ${date}. Quick and professional booking process.`,
    category: "consultation" as const,
    customMessage: `Just scheduled a legal consultation through MilLegal Defense! The booking process was incredibly smooth and professional. Essential resource for military personnel. 🛡️`,
    showCustomMessage: true
  }),

  resource: (resourceTitle: string, category: string) => ({
    title: `Legal Resource: ${resourceTitle}`,
    description: `Valuable ${category} information for military personnel. Educational and comprehensive guidance.`,
    category: "resource" as const,
    customMessage: `Discovered valuable legal resources on MilLegal Defense: "${resourceTitle}". Essential information for military personnel navigating legal challenges. 📚⚖️`,
    showCustomMessage: true
  }),

  platform: () => ({
    title: "MilLegal Defense - Military Legal Support",
    description: "Comprehensive legal defense platform for military personnel and veterans. Professional attorneys, resources, and support services.",
    category: "general" as const,
    customMessage: "Discovered MilLegal Defense - an incredible platform providing comprehensive legal support for military personnel and veterans. Professional attorneys, educational resources, and emergency support all in one place! 🇺🇸🛡️",
    showCustomMessage: true
  })
};