import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Share2, 
  Mouse, 
  DollarSign, 
  Target,
  BarChart3,
  PieChart,
  LinkIcon,
  Zap,
  Award,
  Calendar
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { HomeButton } from '@/components/HomeButton';

interface SEOMetrics {
  totalImpressions: number;
  totalClicks: number;
  avgCTR: number;
  avgPosition: number;
  topKeywords: Array<{ keyword: string; clicks: number; position: number }>;
  topPages: Array<{ page: string; clicks: number; impressions: number }>;
}

interface SocialEngagement {
  totalShares: number;
  totalEngagement: number;
  platformBreakdown: Array<{ platform: string; shares: number; engagement: number }>;
  topContent: Array<{ contentType: string; shares: number; engagement: number }>;
  viralityScore: number;
}

interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  totalRewards: number;
  topPerformingSource: string;
}

interface MarketingDashboardData {
  seo: SEOMetrics;
  social: SocialEngagement;
  timestamp: string;
}

export default function MarketingDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [referralCode, setReferralCode] = useState('');
  const [shareContent, setShareContent] = useState({
    contentType: 'attorney-match',
    platform: 'facebook',
    customText: ''
  });

  const queryClient = useQueryClient();

  // Fetch marketing dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery<MarketingDashboardData>({
    queryKey: ['/api/marketing/dashboard']
  });

  // Fetch SEO report with time range
  const { data: seoData, isLoading: isSeoLoading } = useQuery<SEOMetrics>({
    queryKey: ['/api/marketing/seo/report', selectedTimeRange],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/marketing/seo/report?timeRange=${selectedTimeRange}`);
      return response.json();
    }
  });

  // Fetch social engagement
  const { data: socialData, isLoading: isSocialLoading } = useQuery<SocialEngagement>({
    queryKey: ['/api/marketing/social/engagement']
  });

  // Create referral mutation
  const createReferralMutation = useMutation({
    mutationFn: (data: { referredEmail: string; source: string }) =>
      apiRequest('POST', '/api/marketing/referrals', {
        referredEmail: data.referredEmail,
        referralCode: generateReferralCode(),
        source: data.source,
        metadata: { platform: 'dashboard' }
      }),
    onSuccess: () => {
      toast({
        title: "Referral Created",
        description: "Your referral link has been generated successfully!"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/marketing'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create referral. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Track social share mutation
  const trackShareMutation = useMutation({
    mutationFn: (shareData: any) =>
      apiRequest('POST', '/api/marketing/social/share', shareData),
    onSuccess: () => {
      toast({
        title: "Share Tracked",
        description: "Social media share has been tracked successfully!"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/marketing/social'] });
    }
  });

  // Generate shareable content mutation
  const generateContentMutation = useMutation({
    mutationFn: async (contentData: { contentType: string; contentId: string }) => {
      const response = await apiRequest('POST', '/api/marketing/social/generate-content', contentData);
      return response.json();
    },
    onSuccess: (data: any) => {
      navigator.clipboard.writeText(data.shareUrl);
      toast({
        title: "Content Generated",
        description: "Shareable content created and URL copied to clipboard!"
      });
    }
  });

  const generateReferralCode = () => {
    return 'REF-' + Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handleCreateReferral = () => {
    const email = (document.getElementById('referral-email') as HTMLInputElement)?.value;
    const source = (document.getElementById('referral-source') as HTMLSelectElement)?.value;
    
    if (email && source) {
      createReferralMutation.mutate({ referredEmail: email, source });
    }
  };

  const handleTrackShare = () => {
    trackShareMutation.mutate({
      platform: shareContent.platform,
      contentType: shareContent.contentType,
      contentId: Date.now().toString(),
      shareText: shareContent.customText || `Check out MilitaryLegalShield - Legal protection for service members!`,
      shareUrl: window.location.origin,
      engagement: {
        likes: 0,
        shares: 1,
        comments: 0,
        clickThroughs: 0
      }
    });
  };

  const handleGenerateContent = () => {
    generateContentMutation.mutate({
      contentType: shareContent.contentType,
      contentId: Date.now().toString()
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  if (isDashboardLoading || isSeoLoading || isSocialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <HomeButton />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Marketing Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Monitor SEO, social media, and referral performance</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="text-xs">
              Updated: {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(seoData?.totalImpressions || 0)}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12.5% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
              <Mouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercentage(seoData?.avgCTR || 0)}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +2.1% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Social Shares</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(socialData?.totalShares || 0)}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +8.3% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Virality Score</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(socialData?.viralityScore || 0)}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +15.7% from last period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="seo" className="space-y-6">
          <TabsList>
            <TabsTrigger value="seo">SEO Performance</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="referrals">Referral Program</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          </TabsList>

          {/* SEO Performance Tab */}
          <TabsContent value="seo" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Top Keywords */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Top Performing Keywords
                  </CardTitle>
                  <CardDescription>Keywords driving the most traffic</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {seoData?.topKeywords?.map((keyword, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{keyword.keyword}</p>
                          <p className="text-sm text-muted-foreground">Position: {keyword.position}</p>
                        </div>
                        <Badge variant="secondary">{formatNumber(keyword.clicks)} clicks</Badge>
                      </div>
                    )) || <p className="text-muted-foreground">No keyword data available</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Top Landing Pages
                  </CardTitle>
                  <CardDescription>Pages with highest organic traffic</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {seoData?.topPages?.map((page, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{page.page}</p>
                          <p className="text-sm text-muted-foreground">{formatNumber(page.impressions)} impressions</p>
                        </div>
                        <Badge variant="secondary">{formatNumber(page.clicks)} clicks</Badge>
                      </div>
                    )) || <p className="text-muted-foreground">No page data available</p>}
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Platform Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Platform Performance
                  </CardTitle>
                  <CardDescription>Engagement across social platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {socialData?.platformBreakdown?.map((platform, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium capitalize">{platform.platform}</p>
                          <p className="text-sm text-muted-foreground">{formatNumber(platform.shares)} shares</p>
                        </div>
                        <Badge variant="secondary">{formatNumber(platform.engagement)} engagements</Badge>
                      </div>
                    )) || <p className="text-muted-foreground">No platform data available</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Content Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Top Content Types
                  </CardTitle>
                  <CardDescription>Most engaging content categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {socialData?.topContent?.map((content, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{content.contentType.replace('-', ' ')}</p>
                          <p className="text-sm text-muted-foreground">{formatNumber(content.shares)} shares</p>
                        </div>
                        <Badge variant="secondary">{formatNumber(content.engagement)} total engagement</Badge>
                      </div>
                    )) || <p className="text-muted-foreground">No content data available</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Social Sharing Tools */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Share2 className="h-5 w-5 mr-2" />
                    Share Content
                  </CardTitle>
                  <CardDescription>Generate and track social media content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="content-type">Content Type</Label>
                      <Select 
                        value={shareContent.contentType} 
                        onValueChange={(value) => setShareContent({...shareContent, contentType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="attorney-match">Attorney Match Success</SelectItem>
                          <SelectItem value="emergency-booking">Emergency Legal Help</SelectItem>
                          <SelectItem value="legal-guide">Legal Rights Guide</SelectItem>
                          <SelectItem value="success-story">Success Story</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="platform">Platform</Label>
                      <Select 
                        value={shareContent.platform} 
                        onValueChange={(value) => setShareContent({...shareContent, platform: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end space-x-2">
                      <Button onClick={handleGenerateContent} disabled={generateContentMutation.isPending}>
                        Generate Content
                      </Button>
                      <Button onClick={handleTrackShare} variant="outline" disabled={trackShareMutation.isPending}>
                        Track Share
                      </Button>
                    </div>
                  </div>
                  {shareContent.customText && (
                    <div className="mt-4">
                      <Label htmlFor="custom-text">Custom Message</Label>
                      <Textarea
                        id="custom-text"
                        value={shareContent.customText}
                        onChange={(e) => setShareContent({...shareContent, customText: e.target.value})}
                        placeholder="Add custom text to your share..."
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* Referral Program Tab */}
          <TabsContent value="referrals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Create Referral */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Create Referral
                  </CardTitle>
                  <CardDescription>Generate referral links for new users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="referral-email">Referred Email</Label>
                      <Input id="referral-email" type="email" placeholder="user@example.com" />
                    </div>
                    <div>
                      <Label htmlFor="referral-source">Source</Label>
                      <Select>
                        <SelectTrigger id="referral-source">
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="direct">Direct</SelectItem>
                          <SelectItem value="affiliate">Affiliate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleCreateReferral} disabled={createReferralMutation.isPending} className="w-full">
                      {createReferralMutation.isPending ? 'Creating...' : 'Create Referral'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* UTM Generator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LinkIcon className="h-5 w-5 mr-2" />
                    UTM Link Generator
                  </CardTitle>
                  <CardDescription>Generate tracked campaign links</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="utm-campaign">Campaign</Label>
                      <Input id="utm-campaign" placeholder="summer-2024" />
                    </div>
                    <div>
                      <Label htmlFor="utm-source">Source</Label>
                      <Input id="utm-source" placeholder="facebook" />
                    </div>
                    <div>
                      <Label htmlFor="utm-medium">Medium</Label>
                      <Input id="utm-medium" placeholder="social" />
                    </div>
                    <Button className="w-full" onClick={() => {
                      const campaign = (document.getElementById('utm-campaign') as HTMLInputElement)?.value;
                      const source = (document.getElementById('utm-source') as HTMLInputElement)?.value;
                      const medium = (document.getElementById('utm-medium') as HTMLInputElement)?.value;
                      
                      if (campaign && source && medium) {
                        const url = `${window.location.origin}?utm_campaign=${campaign}&utm_source=${source}&utm_medium=${medium}`;
                        navigator.clipboard.writeText(url);
                        toast({
                          title: "UTM Link Generated",
                          description: "Link copied to clipboard!"
                        });
                      }
                    }}>
                      Generate UTM Link
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Active Campaigns
                </CardTitle>
                <CardDescription>Monitor and manage marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Campaign management coming soon...</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Track performance across email, social, and paid campaigns
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

      </div>
    </div>
  );
}