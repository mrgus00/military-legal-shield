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

// Competitive analysis shows:
// - LegalZoom: $79-149/month for business plans
// - Rocket Lawyer: $39.99/month for premium
// - Nolo: $19.99/month for legal forms
// - JustAnswer Legal: $66/month for unlimited consultations
// - Military-specific services typically charge $50-150/month
// Our pricing is positioned competitively in the mid-range

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
      "Attorney directory search (location & specialty)",
      "Basic attorney contact information",
      "Essential UCMJ resources & guides",
      "Know Your Rights education modules",
      "Emergency hotline directory",
      "Read-only community forum access",
      "Basic legal resource library",
      "Up to 3 attorney contacts per month"
    ]
  },
  {
    id: "premium",
    name: "Premium Defense",
    tier: "premium",
    monthlyPrice: 4999, // Increased to $49.99 based on market research
    yearlyPrice: 49999, // $499/year (17% savings)
    description: "Complete legal defense platform with guaranteed response times",
    popular: true,
    cta: "Upgrade to Premium",
    features: [
      "Everything in Basic Defense",
      "Unlimited attorney contacts & communications",
      "Advanced filtering (budget, response time, experience)",
      "Guaranteed 24-hour attorney response",
      "Emergency attorney availability indicators",
      "Case tracking dashboard with deadline alerts",
      "Legal document templates & generation",
      "Priority customer support (phone & chat)",
      "Premium education content & case studies",
      "Full community forum participation",
      "Direct attorney messaging platform",
      "Secure document cloud storage (5GB)",
      "Mobile app with push notifications",
      "Consultation scheduling system"
    ]
  },
  {
    id: "professional",
    name: "Professional Defense",
    tier: "professional",
    monthlyPrice: 9999, // $99.99/month
    yearlyPrice: 99999, // $999/year (17% savings)
    description: "Enterprise-grade legal support for organizations and serious cases",
    cta: "Contact Sales",
    features: [
      "Everything in Premium Defense",
      "Unlimited case tracking and management",
      "Dedicated account manager",
      "Priority attorney matching (2-hour response)",
      "Advanced analytics and reporting",
      "Team collaboration tools",
      "Custom legal document templates",
      "White-glove onboarding",
      "24/7 priority support hotline",
      "Legal strategy consultations",
      "Bulk attorney services discounts",
      "Enhanced document storage (50GB)",
      "Custom integrations available",
      "Quarterly legal health assessments"
    ]
  }
];

// Emergency services pricing aligned with legal consultation market rates
// - LegalZoom emergency services: $149-199
// - JustAnswer urgent responses: $74-120
// - Traditional attorney emergency consultations: $200-400
const emergencyServices = [
  {
    name: "Emergency Attorney Connection",
    price: 14900, // $149 - competitive with LegalZoom
    description: "Connect with qualified military attorney within 2 hours for urgent legal situations",
    icon: AlertTriangle
  },
  {
    name: "Crisis Legal Consultation",
    price: 19900, // $199 - includes consultation
    description: "Immediate connection plus 60-minute consultation for critical legal emergencies",
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
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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

      {/* Competitive Analysis */}
      <div className="border-t pt-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            How We Compare to Competitors
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our pricing is competitively positioned to provide maximum value for military legal services
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Service</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Monthly Price</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Military Focus</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Emergency Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-red-50">
                  <td className="px-6 py-4 font-semibold text-red-800">Soldier on Fire (Premium)</td>
                  <td className="px-6 py-4 text-center font-bold text-red-800">$49.99</td>
                  <td className="px-6 py-4 text-center"><span className="text-green-600 font-semibold">✓ Specialized</span></td>
                  <td className="px-6 py-4 text-center"><span className="text-green-600 font-semibold">✓ 24-hour guarantee</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4">LegalZoom Premium</td>
                  <td className="px-6 py-4 text-center">$79-$149</td>
                  <td className="px-6 py-4 text-center"><span className="text-gray-400">General legal</span></td>
                  <td className="px-6 py-4 text-center"><span className="text-gray-400">Limited</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Rocket Lawyer Premium</td>
                  <td className="px-6 py-4 text-center">$39.99</td>
                  <td className="px-6 py-4 text-center"><span className="text-gray-400">General legal</span></td>
                  <td className="px-6 py-4 text-center"><span className="text-gray-400">No guarantee</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4">JustAnswer Legal</td>
                  <td className="px-6 py-4 text-center">$66</td>
                  <td className="px-6 py-4 text-center"><span className="text-gray-400">General legal</span></td>
                  <td className="px-6 py-4 text-center"><span className="text-yellow-600">Q&A only</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Traditional Military Attorney</td>
                  <td className="px-6 py-4 text-center">$200-$400/hour</td>
                  <td className="px-6 py-4 text-center"><span className="text-green-600">✓ Specialized</span></td>
                  <td className="px-6 py-4 text-center"><span className="text-gray-400">Varies</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="border-t pt-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Feature Comparison
          </h3>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="font-semibold text-gray-900">Feature</div>
            <div className="font-semibold text-center text-gray-900">Basic Defense</div>
            <div className="font-semibold text-center text-gray-900">Premium Defense</div>
            <div className="font-semibold text-center text-gray-900">Professional Defense</div>
            
            <div className="py-3 border-t text-gray-700">Attorney Contacts</div>
            <div className="py-3 border-t text-center">3/month</div>
            <div className="py-3 border-t text-center">Unlimited</div>
            <div className="py-3 border-t text-center">Unlimited + Priority</div>
            
            <div className="py-3 border-t text-gray-700">Response Time</div>
            <div className="py-3 border-t text-center">Standard</div>
            <div className="py-3 border-t text-center">24-hour guarantee</div>
            <div className="py-3 border-t text-center">2-hour guarantee</div>
            
            <div className="py-3 border-t text-gray-700">Case Tracking</div>
            <div className="py-3 border-t text-center">-</div>
            <div className="py-3 border-t text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></div>
            <div className="py-3 border-t text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></div>
            
            <div className="py-3 border-t text-gray-700">Document Templates</div>
            <div className="py-3 border-t text-center">-</div>
            <div className="py-3 border-t text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></div>
            <div className="py-3 border-t text-center">Custom Templates</div>
            
            <div className="py-3 border-t text-gray-700">Account Manager</div>
            <div className="py-3 border-t text-center">-</div>
            <div className="py-3 border-t text-center">-</div>
            <div className="py-3 border-t text-center"><Check className="h-4 w-4 text-green-500 mx-auto" /></div>
            
            <div className="py-3 border-t text-gray-700">Document Storage</div>
            <div className="py-3 border-t text-center">-</div>
            <div className="py-3 border-t text-center">5GB</div>
            <div className="py-3 border-t text-center">50GB</div>
          </div>
        </div>
      </div>
    </div>
  );
}