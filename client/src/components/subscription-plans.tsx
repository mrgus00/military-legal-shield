import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Shield, AlertTriangle, Clock, FileText, Users, Phone } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  tier: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
  cta: string;
  description: string;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Basic Defense",
    tier: "free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Essential legal support for all military personnel",
    cta: "Get Started Free",
    features: [
      "Attorney search by location & specialty",
      "Basic contact information access",
      "Essential UCMJ resources & guides",
      "Know Your Rights education modules",
      "Emergency hotline directory",
      "Read-only community forum access",
      "Basic legal resource library"
    ]
  },
  {
    id: "premium",
    name: "Premium Defense",
    tier: "premium",
    monthlyPrice: 2999,
    yearlyPrice: 29999,
    description: "Complete legal defense platform with priority support",
    popular: true,
    cta: "Upgrade to Premium",
    features: [
      "Everything in Basic Defense",
      "Advanced attorney matching with budget filters",
      "Emergency attorney availability indicators",
      "24-48 hour guaranteed attorney response",
      "Case tracking dashboard & deadlines",
      "Legal document templates (POA, Wills)",
      "Priority customer support",
      "Premium education content & case studies",
      "Community forum participation",
      "Verified attorney Q&A responses",
      "Secure document cloud storage",
      "Mobile app access"
    ]
  }
];

const emergencyServices = [
  {
    name: "Immediate Attorney Connection",
    price: 9900,
    description: "Connect with available attorney within 2-4 hours for urgent situations",
    icon: AlertTriangle
  },
  {
    name: "Emergency Legal Consultation",
    price: 9900,
    description: "30-minute phone consultation included with emergency connection",
    icon: Phone
  }
];

export default function SubscriptionPlans() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  const getPrice = (plan: Plan) => {
    return billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan: Plan) => {
    if (billingCycle === "yearly" && plan.monthlyPrice > 0) {
      const yearlyTotal = plan.monthlyPrice * 12;
      const savings = yearlyTotal - plan.yearlyPrice;
      return Math.round((savings / yearlyTotal) * 100);
    }
    return 0;
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Defense Plan
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Professional legal support designed for military personnel. From basic resources to premium attorney matching.
        </p>
        
        {/* Billing Toggle */}
        <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === "yearly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Yearly
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
              Save 17%
            </Badge>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${
              plan.popular 
                ? "border-2 border-red-600 shadow-lg" 
                : "border border-gray-200"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-red-600 text-white px-3 py-1">
                  <Crown className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-full ${
                  plan.tier === "free" ? "bg-blue-100" : "bg-red-100"
                }`}>
                  {plan.tier === "free" ? (
                    <Shield className="h-8 w-8 text-blue-600" />
                  ) : (
                    <Crown className="h-8 w-8 text-red-600" />
                  )}
                </div>
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-base">
                {plan.description}
              </CardDescription>
              
              <div className="mt-4">
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    ${formatPrice(getPrice(plan))}
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className="text-gray-600 ml-2">
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </span>
                  )}
                </div>
                {getSavings(plan) > 0 && (
                  <div className="text-sm text-green-600 mt-1">
                    Save {getSavings(plan)}% with yearly billing
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <Button 
                className={`w-full mb-6 ${
                  plan.tier === "premium" 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {plan.cta}
              </Button>
              
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Emergency Services */}
      <div className="border-t pt-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Emergency Legal Services
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            One-time emergency services for urgent legal situations requiring immediate attention
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {emergencyServices.map((service, index) => (
            <Card key={index} className="border-l-4 border-l-red-600">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <service.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <div className="text-2xl font-bold text-red-600">
                      ${formatPrice(service.price)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {service.description}
                </CardDescription>
                <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50">
                  Request Emergency Service
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="border-t pt-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Feature Comparison
          </h3>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-semibold text-gray-900">Feature</div>
            <div className="font-semibold text-center text-gray-900">Basic Defense</div>
            <div className="font-semibold text-center text-gray-900">Premium Defense</div>
            
            <div className="py-3 border-t text-gray-700">Attorney Search</div>
            <div className="py-3 border-t text-center">Basic</div>
            <div className="py-3 border-t text-center">Advanced + Filters</div>
            
            <div className="py-3 border-t text-gray-700">Response Time</div>
            <div className="py-3 border-t text-center">Standard</div>
            <div className="py-3 border-t text-center">24-48 hours guaranteed</div>
            
            <div className="py-3 border-t text-gray-700">Case Tracking</div>
            <div className="py-3 border-t text-center">-</div>
            <div className="py-3 border-t text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></div>
            
            <div className="py-3 border-t text-gray-700">Document Templates</div>
            <div className="py-3 border-t text-center">-</div>
            <div className="py-3 border-t text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></div>
            
            <div className="py-3 border-t text-gray-700">Forum Participation</div>
            <div className="py-3 border-t text-center">Read-only</div>
            <div className="py-3 border-t text-center">Full Access</div>
            
            <div className="py-3 border-t text-gray-700">Priority Support</div>
            <div className="py-3 border-t text-center">-</div>
            <div className="py-3 border-t text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}