import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Database, 
  Clock, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp,
  Zap
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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

interface PerformanceWidgetProps {
  compact?: boolean;
  showTitle?: boolean;
  autoRefresh?: boolean;
  className?: string;
}

export function PerformanceWidget({ 
  compact = false, 
  showTitle = true, 
  autoRefresh = true,
  className = '' 
}: PerformanceWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: metrics, isLoading } = useQuery<PerformanceMetrics>({
    queryKey: ['/api/performance/metrics'],
    refetchInterval: autoRefresh ? 30000 : false,
    retry: false,
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
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
            <span className="text-sm text-muted-foreground">Loading performance data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return null;
  }

  if (compact) {
    return (
      <Card className={className}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Performance</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={performanceScore > 80 ? 'default' : performanceScore > 60 ? 'secondary' : 'destructive'}
                className="text-xs"
              >
                {performanceScore}/100
              </Badge>
              <div className="text-xs text-muted-foreground">
                {metrics.performance.cacheHitRate.toFixed(0)}% cache
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {showTitle && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Monitor
            </div>
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="space-y-4">
        {/* Performance Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{performanceScore}</span>
            <span className="text-muted-foreground">/100</span>
          </div>
          <Badge 
            variant={performanceScore > 80 ? 'default' : performanceScore > 60 ? 'secondary' : 'destructive'}
          >
            {performanceScore > 80 ? 'Excellent' : performanceScore > 60 ? 'Good' : 'Poor'}
          </Badge>
        </div>
        
        <Progress value={performanceScore} className="h-2" />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Cache Hit Rate</span>
            <span className="font-medium">{metrics.performance.cacheHitRate.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Avg Response</span>
            <span className="font-medium">{metrics.performance.averageResponseTime.toFixed(0)}ms</span>
          </div>
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-4">
            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                <Database className="h-5 w-5 mb-2 text-blue-500" />
                <div className="text-xs text-muted-foreground">Cache Entries</div>
                <div className="text-lg font-semibold">{metrics.cache.size}</div>
              </div>
              
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 mb-2 text-green-500" />
                <div className="text-xs text-muted-foreground">Total Requests</div>
                <div className="text-lg font-semibold">{metrics.performance.requests}</div>
              </div>
              
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                <Zap className="h-5 w-5 mb-2 text-orange-500" />
                <div className="text-xs text-muted-foreground">Slow Requests</div>
                <div className="text-lg font-semibold">{metrics.performance.slowRequestRate.toFixed(1)}%</div>
              </div>
            </div>

            {/* Cache Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cache Usage</span>
                <span className="font-medium">
                  {metrics.cache.size} / {metrics.cache.maxSize} entries
                </span>
              </div>
              <Progress 
                value={(metrics.cache.size / metrics.cache.maxSize) * 100} 
                className="h-1" 
              />
            </div>

            {/* Image Cache */}
            {metrics.images.entries > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Image Cache</span>
                  <span className="font-medium">
                    {metrics.images.sizeMB.toFixed(1)} / {metrics.images.maxSizeMB} MB
                  </span>
                </div>
                <Progress 
                  value={(metrics.images.sizeMB / metrics.images.maxSizeMB) * 100} 
                  className="h-1" 
                />
              </div>
            )}

            {/* Last Updated */}
            <div className="text-xs text-muted-foreground text-center">
              Last updated: {new Date(metrics.timestamp).toLocaleTimeString()}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

// Mini performance indicator for header/sidebar
export function PerformanceIndicator() {
  const { data: metrics } = useQuery<PerformanceMetrics>({
    queryKey: ['/api/performance/metrics'],
    refetchInterval: 60000, // Refresh every minute
    retry: false,
  });

  if (!metrics) return null;

  const score = Math.round(
    (metrics.performance.cacheHitRate * 0.4) +
    (Math.max(0, (1000 - metrics.performance.averageResponseTime) / 1000) * 40) +
    (Math.max(0, (100 - metrics.performance.slowRequestRate) / 100) * 20)
  );

  return (
    <div className="flex items-center space-x-2 px-2 py-1 rounded-md bg-muted/50">
      <div 
        className={`w-2 h-2 rounded-full ${
          score > 80 ? 'bg-green-500' : score > 60 ? 'bg-yellow-500' : 'bg-red-500'
        }`}
      />
      <span className="text-xs font-medium">{score}</span>
    </div>
  );
}