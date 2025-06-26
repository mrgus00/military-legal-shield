import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Image, 
  Database, 
  Zap, 
  Globe, 
  Clock,
  TrendingUp,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface PerformanceMetrics {
  performance: {
    requests: number;
    cacheHits: number;
    cacheMisses: number;
    averageResponseTime: number;
    slowRequests: number;
    cacheHitRate: number;
    slowRequestRate: number;
  };
  cache: {
    size: number;
    maxSize: number;
    hitRate: number;
  };
  images: {
    entries: number;
    sizeBytes: number;
    sizeMB: number;
    maxSizeMB: number;
  };
  timestamp: string;
}

export function PerformanceOptimization() {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('overview');

  const { data: metrics, isLoading, refetch } = useQuery<PerformanceMetrics>({
    queryKey: ['/api/performance/metrics'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const clearCacheMutation = useMutation({
    mutationFn: async (pattern?: string) => {
      return apiRequest('POST', '/api/performance/cache/clear', { pattern });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/performance/metrics'] });
    },
  });

  const handleClearCache = (pattern?: string) => {
    clearCacheMutation.mutate(pattern);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const getPerformanceScore = () => {
    if (!metrics) return 0;
    const { performance } = metrics;
    
    // Calculate score based on cache hit rate and response time
    const cacheScore = performance.cacheHitRate * 0.4;
    const responseScore = Math.max(0, (1000 - performance.averageResponseTime) / 1000) * 40;
    const slowRequestScore = Math.max(0, (100 - performance.slowRequestRate) / 100) * 20;
    
    return Math.round(cacheScore + responseScore + slowRequestScore);
  };

  const performanceScore = getPerformanceScore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Performance Optimization</h2>
          <p className="text-muted-foreground">
            Monitor and optimize application performance with caching and CDN integration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleClearCache()}
            disabled={clearCacheMutation.isPending}
          >
            <Database className="h-4 w-4 mr-2" />
            Clear All Cache
          </Button>
        </div>
      </div>

      {/* Performance Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold">{performanceScore}/100</div>
            <Badge 
              variant={performanceScore > 80 ? 'default' : performanceScore > 60 ? 'secondary' : 'destructive'}
            >
              {performanceScore > 80 ? 'Excellent' : performanceScore > 60 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
          <Progress value={performanceScore} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Based on cache hit rate, response time, and request performance
          </p>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="cdn">CDN</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Requests"
              value={metrics?.performance.requests || 0}
              icon={<Activity className="h-4 w-4" />}
              description="Total API requests served"
            />
            <MetricCard
              title="Cache Hit Rate"
              value={`${(metrics?.performance.cacheHitRate || 0).toFixed(1)}%`}
              icon={<Database className="h-4 w-4" />}
              description="Percentage of cached responses"
            />
            <MetricCard
              title="Avg Response Time"
              value={`${(metrics?.performance.averageResponseTime || 0).toFixed(0)}ms`}
              icon={<Clock className="h-4 w-4" />}
              description="Average API response time"
            />
            <MetricCard
              title="Slow Requests"
              value={`${(metrics?.performance.slowRequestRate || 0).toFixed(1)}%`}
              icon={<Zap className="h-4 w-4" />}
              description="Requests taking >1s"
            />
          </div>
        </TabsContent>

        <TabsContent value="cache" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cache Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Cache Entries:</span>
                    <span className="font-mono">{metrics?.cache.size || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Entries:</span>
                    <span className="font-mono">{metrics?.cache.maxSize || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cache Hits:</span>
                    <span className="font-mono">{metrics?.performance.cacheHits || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cache Misses:</span>
                    <span className="font-mono">{metrics?.performance.cacheMisses || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cache Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => handleClearCache('/api/jargon.*')}
                  className="w-full"
                >
                  Clear Legal Jargon Cache
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleClearCache('/api/attorneys.*')}
                  className="w-full"
                >
                  Clear Attorney Cache
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleClearCache('/api/analytics.*')}
                  className="w-full"
                >
                  Clear Analytics Cache
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Image Cache
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Cached Images:</span>
                    <span className="font-mono">{metrics?.images.entries || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cache Size:</span>
                    <span className="font-mono">{metrics?.images.sizeMB?.toFixed(2) || 0} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Size:</span>
                    <span className="font-mono">{metrics?.images.maxSizeMB || 0} MB</span>
                  </div>
                  <Progress 
                    value={(metrics?.images.sizeMB || 0) / (metrics?.images.maxSizeMB || 1) * 100} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>WebP Support:</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>AVIF Support:</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Responsive Images:</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Lazy Loading:</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cdn" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                CDN Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Global Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>North America:</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Europe:</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Asia Pacific:</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Optimization Features</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Auto Minify:</span>
                      <Badge variant="default">On</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Brotli Compression:</span>
                      <Badge variant="default">On</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>HTTP/2 Push:</span>
                      <Badge variant="default">On</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}

function MetricCard({ title, value, icon, description }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}