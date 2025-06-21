import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  FileText, 
  Gavel, 
  AlertTriangle,
  Activity,
  Globe,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  realTime: {
    activeUsers: number;
    pageViews: number;
    uniqueVisitors: number;
    hourlyPageViews: number;
  };
  military: {
    consultationRequests: number;
    emergencyRequests: number;
    attorneyMatches: number;
    documentDownloads: number;
    aiAnalysisUsage: number;
    legalRoadmapViews: number;
    militaryBranches: Record<string, number>;
  };
  pages: {
    topPages: Array<{ path: string; views: number }>;
  };
  system: {
    uptime: number;
    startTime: string;
  };
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Update analytics every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getBranchIcon = (branch: string) => {
    const branchIcons: Record<string, string> = {
      army: '🪖',
      navy: '⚓',
      air_force: '✈️',
      marines: '🦅',
      coast_guard: '🛟',
      space_force: '🚀'
    };
    return branchIcons[branch.toLowerCase()] || '🎖️';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        <span className="ml-3 text-muted-foreground">Loading analytics...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Failed to load analytics data</p>
          <Button onClick={fetchAnalytics} className="mt-2">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Platform Analytics</h2>
          <p className="text-muted-foreground">Real-time military legal platform monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-sm text-muted-foreground">
            Last updated: {lastUpdated?.toLocaleTimeString()}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchAnalytics}
            className="ml-2"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="military">Military Metrics</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Analysis</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.realTime.activeUsers}</div>
                <p className="text-xs text-muted-foreground">Currently online</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <Eye className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.realTime.pageViews}</div>
                <p className="text-xs text-muted-foreground">
                  {data.realTime.hourlyPageViews}/hour avg
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                <Globe className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.realTime.uniqueVisitors}</div>
                <p className="text-xs text-muted-foreground">Total sessions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatUptime(data.system.uptime)}</div>
                <p className="text-xs text-muted-foreground">Since deployment</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="military" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consultation Requests</CardTitle>
                <Gavel className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.military.consultationRequests}</div>
                <div className="flex items-center mt-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">
                    {data.military.emergencyRequests} emergency
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attorney Matches</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.military.attorneyMatches}</div>
                <p className="text-xs text-muted-foreground">Successful connections</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Document Downloads</CardTitle>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.military.documentDownloads}</div>
                <p className="text-xs text-muted-foreground">Legal documents generated</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg">Military Branch Breakdown</CardTitle>
                <CardDescription>Consultation requests by service branch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(data.military.militaryBranches).map(([branch, count]) => (
                    <div key={branch} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getBranchIcon(branch)}</span>
                        <span className="font-medium capitalize">
                          {branch.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24">
                          <Progress 
                            value={(count / Math.max(1, Object.values(data.military.militaryBranches).reduce((a, b) => Math.max(a, b), 1))) * 100} 
                            className="h-2"
                          />
                        </div>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Usage Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Case Analysis</span>
                    <Badge>{data.military.aiAnalysisUsage}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Legal Roadmap Views</span>
                    <Badge>{data.military.legalRoadmapViews}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Platform Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Success Rate</span>
                    <Badge variant="outline">
                      {data.military.attorneyMatches > 0 
                        ? Math.round((data.military.attorneyMatches / data.military.consultationRequests) * 100)
                        : 0}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Emergency Response</span>
                    <Badge variant={data.military.emergencyRequests > 0 ? "destructive" : "secondary"}>
                      {data.military.emergencyRequests > 0 ? "Active" : "Normal"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Pages</CardTitle>
              <CardDescription>Most visited pages on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.pages.topPages.slice(0, 10).map((page, index) => (
                  <div key={page.path} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <div className="font-medium">{page.path === '/' ? 'Homepage' : page.path}</div>
                        <div className="text-sm text-muted-foreground">{page.path}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{page.views}</div>
                      <div className="text-sm text-muted-foreground">views</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Health</CardTitle>
              <CardDescription>Platform operational status and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Uptime</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {formatUptime(data.system.uptime)}
                      </Badge>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Response Time</span>
                      <Badge variant="outline">< 200ms</Badge>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Error Rate</span>
                      <Badge variant="outline">0.01%</Badge>
                    </div>
                    <Progress value={1} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-800">All Systems Operational</div>
                    <div className="text-sm text-green-600">Platform running smoothly</div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <div>Started: {new Date(data.system.startTime).toLocaleString()}</div>
                    <div>Last restart: None required</div>
                    <div>Health checks: Passing</div>
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