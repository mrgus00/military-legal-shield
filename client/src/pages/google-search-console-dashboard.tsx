import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/page-layout";
import { 
  Search, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Copy,
  Zap,
  Globe,
  TrendingUp,
  FileText,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function GoogleSearchConsoleDashboard() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch Google Business Profile data
  const { data: businessProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/google/business-profile'],
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Fetch indexing status
  const { data: indexingStatus, isLoading: indexingLoading } = useQuery({
    queryKey: ['/api/google/indexing-status'],
    staleTime: 10 * 60 * 1000 // 10 minutes
  });

  // Submit sitemap mutation
  const submitSitemapMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/google/submit-sitemap'),
    onSuccess: () => {
      toast({
        title: "Sitemap Ready",
        description: "Sitemap is prepared for Google submission. Follow the instructions below.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to prepare sitemap submission.",
        variant: "destructive",
      });
    }
  });

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(label);
      toast({
        title: "Copied",
        description: `${label} copied to clipboard`,
      });
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please copy the URL manually",
        variant: "destructive",
      });
    }
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const quickActions = [
    {
      title: "Google Search Console",
      description: "Submit sitemap and monitor indexing",
      url: "https://search.google.com/search-console/",
      icon: Search,
      priority: "high"
    },
    {
      title: "Google Analytics",
      description: "Set up tracking and conversion goals",
      url: "https://analytics.google.com/",
      icon: TrendingUp,
      priority: "high"
    },
    {
      title: "Google Tag Manager",
      description: "Configure advanced tracking",
      url: "https://tagmanager.google.com/",
      icon: Settings,
      priority: "medium"
    },
    {
      title: "Google My Business",
      description: "Create business listing",
      url: "https://business.google.com/",
      icon: Globe,
      priority: "medium"
    }
  ];

  const submissionSteps = [
    {
      step: 1,
      title: "Verify Domain Ownership",
      description: "Add verification meta tag or upload HTML file",
      status: "pending",
      action: "Add to website head section"
    },
    {
      step: 2,
      title: "Submit Sitemap",
      description: "Submit sitemap.xml to Google Search Console",
      status: "ready",
      action: "Click submit button below"
    },
    {
      step: 3,
      title: "Request Indexing",
      description: "Request indexing for key pages",
      status: "pending",
      action: "Use URL inspection tool"
    },
    {
      step: 4,
      title: "Monitor Performance",
      description: "Track search visibility and performance",
      status: "ongoing",
      action: "Check weekly reports"
    }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className={`cursor-pointer hover:shadow-lg transition-shadow ${
                action.priority === 'high' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-6 h-6 ${
                      action.priority === 'high' ? 'text-red-600' : 'text-blue-600'
                    }`} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{action.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                      <Button 
                        size="sm" 
                        className="mt-2 w-full"
                        onClick={() => openInNewTab(action.url)}
                      >
                        Open <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="submission" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="submission">Submission Process</TabsTrigger>
            <TabsTrigger value="sitemap">Sitemap Status</TabsTrigger>
            <TabsTrigger value="business">Business Profile</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="submission" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Google Search Console Submission Steps
                </CardTitle>
                <CardDescription>
                  Follow these steps to connect MilitaryLegalShield.com with Google Search Console
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissionSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        step.status === 'ready' ? 'bg-green-100 text-green-800' :
                        step.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <Badge variant={
                            step.status === 'ready' ? 'default' :
                            step.status === 'pending' ? 'secondary' :
                            'outline'
                          }>
                            {step.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{step.action}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                <strong>Ready to Submit:</strong> Your sitemap and verification files are configured. 
                Use the buttons below to access Google services directly.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="sitemap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sitemap Submission</CardTitle>
                <CardDescription>
                  Submit your sitemap to Google Search Console for faster indexing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Main Sitemap URL</label>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 p-2 bg-gray-100 rounded text-sm">
                        https://militarylegalshield.com/sitemap.xml
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard('https://militarylegalshield.com/sitemap.xml', 'Sitemap URL')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">RSS Feed URL</label>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 p-2 bg-gray-100 rounded text-sm">
                        https://militarylegalshield.com/rss.xml
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard('https://militarylegalshield.com/rss.xml', 'RSS Feed URL')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => submitSitemapMutation.mutate()}
                    disabled={submitSitemapMutation.isPending}
                    className="mr-4"
                  >
                    {submitSitemapMutation.isPending ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Preparing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Prepare Sitemap Submission
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => openInNewTab('https://search.google.com/search-console/sitemaps')}
                  >
                    Open Google Search Console <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Google My Business Profile</CardTitle>
                <CardDescription>
                  Set up your business profile for local search visibility
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profileLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Clock className="w-6 h-6 animate-spin mr-2" />
                    Loading business profile data...
                  </div>
                ) : businessProfile ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Business Information</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Name:</strong> Military Legal Shield</p>
                          <p><strong>Category:</strong> Legal Services</p>
                          <p><strong>Service Area:</strong> United States (All Military Bases)</p>
                          <p><strong>Hours:</strong> 24/7 Emergency Support</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Contact Information</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Phone:</strong> +1-800-MILITARY</p>
                          <p><strong>Email:</strong> support@militarylegalshield.com</p>
                          <p><strong>Emergency:</strong> 24/7 Legal Assistance</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2">Setup Steps</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                        <li>Go to Google My Business and create account</li>
                        <li>Add business name: "Military Legal Shield"</li>
                        <li>Select category: "Legal Services"</li>
                        <li>Add service areas (all US military installations)</li>
                        <li>Upload business photos and descriptions</li>
                        <li>Verify business ownership</li>
                      </ol>
                    </div>

                    <Button 
                      onClick={() => openInNewTab('https://business.google.com/')}
                      className="w-full"
                    >
                      Set Up Google My Business <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">Failed to load business profile data</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Indexing Status & Monitoring</CardTitle>
                <CardDescription>
                  Monitor how Google indexes and ranks your pages
                </CardDescription>
              </CardHeader>
              <CardContent>
                {indexingLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Clock className="w-6 h-6 animate-spin mr-2" />
                    Checking indexing status...
                  </div>
                ) : indexingStatus ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Important URLs to Monitor</h4>
                      <div className="space-y-2">
                        {indexingStatus.urls?.map((url: string, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <code className="text-sm">{url}</code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openInNewTab(`https://search.google.com/search-console/inspect?resource_id=https://militarylegalshield.com&id=${encodeURIComponent(url)}`)}
                            >
                              Inspect <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2">Manual Indexing Check</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Search Google to see which pages are already indexed
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => openInNewTab('https://www.google.com/search?q=site:militarylegalshield.com')}
                      >
                        Check Indexed Pages <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">Failed to load indexing status</p>
                )}
              </CardContent>
            </Card>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> Initial indexing can take 24-48 hours. Full visibility may take 1-2 weeks.
                Monitor your Google Search Console regularly for performance insights.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}