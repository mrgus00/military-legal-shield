import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Shield, Users, FileText, MessageSquare, Calendar, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();
  const { isPremium, isLoading: subscriptionLoading } = useSubscription();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upgrade to Premium.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1500);
      return;
    }

    if (isPremium) {
      toast({
        title: "Already Premium",
        description: "You already have an active Premium subscription.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/create-subscription");
      const data = await response.json();
      
      if (response.ok && data.url) {
        toast({
          title: "Redirecting to Checkout",
          description: "Taking you to secure payment processing...",
        });
        setTimeout(() => {
          window.location.href = data.url;
        }, 1000);
      } else {
        throw new Error(data.message || "Failed to create subscription session");
      }
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast({
        title: "Upgrade Failed",
        description: error.message || "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Crown className="w-4 h-4 mr-2" />
            Choose Your Plan
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Legal Protection for Every Mission
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            From basic guidance to comprehensive legal support, choose the plan that fits your needs as a service member.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="relative border-2 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Free Access</CardTitle>
                <Badge variant="secondary">
                  <Shield className="w-4 h-4 mr-1" />
                  Basic
                </Badge>
              </div>
              <CardDescription>Essential legal resources for service members</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-slate-600 dark:text-slate-400">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Basic legal Q&A forum access</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Attorney directory search</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Legal resource library</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Basic document templates</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Educational content access</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                disabled={isAuthenticated}
              >
                {isAuthenticated ? "Current Plan" : "Get Started Free"}
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-2 border-blue-500 shadow-lg">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-500 text-white px-4 py-1">
                <Crown className="w-4 h-4 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Premium Shield</CardTitle>
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <Crown className="w-4 h-4 mr-1" />
                  Pro
                </Badge>
              </div>
              <CardDescription>Complete legal protection and priority support</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">$29.99</span>
                <span className="text-slate-600 dark:text-slate-400">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-4">
                Everything in Free, plus:
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="font-medium">Attorney consultations</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Direct messaging with attorneys</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Document review services</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Case tracking and management</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Priority emergency support</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Advanced document generation</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>24/7 legal hotline access</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={handleUpgrade}
                disabled={isLoading || isPremium}
              >
                {isPremium ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Active Plan
                  </>
                ) : isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Feature Comparison */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            Compare Features
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Attorney Network</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Access to verified military defense attorneys across all branches and specialties.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Document Services</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Professional document review, generation, and legal form assistance.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Round-the-clock emergency legal support when you need it most.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel my subscription anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Yes, you can cancel your Premium subscription at any time. You'll continue to have access to Premium features until the end of your billing period.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Are the attorneys verified military specialists?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  All attorneys in our network are verified military defense specialists with experience in military law, court-martial defense, and service member rights.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's included in the 24/7 support?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Premium members have access to emergency legal consultation, immediate attorney referrals, and urgent case escalation services available around the clock.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}