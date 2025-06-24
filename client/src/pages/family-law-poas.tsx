import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  FileText, 
  Shield, 
  Home, 
  Baby,
  Users,
  Scale,
  Download,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";

export default function FamilyLawPOAs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6">Family Law & Power of Attorney</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Protecting military families through comprehensive legal support for divorce, custody, 
              deployment preparations, and essential legal documents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/consultation-booking">
                <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                  Family Law Consultation
                </Button>
              </Link>
              <Link href="/document-generator">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-navy-900">
                  Create Legal Documents
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Family Law Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Family Law Services</h2>
            <p className="text-xl text-gray-600">Specialized legal support for military families</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Scale className="w-8 h-8 text-blue-600" />
                  <div>
                    <CardTitle className="text-xl">Military Divorce</CardTitle>
                    <Badge variant="outline" className="mt-1">Complex Cases</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• Military pension division</li>
                  <li>• BAH and allowances</li>
                  <li>• Geographic separation issues</li>
                  <li>• USFSPA compliance</li>
                  <li>• Deployment considerations</li>
                </ul>
                <Link href="/consultation-booking?service=divorce">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Divorce Consultation
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Baby className="w-8 h-8 text-green-600" />
                  <div>
                    <CardTitle className="text-xl">Child Custody</CardTitle>
                    <Badge variant="outline" className="mt-1">Deployment Ready</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• Deployment custody plans</li>
                  <li>• Interstate custody issues</li>
                  <li>• Visitation schedules</li>
                  <li>• Emergency custody orders</li>
                  <li>• Child support calculations</li>
                </ul>
                <Link href="/consultation-booking?service=custody">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Custody Consultation
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Home className="w-8 h-8 text-purple-600" />
                  <div>
                    <CardTitle className="text-xl">Domestic Relations</CardTitle>
                    <Badge variant="outline" className="mt-1">Family Protection</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li>• Domestic violence protection</li>
                  <li>• Restraining orders</li>
                  <li>• Family care plans</li>
                  <li>• Adoption proceedings</li>
                  <li>• Prenuptial agreements</li>
                </ul>
                <Link href="/consultation-booking?service=domestic">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Family Protection
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Power of Attorney Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Power of Attorney Documents</h2>
            <p className="text-xl text-gray-600">Essential legal documents for deployment and military life</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-orange-600" />
                  <div>
                    <CardTitle className="text-xl">General Power of Attorney</CardTitle>
                    <Badge className="bg-orange-100 text-orange-800 mt-1">Most Common</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Comprehensive legal authority for your spouse or trusted person to handle financial, 
                    legal, and personal matters during deployment or absence.
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Covers:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Banking and financial transactions</li>
                      <li>• Real estate matters</li>
                      <li>• Vehicle registration and sales</li>
                      <li>• Tax filings and IRS matters</li>
                      <li>• Insurance claims</li>
                      <li>• Legal proceedings</li>
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Link href="/document-generator?type=general-poa">
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        Create Document
                      </Button>
                    </Link>
                    <a href="/attached_assets/General_Power_of_Attorney_1750042491350.docx" download>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Template
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  <div>
                    <CardTitle className="text-xl">Medical Power of Attorney</CardTitle>
                    <Badge className="bg-blue-100 text-blue-800 mt-1">Healthcare</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Authorizes your designated person to make healthcare decisions for you and your 
                    family members when you're unable to do so.
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Includes:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Medical treatment decisions</li>
                      <li>• TRICARE and insurance claims</li>
                      <li>• Hospital admissions</li>
                      <li>• Family member healthcare</li>
                      <li>• Emergency medical decisions</li>
                      <li>• Medical record access</li>
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Link href="/document-generator?type=medical-poa">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Create Document
                      </Button>
                    </Link>
                    <a href="/attached_assets/Medical-Power-of-Attorney-Form_1750042491351.docx" download>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Template
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-red-600" />
                  <div>
                    <CardTitle className="text-xl">Special Power of Attorney</CardTitle>
                    <Badge className="bg-red-100 text-red-800 mt-1">Limited Scope</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Limited legal authority for specific transactions or time periods. 
                    Ideal for single transactions or specific purposes.
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Common Uses:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Vehicle sales or purchases</li>
                      <li>• Real estate closings</li>
                      <li>• Specific financial transactions</li>
                      <li>• Child care authorizations</li>
                      <li>• Government benefit claims</li>
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Link href="/document-generator?type=special-poa">
                      <Button className="bg-red-600 hover:bg-red-700">
                        Create Document
                      </Button>
                    </Link>
                    <a href="/attached_assets/Special_Power_of_Attorney_1750042491353.docx" download>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Template
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Deployment Preparation */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Deployment Legal Checklist</h2>
            <p className="text-xl text-gray-600">Essential legal preparations before deployment</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Power of Attorney", desc: "General and special POA documents", status: "required" },
              { title: "Will and Testament", desc: "Updated will with military considerations", status: "required" },
              { title: "Family Care Plan", desc: "Child care arrangements and emergency contacts", status: "required" },
              { title: "Financial Power of Attorney", desc: "Banking and financial management authority", status: "recommended" },
              { title: "Medical Power of Attorney", desc: "Healthcare decisions for family members", status: "recommended" },
              { title: "Guardianship Documents", desc: "Temporary guardianship for children", status: "conditional" },
              { title: "Property Management", desc: "Real estate and vehicle management", status: "conditional" },
              { title: "Insurance Updates", desc: "Beneficiaries and coverage updates", status: "recommended" },
              { title: "Emergency Contacts", desc: "Comprehensive emergency contact list", status: "required" }
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {item.status === "required" && <AlertCircle className="w-5 h-5 text-red-600" />}
                      {item.status === "recommended" && <CheckCircle className="w-5 h-5 text-orange-600" />}
                      {item.status === "conditional" && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.desc}</p>
                      <Badge 
                        variant={item.status === "required" ? "destructive" : 
                                item.status === "recommended" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/document-generator">
                <Button size="lg" className="bg-navy-900 hover:bg-navy-800">
                  <FileText className="w-5 h-5 mr-2" />
                  Start Deployment Prep
                </Button>
              </Link>
              <Link href="/consultation-booking?service=deployment">
                <Button size="lg" variant="outline" className="border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white">
                  <Users className="w-5 h-5 mr-2" />
                  Get Professional Help
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Our attorneys can help you complete all deployment preparations and ensure your family is protected while you serve.
            </p>
          </div>
        </div>
      </section>

      {/* Get Help Section */}
      <section className="py-16 bg-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Users className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Protect Your Family's Future</h2>
          <p className="text-xl mb-8">
            Get expert legal guidance for family matters and ensure your loved ones are protected 
            during deployments and military transitions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/consultation-booking">
              <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
                Schedule Family Law Consultation
              </Button>
            </Link>
            <Link href="/emergency-consultation">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-pink-600">
                Emergency Family Legal Help
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}