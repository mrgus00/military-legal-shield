import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Database, 
  Clock, 
  TrendingUp, 
  Settings,
  RefreshCw,
  Zap,
  Image,
  Globe,
  Trash2,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Monitor
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
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
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: metrics, isLoading, refetch } = useQuery<PerformanceMetrics>({
    queryKey: ['/api/performance/metrics'],
    refetchInterval: 30000,
    retry: false,
  });

  const clearCacheMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/performance/clear-cache'),
    onSuccess: () => {
      toast({
        title: 'Cache Cleared',
        description: 'All cached data has been cleared successfully.',
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ['/api/performance/metrics'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to clear cache: ' + error.message,
        variant: 'destructive',
      });
    },
  });

  const preloadImagesMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/performance/preload-images'),
    onSuccess: () => {
      toast({
        title: 'Images Preloaded',
        description: 'Critical images have been preloaded into the cache.',
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to preload images: ' + error.message,
        variant: 'destructive',
      });
    },
  });

  const getPerformanceScore = () => {
    if (!metrics) return 0;
    const { performance } = metrics;
    
    const cacheScore = performance.cacheHitRate * 0.4;
    const responseScore = Math.max(0, (1000 - performance.averageResponseTime) / 1000) * 40;
    const slowRequestScore = Math.max(0, (100 - performance.slowRequestRate) / 100) * 20;
    
    return Math.round(cacheScore + responseScore + slowRequestScore);
  };

  const performanceScore = getPerformanceScore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Performance Data Unavailable</h3>
          <p className="text-muted-foreground mb-4">
            Unable to load performance metrics. The optimization system may not be running.
          </p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-4 lg:px-6">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Performance Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Monitor and optimize system performance in real-time
          </p>
        </div>
        <div className="flex items-center justify-between sm:justify-end space-x-2">
          <Badge 
            variant={performanceScore >= 80 ? "default" : performanceScore >= 60 ? "secondary" : "destructive"}
            className={`text-xs sm:text-sm px-2 sm:px-3 py-1 ${
              performanceScore >= 80 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : performanceScore >= 60 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Score: {performanceScore}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-2 sm:px-3"
          >
            <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Performance Score Card - Mobile Optimized */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-gray-900 dark:text-white">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mb-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{performanceScore}</div>
              <div className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl">/100</div>
            </div>
            <Badge 
              variant={performanceScore > 80 ? 'default' : performanceScore > 60 ? 'secondary' : 'destructive'}
              className={`text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2 font-medium ${
                performanceScore > 80 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : performanceScore > 60 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {performanceScore > 80 ? 'Excellent' : performanceScore > 60 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
          <Progress value={performanceScore} className="h-2 sm:h-3 mb-4 bg-gray-200 dark:bg-gray-700" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
            <div className="flex justify-between p-2 sm:p-0 bg-gray-50 dark:bg-gray-800 sm:bg-transparent sm:dark:bg-transparent rounded">
              <span className="text-gray-600 dark:text-gray-400">Cache Hit Rate</span>
              <span className="font-medium text-gray-900 dark:text-white">{metrics.performance.cacheHitRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between p-2 sm:p-0 bg-gray-50 dark:bg-gray-800 sm:bg-transparent sm:dark:bg-transparent rounded">
              <span className="text-gray-600 dark:text-gray-400">Avg Response Time</span>
              <span className="font-medium text-gray-900 dark:text-white">{metrics.performance.averageResponseTime.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between p-2 sm:p-0 bg-gray-50 dark:bg-gray-800 sm:bg-transparent sm:dark:bg-transparent rounded">
              <span className="text-gray-600 dark:text-gray-400">Slow Request Rate</span>
              <span className="font-medium text-gray-900 dark:text-white">{metrics.performance.slowRequestRate.toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs - Mobile Optimized */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-10 gap-1 p-1 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger 
            value="overview" 
            className="text-xs sm:text-sm py-2 sm:py-1.5 px-2 sm:px-3 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="cache" 
            className="text-xs sm:text-sm py-2 sm:py-1.5 px-2 sm:px-3 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            Cache
          </TabsTrigger>
          <TabsTrigger 
            value="images" 
            className="text-xs sm:text-sm py-2 sm:py-1.5 px-2 sm:px-3 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            Images
          </TabsTrigger>
          <TabsTrigger 
            value="actions" 
            className="text-xs sm:text-sm py-2 sm:py-1.5 px-2 sm:px-3 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            Actions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <BarChart3 className="h-8 w-8 mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{metrics.performance.requests}</div>
                <div className="text-sm text-muted-foreground">Total Requests</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <CheckCircle className="h-8 w-8 mb-2 text-green-500" />
                <div className="text-2xl font-bold">{metrics.performance.cacheHits}</div>
                <div className="text-sm text-muted-foreground">Cache Hits</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <Clock className="h-8 w-8 mb-2 text-orange-500" />
                <div className="text-2xl font-bold">{metrics.performance.averageResponseTime.toFixed(0)}ms</div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <Zap className="h-8 w-8 mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{metrics.performance.slowRequests}</div>
                <div className="text-sm text-muted-foreground">Slow Requests</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cache Efficiency</span>
                    <span>{metrics.performance.cacheHitRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.performance.cacheHitRate} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Speed (Lower is Better)</span>
                    <span>{metrics.performance.averageResponseTime.toFixed(0)}ms</span>
                  </div>
                  <Progress value={Math.min(100, (metrics.performance.averageResponseTime / 10))} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cache" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Cache Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cache Usage</span>
                    <span>{metrics.cache.size} / {metrics.cache.maxSize} entries</span>
                  </div>
                  <Progress value={(metrics.cache.size / metrics.cache.maxSize) * 100} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{metrics.performance.cacheHits}</div>
                    <div className="text-sm text-muted-foreground">Cache Hits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{metrics.performance.cacheMisses}</div>
                    <div className="text-sm text-muted-foreground">Cache Misses</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cache Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{metrics.cache.hitRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Hit Rate</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Performance Impact</div>
                    <div className="text-xs text-muted-foreground">
                      Cache hits reduce response time by ~95% compared to database queries
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Image Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.images.entries}</div>
                  <div className="text-sm text-muted-foreground">Cached Images</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.images.sizeMB.toFixed(1)}MB</div>
                  <div className="text-sm text-muted-foreground">Cache Size</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.images.maxSizeMB}MB</div>
                  <div className="text-sm text-muted-foreground">Max Size</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Storage Usage</span>
                  <span>{metrics.images.sizeMB.toFixed(1)} / {metrics.images.maxSizeMB} MB</span>
                </div>
                <Progress value={(metrics.images.sizeMB / metrics.images.maxSizeMB) * 100} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cache Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => clearCacheMutation.mutate()}
                  disabled={clearCacheMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {clearCacheMutation.isPending ? 'Clearing...' : 'Clear All Cache'}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Clear all cached data to free up memory and force fresh data loading.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Image Optimization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full"
                  onClick={() => preloadImagesMutation.mutate()}
                  disabled={preloadImagesMutation.isPending}
                >
                  <Image className="h-4 w-4 mr-2" />
                  {preloadImagesMutation.isPending ? 'Preloading...' : 'Preload Critical Images'}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Preload important images into the cache for faster page loading.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{new Date(metrics.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cache Strategy</span>
                  <span>Multi-layer with ETag support</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Image Formats</span>
                  <span>WebP, AVIF, responsive sizing</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CDN Status</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PerformanceOptimization;