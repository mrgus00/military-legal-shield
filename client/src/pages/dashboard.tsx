import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  FileText, 
  Users, 
  Calendar, 
  Award, 
  TrendingUp,
  Bell,
  MessageSquare,
  BookOpen,
  MapPin,
  Grid3X3
} from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import WidgetDashboard from "@/components/WidgetDashboard";
import { PerformanceWidget } from "@/components/performance/PerformanceWidget";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: !!user,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Smart Widgets",
      description: "Access Google Calendar, Drive & AI insights",
      href: "/widgets",
      icon: Grid3X3,
      color: "bg-purple-500"
    },
    {
      title: "Find Attorney",
      description: "Connect with military legal experts",
      icon: Users,
      href: "/attorneys",
      color: "bg-blue-500"
    },
    {
      title: "Legal Documents",
      description: "Generate and manage legal forms",
      icon: FileText,
      href: "/documents",
      color: "bg-green-500"
    },
    {
      title: "Emergency Help",
      description: "24/7 urgent legal assistance",
      icon: Shield,
      href: "/emergency",
      color: "bg-red-500"
    },
    {
      title: "Learning Center",
      description: "Military law education resources",
      icon: BookOpen,
      href: "/learning",
      color: "bg-purple-500"
    }
  ];

  const recentActivities = [
    {
      type: "document",
      title: "Power of Attorney generated",
      timestamp: "2 hours ago",
      status: "completed"
    },
    {
      type: "consultation",
      title: "Attorney consultation scheduled",
      timestamp: "1 day ago",
      status: "upcoming"
    },
    {
      type: "learning",
      title: "UCMJ basics course completed",
      timestamp: "3 days ago",
      status: "completed"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">
            Welcome back, {user?.firstName || 'Service Member'}!
          </h1>
          <p className="text-gray-600">
            Your military legal support dashboard - access resources, attorneys, and assistance.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Documents Created</p>
                  <p className="text-2xl font-bold text-navy-900">7</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Consultations</p>
                  <p className="text-2xl font-bold text-navy-900">3</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Learning Progress</p>
                  <p className="text-2xl font-bold text-navy-900">85%</p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Cases</p>
                  <p className="text-2xl font-bold text-navy-900">1</p>
                </div>
                <Shield className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Access the most important features quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{action.title}</h3>
                          <p className="text-xs text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="widgets">Smart Widgets</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-xs text-gray-600">{activity.timestamp}</p>
                        </div>
                      </div>
                      <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Attorney Consultation</p>
                        <p className="text-xs text-gray-600">Tomorrow at 2:00 PM</p>
                      </div>
                      <Badge variant="outline">Virtual</Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Legal Workshop</p>
                        <p className="text-xs text-gray-600">Friday at 10:00 AM</p>
                      </div>
                      <Badge variant="outline">Base Legal</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Learning Progress
                </CardTitle>
                <CardDescription>
                  Continue your military legal education
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>UCMJ Fundamentals</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Administrative Separations</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Security Clearance Process</span>
                    <span>30%</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="widgets" className="space-y-6">
            <WidgetDashboard />
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Document Management</CardTitle>
                <CardDescription>
                  Create, manage, and track your legal documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/documents/power-of-attorney">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <h3 className="font-semibold">Power of Attorney</h3>
                        <p className="text-sm text-gray-600">Legal representation documents</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/documents/will">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <h3 className="font-semibold">Military Will</h3>
                        <p className="text-sm text-gray-600">Estate planning documents</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/documents/family-care">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                        <h3 className="font-semibold">Family Care Plan</h3>
                        <p className="text-sm text-gray-600">Dependent care arrangements</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning">
            <Card>
              <CardHeader>
                <CardTitle>Attorney Network</CardTitle>
                <CardDescription>
                  Connect with military legal experts near you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Find Nearby Attorneys</h3>
                        <p className="text-sm text-gray-600">Browse military legal experts in your area</p>
                      </div>
                    </div>
                    <Link href="/attorneys">
                      <Button>Browse</Button>
                    </Link>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Schedule Consultation</h3>
                        <p className="text-sm text-gray-600">Book appointments with legal experts</p>
                      </div>
                    </div>
                    <Link href="/consultation">
                      <Button>Schedule</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning">
            <Card>
              <CardHeader>
                <CardTitle>Learning Center</CardTitle>
                <CardDescription>
                  Expand your knowledge of military law and regulations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-2">UCMJ Fundamentals</h3>
                    <p className="text-sm text-gray-600 mb-3">Learn the basics of the Uniform Code of Military Justice</p>
                    <div className="flex items-center justify-between">
                      <Progress value={85} className="h-2 flex-1 mr-3" />
                      <span className="text-sm">85%</span>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Administrative Law</h3>
                    <p className="text-sm text-gray-600 mb-3">Understanding military administrative processes</p>
                    <div className="flex items-center justify-between">
                      <Progress value={60} className="h-2 flex-1 mr-3" />
                      <span className="text-sm">60%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}