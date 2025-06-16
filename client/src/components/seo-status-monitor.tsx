import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Search,
  ExternalLink,
  RefreshCw,
  Globe
} from 'lucide-react';

interface SEOMetrics {
  indexingStatus: {
    indexed: number;
    pending: number;
    errors: number;
  };
  searchVisibility: {
    impressions: number;
    clicks: number;
    avgPosition: number;
  };
  technicalSEO: {
    sitemapStatus: 'success' | 'pending' | 'error';
    robotsStatus: 'accessible' | 'blocked';
    verificationStatus: 'verified' | 'pending';
  };
}

export function SEOStatusMonitor() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { data: seoMetrics, isLoading, refetch } = useQuery<SEOMetrics>({
    queryKey: ['/api/seo/status'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000 // 10 minutes
  });

  const handleRefresh = () => {
    refetch();
    setLastUpdate(new Date());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'verified':
      case 'accessible':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
      case 'blocked':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const indexingProgress = seoMetrics?.indexingStatus 
    ? Math.round((seoMetrics.indexingStatus.indexed / (seoMetrics.indexingStatus.indexed + seoMetrics.indexingStatus.pending + seoMetrics.indexingStatus.errors)) * 100)
    : 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Loading SEO status...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* SEO Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              SEO Performance Dashboard
            </CardTitle>
            <CardDescription>
              Real-time monitoring of search engine optimization metrics
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
            <Button size="sm" variant="outline" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Indexing Status */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Page Indexing
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Progress</span>
                  <span className="text-sm font-medium">{indexingProgress}%</span>
                </div>
                <Progress value={indexingProgress} className="h-2" />
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-green-600">{seoMetrics?.indexingStatus?.indexed || 0}</div>
                    <div className="text-gray-500">Indexed</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-yellow-600">{seoMetrics?.indexingStatus?.pending || 0}</div>
                    <div className="text-gray-500">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-red-600">{seoMetrics?.indexingStatus?.errors || 0}</div>
                    <div className="text-gray-500">Errors</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Performance */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Search Performance
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Impressions</span>
                  <span className="font-medium">{seoMetrics?.searchVisibility?.impressions?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Clicks</span>
                  <span className="font-medium">{seoMetrics?.searchVisibility?.clicks?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Position</span>
                  <span className="font-medium">{seoMetrics?.searchVisibility?.avgPosition || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Technical Status */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Technical Status
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sitemap</span>
                  <Badge className={getStatusColor(seoMetrics?.technicalSEO?.sitemapStatus || 'pending')}>
                    {seoMetrics?.technicalSEO?.sitemapStatus || 'pending'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Robots.txt</span>
                  <Badge className={getStatusColor(seoMetrics?.technicalSEO?.robotsStatus || 'accessible')}>
                    {seoMetrics?.technicalSEO?.robotsStatus || 'accessible'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Verification</span>
                  <Badge className={getStatusColor(seoMetrics?.technicalSEO?.verificationStatus || 'verified')}>
                    {seoMetrics?.technicalSEO?.verificationStatus || 'verified'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Search className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold mb-1">Search Console</h3>
            <p className="text-xs text-gray-600 mb-3">Monitor indexing and performance</p>
            <Button size="sm" className="w-full" onClick={() => window.open('https://search.google.com/search-console/', '_blank')}>
              Open <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold mb-1">Analytics</h3>
            <p className="text-xs text-gray-600 mb-3">Track user behavior and conversions</p>
            <Button size="sm" className="w-full" onClick={() => window.open('https://analytics.google.com/', '_blank')}>
              Open <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Globe className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold mb-1">Sitemap</h3>
            <p className="text-xs text-gray-600 mb-3">View current sitemap structure</p>
            <Button size="sm" className="w-full" onClick={() => window.open('/sitemap.xml', '_blank')}>
              View <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <RefreshCw className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <h3 className="font-semibold mb-1">Status Check</h3>
            <p className="text-xs text-gray-600 mb-3">Run comprehensive SEO audit</p>
            <Button size="sm" className="w-full" onClick={handleRefresh}>
              Refresh <RefreshCw className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}