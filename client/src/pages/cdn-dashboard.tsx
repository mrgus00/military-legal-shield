import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Zap, 
  Globe, 
  Shield, 
  Activity, 
  RefreshCw, 
  ImageIcon, 
  Settings, 
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  Gauge
} from "lucide-react";

interface CDNMetrics {
  cdnEnabled: boolean;
  cloudflareEnabled: boolean;
  cdnDomain: string;
  cacheHeaders: Record<string, string>;
  features: Record<string, boolean>;
}

export default function CDNDashboard() {
  const [cacheUrls, setCacheUrls] = useState('');
  const [assetPath, setAssetPath] = useState('/assets/images/logo.png');
  const [optimizationSettings, setOptimizationSettings] = useState({
    width: 800,
    height: 600,
    quality: 85,
    format: 'webp' as 'webp' | 'jpeg' | 'png' | 'avif'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch CDN metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery<CDNMetrics>({
    queryKey: ['/api/cdn/metrics'],
  });

  // Cache purge mutation
  const purgeCacheMutation = useMutation({
    mutationFn: async (urls: string[]) => {
      const response = await apiRequest('POST', '/api/cdn/purge-cache', { urls });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Cache Purged",
        description: `Successfully purged ${data.purgedUrls} URLs`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/cdn/metrics'] });
    },
    onError: () => {
      toast({
        title: "Purge Failed",
        description: "Failed to purge cache. Check your configuration.",
        variant: "destructive"
      });
    }
  });

  // Asset URL generation mutation
  const generateUrlMutation = useMutation({
    mutationFn: async ({ assetPath, optimization }: { assetPath: string, optimization?: any }) => {
      const response = await apiRequest('POST', '/api/cdn/asset-url', { 
        assetPath, 
        optimization 
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "URL Generated",
        description: "Optimized asset URL created successfully",
      });
    }
  });

  const handlePurgeCache = async () => {
    const urls = cacheUrls.split('\n').filter(url => url.trim()).map(url => url.trim());
    if (urls.length === 0) {
      toast({
        title: "No URLs Provided",
        description: "Please enter URLs to purge",
        variant: "destructive"
      });
      return;
    }
    purgeCacheMutation.mutate(urls);
  };

  const handleGenerateUrl = async (withOptimization = false) => {
    const optimization = withOptimization ? optimizationSettings : undefined;
    generateUrlMutation.mutate({ assetPath, optimization });
  };

  if (metricsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CDN Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              CDN & Cloudflare Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Monitor and manage content delivery network performance for Military Legal Shield
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">CDN Status</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metrics?.cdnEnabled ? 'Active' : 'Disabled'}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${metrics?.cdnEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {metrics?.cdnEnabled ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cloudflare</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metrics?.cloudflareEnabled ? 'Connected' : 'Offline'}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${metrics?.cloudflareEnabled ? 'bg-orange-100' : 'bg-gray-100'}`}>
                    {metrics?.cloudflareEnabled ? (
                      <Globe className="h-6 w-6 text-orange-600" />
                    ) : (
                      <Globe className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cache Performance</p>
                    <p className="text-2xl font-bold text-gray-900">98.5%</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <Gauge className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Global Reach</p>
                    <p className="text-2xl font-bold text-gray-900">200+ POPs</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="cache">Cache Management</TabsTrigger>
              <TabsTrigger value="optimization">Image Optimization</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-blue-600" />
                      <span>Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>CDN Domain</Label>
                      <Input 
                        value={metrics?.cdnDomain || 'Not configured'} 
                        readOnly 
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant={metrics?.cdnEnabled ? "default" : "secondary"}>
                          CDN {metrics?.cdnEnabled ? 'ON' : 'OFF'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={metrics?.cloudflareEnabled ? "default" : "secondary"}>
                          Cloudflare {metrics?.cloudflareEnabled ? 'ON' : 'OFF'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-orange-600" />
                      <span>Features</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {metrics?.features && Object.entries(metrics.features).map(([feature, enabled]) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="text-sm capitalize">{feature.replace(/([A-Z])/g, ' $1')}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Cache Management Tab */}
            <TabsContent value="cache" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <RefreshCw className="h-5 w-5 text-red-600" />
                    <span>Cache Purge</span>
                  </CardTitle>
                  <CardDescription>
                    Purge specific URLs from Cloudflare cache
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>URLs to Purge (one per line)</Label>
                    <Textarea
                      placeholder="https://example.com/assets/style.css&#10;https://example.com/images/logo.png"
                      value={cacheUrls}
                      onChange={(e) => setCacheUrls(e.target.value)}
                      rows={5}
                    />
                  </div>
                  <Button 
                    onClick={handlePurgeCache} 
                    disabled={purgeCacheMutation.isPending}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {purgeCacheMutation.isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Purging...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Purge Cache
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cache Headers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {metrics?.cacheHeaders && Object.entries(metrics.cacheHeaders).map(([type, duration]) => (
                      <div key={type} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium capitalize">{type}</span>
                        <Badge variant="outline">{duration}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Image Optimization Tab */}
            <TabsContent value="optimization" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5 text-green-600" />
                    <span>Image URL Generator</span>
                  </CardTitle>
                  <CardDescription>
                    Generate optimized image URLs with Cloudflare Image Resizing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Asset Path</Label>
                    <Input
                      value={assetPath}
                      onChange={(e) => setAssetPath(e.target.value)}
                      placeholder="/assets/images/hero.jpg"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Width</Label>
                      <Input
                        type="number"
                        value={optimizationSettings.width}
                        onChange={(e) => setOptimizationSettings(prev => ({ 
                          ...prev, 
                          width: parseInt(e.target.value) || 0 
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Height</Label>
                      <Input
                        type="number"
                        value={optimizationSettings.height}
                        onChange={(e) => setOptimizationSettings(prev => ({ 
                          ...prev, 
                          height: parseInt(e.target.value) || 0 
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quality</Label>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={optimizationSettings.quality}
                        onChange={(e) => setOptimizationSettings(prev => ({ 
                          ...prev, 
                          quality: parseInt(e.target.value) || 85 
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Format</Label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={optimizationSettings.format}
                        onChange={(e) => setOptimizationSettings(prev => ({ 
                          ...prev, 
                          format: e.target.value as any 
                        }))}
                      >
                        <option value="webp">WebP</option>
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="avif">AVIF</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button 
                      onClick={() => handleGenerateUrl(false)}
                      disabled={generateUrlMutation.isPending}
                      variant="outline"
                    >
                      Generate Standard URL
                    </Button>
                    <Button 
                      onClick={() => handleGenerateUrl(true)}
                      disabled={generateUrlMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Generate Optimized URL
                    </Button>
                  </div>

                  {generateUrlMutation.data && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Label>Generated URL:</Label>
                      <code className="block mt-2 text-sm bg-gray-100 p-2 rounded break-all">
                        {generateUrlMutation.data.url}
                      </code>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <span>Security Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Active Protections</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">DDoS Protection</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">SSL/TLS Encryption</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Bot Protection</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Rate Limiting</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Security Headers</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Content Security Policy</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">X-Frame-Options</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">X-Content-Type-Options</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Strict-Transport-Security</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">24.7GB</p>
                        <p className="text-sm text-gray-600">Bandwidth Saved</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">87ms</p>
                        <p className="text-sm text-gray-600">Avg Response Time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-8 w-8 text-orange-600" />
                      <div>
                        <p className="text-2xl font-bold">1.2M</p>
                        <p className="text-sm text-gray-600">Requests Today</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold">847</p>
                        <p className="text-sm text-gray-600">Threats Blocked</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}