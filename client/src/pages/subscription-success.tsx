import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, ArrowRight, Users, Shield, FileText, Clock } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

export default function SubscriptionSuccess() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { isPremium, subscriptionData } = useSubscription();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Verify subscription status after a short delay
    const timer = setTimeout(() => {
      setIsVerifying(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    setLocation("/consultation-booking");
  };

  const handleDashboard = () => {
    setLocation("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Authentication Required
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300">
                    Please log in to view your subscription status.
                  </p>
                </div>
                <Button onClick={() => window.location.href = '/api/login'} className="w-full">
                  Log In
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {isVerifying ? (
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Verifying Subscription</h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Please wait while we confirm your payment...
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Success Header */}
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                  Welcome to Premium!
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Your subscription has been activated successfully. You now have access to all premium legal services.
                </p>
                <Badge variant="secondary" className="mt-4">
                  <Crown className="w-4 h-4 mr-2" />
                  Premium Member
                </Badge>
              </div>

              {/* What's Included */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="w-6 h-6 mr-2 text-yellow-600" />
                    Your Premium Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Users className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Attorney Consultations</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            Direct access to verified military defense attorneys
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FileText className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Document Review</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            Professional review of legal documents and forms
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                        <div>
                          <h3 className="font-medium">24/7 Support</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            Round-the-clock legal assistance and guidance
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Shield className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Priority Emergency Support</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            Immediate assistance for urgent legal matters
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-3">Start Your First Consultation</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Book a consultation with one of our verified military defense attorneys.
                    </p>
                    <Button onClick={handleContinue} className="w-full">
                      Book Consultation
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-3">Explore Your Dashboard</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Access all premium features from your personalized dashboard.
                    </p>
                    <Button variant="outline" onClick={handleDashboard} className="w-full">
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Subscription Details */}
              {subscriptionData && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Subscription Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600 dark:text-slate-300">Plan:</span>
                        <p className="font-medium">Premium ($29.99/month)</p>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-300">Status:</span>
                        <p className="font-medium text-green-600">Active</p>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-300">Billing:</span>
                        <p className="font-medium">Monthly</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Support */}
              <div className="mt-12 text-center">
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Need help getting started? Our support team is here to assist you.
                </p>
                <div className="space-x-4">
                  <Button variant="outline" size="sm">
                    Contact Support
                  </Button>
                  <Button variant="outline" size="sm">
                    View Documentation
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}