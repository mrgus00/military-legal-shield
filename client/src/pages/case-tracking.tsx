import Header from "@/components/header";
import Footer from "@/components/footer";
import PremiumGate from "@/components/premium-gate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Calendar, Clock, AlertTriangle, CheckCircle, Users, Crown } from "lucide-react";

export default function CaseTracking() {
  // For demo purposes, simulating free tier user
  const userTier = "free"; // In production, this would come from auth context

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-900 via-red-800 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-full">
              <FileText className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Case Tracking Dashboard
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Monitor your legal cases, track deadlines, and stay organized with our comprehensive case management system.
          </p>
        </div>
      </section>

      {/* Case Tracking Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PremiumGate
            feature="Case Tracking Dashboard"
            description="Track your legal cases, monitor deadlines, communicate with attorneys, and access case documents all in one place."
            userTier={userTier}
          >
            <div className="space-y-8">
              {/* Active Cases Overview */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">2 court-martial, 1 administrative</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">Next deadline in 3 days</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Attorney Messages</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-xs text-muted-foreground">Unread messages</p>
                  </CardContent>
                </Card>
              </div>

              {/* Case List */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Your Cases</h2>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Court-Martial Defense</CardTitle>
                          <CardDescription>Article 86 - Absence without leave</CardDescription>
                        </div>
                        <Badge variant="destructive">Urgent</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Case Progress</span>
                            <span>65%</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="h-4 w-4" />
                              <span>Attorney: Sarah Mitchell</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-red-600">
                              <AlertTriangle className="h-4 w-4" />
                              <span>Next deadline: Jan 15, 2025</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">View Details</Button>
                          <Button size="sm" variant="outline">Documents</Button>
                          <Button size="sm" variant="outline">Message Attorney</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Administrative Separation</CardTitle>
                          <CardDescription>Pattern of misconduct review</CardDescription>
                        </div>
                        <Badge variant="secondary">In Progress</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Case Progress</span>
                            <span>30%</span>
                          </div>
                          <Progress value={30} className="h-2" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="h-4 w-4" />
                              <span>Attorney: Michael Rodriguez</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-blue-600">
                              <Clock className="h-4 w-4" />
                              <span>Next deadline: Jan 28, 2025</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">View Details</Button>
                          <Button size="sm" variant="outline">Documents</Button>
                          <Button size="sm" variant="outline">Message Attorney</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Article 15 Defense</CardTitle>
                          <CardDescription>Nonjudicial punishment proceedings</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Case Progress</span>
                            <span>100%</span>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="h-4 w-4" />
                              <span>Attorney: Jennifer Davis</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span>Completed: Dec 20, 2024</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View Summary</Button>
                          <Button size="sm" variant="outline">Download Documents</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </PremiumGate>
        </div>
      </section>

      <Footer />
    </div>
  );
}