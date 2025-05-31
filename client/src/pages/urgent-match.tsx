import Header from "@/components/header";
import Footer from "@/components/footer";
import UrgentAttorneyMatcher from "@/components/urgent-attorney-matcher";
import { AlertTriangle, Shield, Clock, Phone, FileText, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function UrgentMatch() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-900 via-red-800 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-full">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Urgent Legal Defense Matching
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            When the fight comes to you, we help you fight back—smartly and effectively.
            Get matched with the right defense attorney for your situation in minutes.
          </p>
        </div>
      </section>

      {/* Urgent Matching Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UrgentAttorneyMatcher />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Urgent Matching Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fast, reliable attorney matching designed for military personnel in crisis
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <Clock className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Quick Assessment</h3>
              <p className="text-gray-600">
                Answer a few key questions about your location, case type, urgency, and budget preferences
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Smart Matching</h3>
              <p className="text-gray-600">
                Our system matches you with qualified defense attorneys based on your specific needs and location
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Phone className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Immediate Contact</h3>
              <p className="text-gray-600">
                Get instant contact information and response times for attorneys ready to take your case
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Features */}
      <section className="py-16 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Emergency Legal Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Critical features for urgent legal situations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-red-600">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <CardTitle className="text-sm">24-48 Hour Response</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">
                  Emergency attorneys available for critical situations
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-600">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm">All Branches Covered</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">
                  Army, Navy, Marines, Air Force, Coast Guard, Space Force, Veterans
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-600">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-sm">Budget Options</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">
                  Affordable ($150-250), Standard ($275-400), Premium ($450-650)
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-600">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-sm">Verified Attorneys</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">
                  Military law specialists with proven track records
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Case Types */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Legal Issues We Handle
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive defense for all military legal matters
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Court-Martial Defense",
              "Article 15 / NJP",
              "Security Clearance Issues",
              "Administrative Actions",
              "Appeals Process",
              "Discharge Upgrades",
              "UCMJ Violations",
              "Military Criminal Defense",
              "Career Protection"
            ].map((caseType, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Badge variant="outline" className="mr-3">
                  <Shield className="h-3 w-3 mr-1" />
                </Badge>
                <span className="font-medium text-gray-900">{caseType}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}