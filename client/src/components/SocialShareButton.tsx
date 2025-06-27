import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Share2, Facebook, Twitter, Linkedin, Instagram, Copy, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface SocialShareButtonProps {
  contentType: 'attorney-match' | 'emergency-booking' | 'legal-guide' | 'success-story';
  contentId: string;
  title?: string;
  description?: string;
  className?: string;
}

interface ShareContent {
  title: string;
  description: string;
  image: string;
  hashtags: string[];
  shareUrl: string;
  trackingPixel: string;
}

export default function SocialShareButton({
  contentType,
  contentId,
  title,
  description,
  className = ""
}: SocialShareButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareContent, setShareContent] = useState<ShareContent | null>(null);

  const generateShareContent = async () => {
    setIsGenerating(true);
    try {
      const response = await apiRequest('POST', '/api/marketing/social/generate-content', {
        contentType,
        contentId
      });
      const content = await response.json();
      setShareContent(content);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate shareable content",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const trackShare = async (platform: string) => {
    try {
      await apiRequest('POST', '/api/marketing/social/share', {
        platform,
        contentType,
        contentId,
        shareText: shareContent?.title || title || 'Check out MilitaryLegalShield!',
        shareUrl: shareContent?.shareUrl || window.location.href,
        engagement: {
          likes: 0,
          shares: 1,
          comments: 0,
          clickThroughs: 0
        }
      });
    } catch (error) {
      console.error('Failed to track share:', error);
    }
  };

  const openShareWindow = (url: string, platform: string) => {
    trackShare(platform);
    window.open(url, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async () => {
    const url = shareContent?.shareUrl || window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      trackShare('direct');
      toast({
        title: "Link Copied",
        description: "Share link copied to clipboard!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive"
      });
    }
  };

  const getShareUrls = () => {
    const url = encodeURIComponent(shareContent?.shareUrl || window.location.href);
    const text = encodeURIComponent(shareContent?.title || title || 'Check out MilitaryLegalShield - Legal protection for service members!');
    const hashtags = shareContent?.hashtags?.join(',') || 'MilitaryLegal,VeteranSupport,LegalShield';

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      email: `mailto:?subject=${text}&body=Check out this great resource: ${url}`
    };
  };

  const shareUrls = getShareUrls();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={className}
          onClick={!shareContent ? generateShareContent : undefined}
          disabled={isGenerating}
        >
          <Share2 className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Share'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center justify-between">
          Share Content
          {shareContent && (
            <Badge variant="secondary" className="text-xs">
              Optimized
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => openShareWindow(shareUrls.facebook, 'facebook')}>
          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          Facebook
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => openShareWindow(shareUrls.twitter, 'twitter')}>
          <Twitter className="h-4 w-4 mr-2 text-blue-400" />
          Twitter
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => openShareWindow(shareUrls.linkedin, 'linkedin')}>
          <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
          LinkedIn
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => openShareWindow(shareUrls.whatsapp, 'whatsapp')}>
          <svg className="h-4 w-4 mr-2 text-green-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.322"/>
          </svg>
          WhatsApp
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={copyToClipboard}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => window.open(shareUrls.email, '_blank')}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Email
        </DropdownMenuItem>
        
        {shareContent?.hashtags && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1">
              <p className="text-xs text-muted-foreground mb-1">Suggested hashtags:</p>
              <p className="text-xs">{shareContent.hashtags.join(' ')}</p>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}