import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  DollarSign, 
  GraduationCap, 
  Home, 
  Shield,
  FileText,
  Calculator,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Star
} from "lucide-react";
import { Link } from "wouter";

export default function VABenefitsClaims() {
  const benefitTypes = [
    {
      icon: Heart,
      title: "Disability Compensation",
      amount: "$171 - $3,737/month",
      description: "Monthly payments for service-connected disabilities",
      eligibility: "Service-connected injury or illness",
      color: "red"
    },
    {
      icon: GraduationCap,
      title: "Education Benefits",
      amount: "Up to $28,000/year",
      description: "GI Bill education and training benefits",
      eligibility: "90+ days active duty or reserves",
      color: "blue"
    },
    {
      icon: Home,
      title: "Home Loans",
      amount: "$0 down payment",
      description: "VA-guaranteed home loans with competitive rates",
      eligibility: "Qualifying military service",
      color: "green"
    },
    {
      icon: Shield,
      title: "Healthcare",
      amount: "Comprehensive coverage",
      description: "VA medical care and mental health services",
      eligibility: "Qualifying service and enrollment",
      color: "purple"
    }
  ];

  const disabilityRatings = [
    { rating: "10%", monthly: "$171", withSpouse: "$200", withChild: "$203" },
    { rating: "20%", monthly: "$338", withSpouse: "$387", withChild: "$423" },
    { rating: "30%", monthly: "$524", withSpouse: "$586", withChild: "$622" },
    { rating: "40%", monthly: "$755", withSpouse: "$838", withChild: "$897" },
    { rating: "50%", monthly: "$1,075", withSpouse: "$1,178", withChild: "$1,237" },
    { rating: "60%", monthly: "$1,361", withSpouse: "$1,484", withChild: "$1,543" },
    { rating: "70%", monthly: "$1,663", withSpouse: "$1,806", withChild: "$1,865" },
    { rating: "80%", monthly: "$1,933", withSpouse: "$2,096", withChild: "$2,155" },
    { rating: "90%", monthly: "$2,172", withSpouse: "$2,355", withChild: "$2,414" },
    { rating: "100%", monthly: "$3,737", withSpouse: "$3,939", withChild: "$3,998" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                <Star className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6">VA Benefits & Claims</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Maximize your earned benefits with expert guidance on VA disability claims, 
              education benefits, healthcare, and home loans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/benefits-eligibility">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Check Your Benefits
                </Button>
              </Link>
              <Link href="/consultation-booking?service=va-claims">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-navy-900">
                  Claims Assistance
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Your Earned Benefits</h2>
            <p className="text-xl text-gray-600">Comprehensive benefits available to veterans and service members</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefitTypes.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className={`border-l-4 border-l-${benefit.color}-500 hover:shadow-lg transition-shadow`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-${benefit.color}-100 rounded-full flex items-center justify-center`}>
                        <IconComponent className={`w-6 h-6 text-${benefit.color}-600`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{benefit.title}</CardTitle>
                        <Badge className={`bg-${benefit.color}-100 text-${benefit.color}-800 mt-1`}>
                          {benefit.amount}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-3">{benefit.description}</p>
                    <p className="text-xs text-gray-500 mb-4">
                      <strong>Eligibility:</strong> {benefit.eligibility}
                    </p>
                    <Link href={`/consultation-booking?service=${benefit.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <Button size="sm" className={`w-full bg-${benefit.color}-600 hover:bg-${benefit.color}-700`}>
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Disability Compensation Rates */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">2024 VA Disability Compensation Rates</h2>
            <p className="text-xl text-gray-600">Monthly compensation amounts based on disability rating</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-navy-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Disability Rating</th>
                    <th className="px-6 py-4 text-left">Veteran Only</th>
                    <th className="px-6 py-4 text-left">With Spouse</th>
                    <th className="px-6 py-4 text-left">With Spouse & Child</th>
                  </tr>
                </thead>
                <tbody>
                  {disabilityRatings.map((rate, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="px-6 py-4 font-semibold text-navy-900">{rate.rating}</td>
                      <td className="px-6 py-4 text-green-600 font-medium">{rate.monthly}</td>
                      <td className="px-6 py-4 text-green-600 font-medium">{rate.withSpouse}</td>
                      <td className="px-6 py-4 text-green-600 font-medium">{rate.withChild}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/benefits-eligibility">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Your Benefits
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Claims Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">VA Claims Process</h2>
            <p className="text-xl text-gray-600">Step-by-step guide to filing your VA disability claim</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { step: "1", title: "Prepare", desc: "Gather medical records and evidence", icon: FileText },
              { step: "2", title: "File", desc: "Submit your claim online or by mail", icon: CheckCircle },
              { step: "3", title: "Review", desc: "VA reviews your claim and evidence", icon: Clock },
              { step: "4", title: "Exam", desc: "Attend C&P exam if required", icon: Heart },
              { step: "5", title: "Decision", desc: "Receive VA rating decision", icon: Star }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="w-8 h-8 bg-navy-900 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Common Claims */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Common VA Disability Claims</h2>
            <p className="text-xl text-gray-600">Most frequently approved service-connected conditions</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { condition: "PTSD", rating: "30-100%", description: "Post-traumatic stress disorder from military service" },
              { condition: "Tinnitus", rating: "10%", description: "Ringing in ears from noise exposure" },
              { condition: "Back Injuries", rating: "10-100%", description: "Spinal conditions and chronic pain" },
              { condition: "Knee Problems", rating: "10-60%", description: "Joint damage and mobility issues" },
              { condition: "Sleep Apnea", rating: "30-100%", description: "Sleep disorders secondary to service" },
              { condition: "Hearing Loss", rating: "0-100%", description: "Noise-induced hearing damage" },
              { condition: "Shoulder Injuries", rating: "10-40%", description: "Joint and muscle damage" },
              { condition: "Depression", rating: "10-100%", description: "Mental health conditions" },
              { condition: "Migraines", rating: "0-50%", description: "Service-connected headaches" }
            ].map((claim, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-navy-900">{claim.condition}</h3>
                    <Badge className="bg-green-100 text-green-800">{claim.rating}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{claim.description}</p>
                  <Link href={`/consultation-booking?condition=${claim.condition.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Button size="sm" variant="outline" className="w-full">
                      Get Claims Help
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Education Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">GI Bill Education Benefits</h2>
            <p className="text-xl text-gray-600">Education and training opportunities for veterans and dependents</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  Post-9/11 GI Bill
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• Full tuition coverage at public schools</li>
                  <li>• Up to $28,937.44/year for private schools</li>
                  <li>• Monthly housing allowance</li>
                  <li>• $1,000 annual book stipend</li>
                  <li>• 36 months of benefits</li>
                  <li>• Transferable to dependents</li>
                </ul>
                <Link href="/consultation-booking?service=gi-bill">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Learn About GI Bill
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Shield className="w-6 h-6 text-green-600" />
                  Vocational Rehabilitation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• Career counseling and planning</li>
                  <li>• Skills training and certification</li>
                  <li>• Job placement assistance</li>
                  <li>• Monthly living allowance</li>
                  <li>• Up to 48 months of benefits</li>
                  <li>• For service-connected disabilities</li>
                </ul>
                <Link href="/consultation-booking?service=voc-rehab">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Explore Voc Rehab
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Get Help Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Users className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Maximize Your VA Benefits</h2>
          <p className="text-xl mb-8">
            Don't leave money on the table. Get expert help with your VA claims and ensure you receive 
            all the benefits you've earned through your service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/benefits-eligibility">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Your Benefits
              </Button>
            </Link>
            <Link href="/consultation-booking?service=va-claims">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
                Get Claims Assistance
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}